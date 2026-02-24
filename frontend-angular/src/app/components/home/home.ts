import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { UniverseDetail } from '../../interfaces/universe-detail.interface';
import { SafeBgPipe } from '../../pipes/safe-bg.pipe';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule, NgStyle, SafeBgPipe, SafeUrlPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  searchQuery: string = '';
  searchType: 'universes' | 'characters' = 'universes';
  searchTypeLabel = 'Universos';

  setSearchType(type: 'universes' | 'characters', label: string): void {
    this.searchType = type;
    this.searchTypeLabel = label;
  }

  // ── Slideshow ──────────────────────────────────────────────
  readonly bgImages: string[] = [
    '/img/bg1.webp',
    '/img/bg2.webp',
    '/img/bg3.webp',
    '/img/bg4.webp',
    '/img/bg5.webp',
  ];

  readonly currentIndex = signal(0);
  readonly nextIndex = signal(1);
  readonly transitioning = signal(false);

  readonly currentBg = computed(() => this.bgImages[this.currentIndex()]);
  readonly nextBg    = computed(() => this.bgImages[this.nextIndex()]);

  private readonly interval = setInterval(() => this.advance(), 25000);

  private advance(): void {
    const len = this.bgImages.length;
    this.nextIndex.set((this.currentIndex() + 1) % len);
    this.transitioning.set(true);
    setTimeout(() => {
      this.currentIndex.set(this.nextIndex());
      this.transitioning.set(false);
    }, 2000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  // ── Universos populares ────────────────────────────────────
  private readonly universes = toSignal(
    this.api.getUniverses().pipe(map((res) => res.status)),
    { initialValue: [] }
  );

  readonly popularUniverses = computed(() =>
    [...this.universes()]
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, 10)
  );

  // ── Universo y personaje destacado ────────────────────────
  readonly topUniverseDetail = toSignal(
    this.api.getUniverses().pipe(
      map(res => [...res.status].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))[0] ?? null),
      switchMap(u => u ? this.api.getUniverse(u._id).pipe(map(r => r.status), catchError(() => of(null))) : of(null))
    ),
    { initialValue: null as UniverseDetail | null }
  );

  readonly topCharacter = toSignal(
    this.api.getTopCharacter().pipe(map(r => r.status), catchError(() => of(null))),
    { initialValue: null }
  );

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    if (this.searchType === 'characters') {
      this.router.navigate(['/characters'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/universes'], { queryParams: { search: q } });
    }
  }
}
