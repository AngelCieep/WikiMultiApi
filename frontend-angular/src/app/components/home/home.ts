import { Component, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { UniverseCard } from '../../interfaces/universe-card.interface';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule, NgStyle],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  searchQuery: string = '';

  private readonly universes = toSignal(
    this.api.getUniverses().pipe(
      map((res) => res.status)
    ),
    { initialValue: [] }
  );

  readonly popularUniverses = computed(() => {
    const all = this.universes();
    return [...all]
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, 6);
  });

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/universes'], { queryParams: { search: this.searchQuery } });
    }
  }
}
