import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CharacterCard } from '../../interfaces/character-card.interface';

@Component({
  selector: 'app-all-characters',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './all-characters.html',
  styleUrl: './all-characters.css',
})
export class AllCharacters {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly searchQuery = signal('');
  readonly sortBy = signal<'popular' | 'relevant' | 'date' | 'name'>('popular');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(24);

  // Fetch all characters
  private readonly allCharacters = toSignal(
    this.api.getCharacters().pipe(
      catchError(() => of({ status: [] }))
    ),
    { initialValue: { status: [] } }
  );

  readonly allCharactersList = computed(() => this.allCharacters()?.status ?? []);

  readonly characters = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    let list = q ? this.allCharactersList().filter(c => c.name.toLowerCase().includes(q)) : [...this.allCharactersList()];
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

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('search') ?? '';
      this.searchQuery.set(q);
      this.currentPage.set(1);
    });
  }
  readonly isLoading = computed(() => this.allCharacters() === undefined);

  // Pagination computed values
  readonly totalPages = computed(() => 
    Math.ceil(this.characters().length / this.itemsPerPage())
  );

  readonly paginatedCharacters = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.characters().slice(start, end);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    // Show max 7 page numbers
    let startPage = Math.max(1, current - 3);
    let endPage = Math.min(total, current + 3);
    
    if (endPage - startPage < 6) {
      if (startPage === 1) {
        endPage = Math.min(total, startPage + 6);
      } else {
        startPage = Math.max(1, endPage - 6);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
