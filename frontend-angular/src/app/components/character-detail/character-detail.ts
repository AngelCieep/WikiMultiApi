import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseStyle } from '../../interfaces/universe-style.interface';
import { CharacterDetail as CharacterDetailModel } from '../../interfaces/character-detail.interface';

interface CharacterPageData {
  universe: UniverseStyle | null;
  character: CharacterDetailModel | null;
  notFound: boolean;
}

@Component({
  selector: 'app-character-detail',
  imports: [CommonModule, RouterLink, KeyValuePipe],
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
        if (!id) {
          return of({ universe: null, character: null, notFound: true });
        }

        if (slug) {
          // Ruta con slug: /universes/:slug/characters/:id
          return forkJoin({
            universe: this.api.getUniverseStyle(slug).pipe(map((r) => r.status)),
            character: this.api.getCharacter(id).pipe(map((r) => r.status)),
          }).pipe(
            map(({ universe, character }) => ({ universe, character, notFound: false })),
            catchError(() => of({ universe: null, character: null, notFound: true }))
          );
        } else {
          // Ruta sin slug: /character/:id — obtener universo desde el personaje
          return this.api.getCharacter(id).pipe(
            map((r) => r.status),
            switchMap((character) =>
              this.api.getUniverse(character.universeId).pipe(
                switchMap((univRes) =>
                  this.api.getUniverseStyle(univRes.status.slug).pipe(
                    map((styleRes) => ({
                      universe: styleRes.status,
                      character,
                      notFound: false,
                    }))
                  )
                )
              )
            ),
            catchError(() => of({ universe: null, character: null, notFound: true }))
          );
        }
      }),
      catchError(() => of({ universe: null, character: null, notFound: true }))
    ),
    { initialValue: undefined }
  );

  readonly universe = computed(() => this.pageData()?.universe ?? null);
  readonly character = computed(() => this.pageData()?.character ?? null);
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);

  constructor() {
    effect(() => {
      const fontFamily = this.universe()?.fontFamily;
      if (fontFamily) {
        const id = `font-${fontFamily.replace(/\s+/g, '-')}`;
        if (!document.getElementById(id)) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  }
}
