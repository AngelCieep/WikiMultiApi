import { Component, computed, signal, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';

@Component({
  selector: 'app-universes',
  imports: [CommonModule, NgStyle, RouterLink],
  templateUrl: './universes.html',
  styleUrl: './universes.css',
})
export class Universes {
  private readonly api = inject(ApiService);

  private readonly universesResponse = toSignal(this.api.getUniverses());

  readonly universes = computed<UniverseCard[]>(
    () => this.universesResponse()?.status ?? []
  );
  readonly isLoading = computed(() => this.universesResponse() === undefined);

  readonly currentPage = signal(1);
  readonly pageSize = 30;

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

  constructor() {
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
}
