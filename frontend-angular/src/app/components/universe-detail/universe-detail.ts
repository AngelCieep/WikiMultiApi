import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseDetail as UniverseDetailModel } from '../../interfaces/universe-detail.interface';
import { CharacterCard } from '../../interfaces/character-card.interface';

interface UniversePageData {
  universe: UniverseDetailModel | null;
  characters: CharacterCard[];
  notFound: boolean;
}

@Component({
  selector: 'app-universe-detail',
  imports: [CommonModule, RouterLink],
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
  readonly characters = computed(() => this.pageData()?.characters ?? []);
  readonly notFound = computed(() => this.pageData()?.notFound ?? false);
  readonly isLoading = computed(() => this.pageData() === undefined);

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
