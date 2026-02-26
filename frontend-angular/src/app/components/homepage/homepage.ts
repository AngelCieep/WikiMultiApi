import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { UniverseCard } from '../../common/interfaces';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  private readonly apiService: ApiService = inject(ApiService);
  
  // Data signals
  universos = signal<UniverseCard[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Search signals
  searchInput = signal<string>('');
  searchTerm = signal<string>('');
  
  // Filter signals
  sortBy = signal<string>('createdAt');
  order = signal<string>('desc');
  
  // Pagination signals
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  itemsPerPage = 4;
  
  // Computed signals
  hasPrevPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());
  isSearchMode = computed(() => this.searchTerm().trim() !== '');
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    // Show max 5 page numbers
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    // Adjust start if we're near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  constructor() {
    this.loadUniverses();
  }

  private loadUniverses(): void {
    this.loading.set(true);
    this.error.set(null);
    
    const isSearch = this.isSearchMode();
    
    const apiCall = isSearch
      ? this.apiService.searchUniverses(
          this.searchTerm(),
          this.currentPage(),
          this.itemsPerPage
        )
      : this.apiService.getUniversesFiltered(
          this.currentPage(),
          this.itemsPerPage,
          this.sortBy(),
          this.order()
        );
    
    apiCall.subscribe({
      next: (response) => {
        this.universos.set(response.status || []);
        
        // Calculate total pages from response
        if (response.pagination) {
          this.totalPages.set(response.pagination.totalPages || 1);
          this.totalItems.set(response.pagination.totalItems || 0);
        } else if (response.total) {
          this.totalItems.set(response.total);
          this.totalPages.set(Math.ceil(response.total / this.itemsPerPage));
        } else {
          const itemsCount = response.status?.length || 0;
          this.totalPages.set(itemsCount < this.itemsPerPage ? 1 : this.currentPage() + 1);
        }
        
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar los universos');
        this.loading.set(false);
        console.error('Error carga de universos:', err);
      },
      complete: () => {
        console.log('Universe List cargada correctamente');
      }
    });
  }
  
  handleSearch(event: Event): void {
    event.preventDefault();
    const trimmed = this.searchInput().trim();
    this.searchTerm.set(trimmed);
    this.currentPage.set(1);
    this.loadUniverses();
  }
  
  clearSearch(): void {
    this.searchInput.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.loadUniverses();
  }
  
  onSortChange(): void {
    if (!this.isSearchMode()) {
      this.currentPage.set(1);
      this.loadUniverses();
    }
  }
  
  onOrderChange(): void {
    if (!this.isSearchMode()) {
      this.currentPage.set(1);
      this.loadUniverses();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.currentPage.set(page);
      this.loadUniverses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  nextPage(): void {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }
  
  prevPage(): void {
    if (this.hasPrevPage()) {
      this.goToPage(this.currentPage() - 1);
    }
  }
}
