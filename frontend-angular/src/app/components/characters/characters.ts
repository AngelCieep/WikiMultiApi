import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';
import { CharacterCard } from '../../interfaces/character-card.interface';

interface CharactersPageData {
  universe: UniverseCard | null;
  characters: CharacterCard[];
  notFound: boolean;
}

@Component({
  selector: 'app-characters',
  imports: [CommonModule, RouterLink],
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
  readonly characters = computed(() => this.pageData()?.characters ?? []);
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);
}
