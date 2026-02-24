import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';
import { CharacterCard } from '../../interfaces/character-card.interface';
import Swal from 'sweetalert2';

interface CharactersPageData {
  universe: UniverseCard | null;
  characters: CharacterCard[];
  notFound: boolean;
}

@Component({
  selector: 'app-characters',
  imports: [CommonModule, RouterLink, SafeUrlPipe],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private readonly pageData = toSignal<CharactersPageData | undefined>(
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
            return this.api.getCharactersByUniverse(universeCard._id).pipe(
              map((res) => ({
                universe: universeCard,
                characters: res.status,
                notFound: false,
              })),
              catchError(() => of({ universe: universeCard, characters: [], notFound: false }))
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
  readonly characters = computed(() =>
    (this.pageData()?.characters ?? []).filter(c => !this.deletedIds().has(c._id))
  );
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);

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
}
