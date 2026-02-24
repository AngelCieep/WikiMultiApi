import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseDetail as UniverseDetailModel } from '../../interfaces/universe-detail.interface';
import { CharacterCard } from '../../interfaces/character-card.interface';
import Swal from 'sweetalert2';

interface UniversePageData {
  universe: UniverseDetailModel | null;
  characters: CharacterCard[];
  notFound: boolean;
}

@Component({
  selector: 'app-universe-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './universe-detail.html',
  styleUrl: './universe-detail.css',
})
export class UniverseDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private readonly pageData = toSignal<UniversePageData | undefined>(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) => {
        if (!slug) {
          return of({ universe: null, characters: [], notFound: true });
        }
        return this.api.getUniverses().pipe(
          map((res) => res.status.find((u) => u.slug === slug) ?? null),
          switchMap((universeCard) => {
            if (!universeCard) {
              return of({ universe: null, characters: [], notFound: true });
            }
            return forkJoin({
              universe: this.api.getUniverse(universeCard._id).pipe(
                map((res) => res.status)
              ),
              characters: this.api.getCharactersByUniverse(universeCard._id).pipe(
                map((res) => res.status),
                catchError(() => of([]))
              ),
            }).pipe(
              map(({ universe, characters }) => ({
                universe,
                characters,
                notFound: false,
              }))
            );
          })
        );
      }),
      catchError(() => of({ universe: null, characters: [], notFound: true }))
    ),
    { initialValue: undefined }
  );

  readonly universe = computed(() => this.pageData()?.universe ?? null);
  private readonly deletedIds = signal<Set<string>>(new Set());
  readonly allCharacters = computed(() =>
    (this.pageData()?.characters ?? []).filter(c => !this.deletedIds().has(c._id))
  );
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);

  readonly searchQuery = signal('');
  readonly sortBy = signal<'popular' | 'relevant' | 'date' | 'name'>('popular');
  readonly currentPage = signal(1);
  readonly itemsPerPage = 12;

  readonly characters = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    let list = q
      ? this.allCharacters().filter(c => c.name.toLowerCase().includes(q) || (c.title ?? '').toLowerCase().includes(q))
      : [...this.allCharacters()];
    switch (this.sortBy()) {
      case 'popular':  list.sort((a, b) => b.views - a.views); break;
      case 'relevant': list.sort((a, b) => a.views - b.views); break;
      case 'date':     list.sort((a, b) => b._id.localeCompare(a._id)); break;
      case 'name':     list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  });

  setSortBy(sort: 'popular' | 'relevant' | 'date' | 'name'): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
  }

  readonly totalPages = computed(() =>
    Math.ceil(this.characters().length / this.itemsPerPage)
  );

  readonly paginatedCharacters = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    return this.characters().slice(start, start + this.itemsPerPage);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5];
    if (current >= total - 3) return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
  });

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  async deleteCharacter(event: Event, character: CharacterCard): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const result = await Swal.fire({
      title: '¿Eliminar personaje?',
      html: `¿Seguro que quieres eliminar <strong>${character.name}</strong>? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    this.api.deleteCharacter(character._id).subscribe({
      next: () => {
        this.deletedIds.update(s => new Set([...s, character._id]));
        Swal.fire({ title: 'Eliminado', text: `${character.name} ha sido eliminado.`, icon: 'success', timer: 1800, showConfirmButton: false });
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar el personaje.', 'error'),
    });
  }

  hexToRgba(hex: string | null | undefined, alpha: number): string {
    if (!hex) return `rgba(18,18,26,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  constructor() {
    effect(() => {
      const font = this.universe()?.fontFamily;
      if (!font) return;
      const id = `gfont-${font.replace(/\s+/g, '-')}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap`;
        document.head.appendChild(link);
      }
    });
  }
}
