import { Component, computed, signal, inject, effect } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-universes',
  imports: [CommonModule, NgStyle, RouterLink, FormsModule],
  templateUrl: './universes.html',
  styleUrl: './universes.css',
})
export class Universes {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  private readonly universesResponse = toSignal(this.api.getUniverses());

  private readonly deletedIds = signal<Set<string>>(new Set());

  readonly allUniverses = computed<UniverseCard[]>(
    () => (this.universesResponse()?.status ?? []).filter(u => !this.deletedIds().has(u._id))
  );
  readonly isLoading = computed(() => this.universesResponse() === undefined);

  readonly searchQuery = signal('');
  readonly sortBy = signal<'popular' | 'relevant' | 'date' | 'name'>('popular');
  readonly currentPage = signal(1);
  readonly pageSize = 30;

  readonly universes = computed<UniverseCard[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    let list = q ? this.allUniverses().filter(u => u.name.toLowerCase().includes(q)) : [...this.allUniverses()];
    switch (this.sortBy()) {
      case 'popular':   list.sort((a, b) => b.popularityScore - a.popularityScore); break;
      case 'relevant':  list.sort((a, b) => a.popularityScore - b.popularityScore); break;
      case 'date':      list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()); break;
      case 'name':      list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.universes().length / this.pageSize)
  );
  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
  readonly pagedUniverses = computed<UniverseCard[]>(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.universes().slice(start, start + this.pageSize);
  });

  onSearchChange(): void {
    this.currentPage.set(1);
  }

  setSortBy(sort: 'popular' | 'relevant' | 'date' | 'name'): void {
    this.sortBy.set(sort);
    this.currentPage.set(1);
  }

  constructor() {
    // Leer query param 'search' al entrar desde home
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('search') ?? '';
      this.searchQuery.set(q);
      this.currentPage.set(1);
    });

    // Carga dinámicamente las Google Fonts de cada universo
    effect(() => {
      const fonts = [...new Set(
        this.universes()
          .map(u => u.fontFamily)
          .filter(Boolean)
      )];
      fonts.forEach(font => {
        const id = `gfont-${font.replace(/\s+/g, '-')}`;
        if (!document.getElementById(id)) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap`;
          document.head.appendChild(link);
        }
      });
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteUniverse(event: Event, universe: UniverseCard): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const result = await Swal.fire({
      title: '¿Eliminar universo?',
      html: `¿Seguro que quieres eliminar <strong>${universe.name}</strong>? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    this.api.deleteUniverse(universe._id).subscribe({
      next: () => {
        this.deletedIds.update(s => new Set([...s, universe._id]));
        Swal.fire({ title: 'Eliminado', text: `${universe.name} ha sido eliminado.`, icon: 'success', timer: 1800, showConfirmButton: false });
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar el universo.', 'error'),
    });
  }
}
