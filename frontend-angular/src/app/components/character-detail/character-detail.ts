import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';
import { CharacterDetail as CharacterDetailModel } from '../../interfaces/character-detail.interface';

interface CharacterPageData {
  universe: UniverseCard | null;
  character: CharacterDetailModel | null;
  notFound: boolean;
}

@Component({
  selector: 'app-character-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
})
export class CharacterDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  private readonly pageData = toSignal<CharacterPageData | undefined>(
    this.route.paramMap.pipe(
      map((params) => ({
        slug: params.get('slug') ?? '',
        id: params.get('id') ?? '',
      })),
      switchMap(({ slug, id }) => {
        if (!slug || !id) {
          return of({ universe: null, character: null, notFound: true });
        }
        return this.api.getUniverses().pipe(
          map((res) => res.status.find((u) => u.slug === slug) ?? null),
          switchMap((universeCard) => {
            if (!universeCard) {
              return of({ universe: null, character: null, notFound: true });
            }
            return this.api.getCharacter(id).pipe(
              map((res) => ({
                universe: universeCard,
                character: res.status,
                notFound: false,
              })),
              catchError(() => of({ universe: universeCard, character: null, notFound: true }))
            );
          })
        );
      }),
      catchError(() => of({ universe: null, character: null, notFound: true }))
    ),
    { initialValue: undefined }
  );

  readonly universe = computed(() => this.pageData()?.universe ?? null);
  readonly character = computed(() => this.pageData()?.character ?? null);
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);
}
