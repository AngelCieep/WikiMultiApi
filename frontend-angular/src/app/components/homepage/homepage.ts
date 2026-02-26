import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SearchService } from '../../service/search.service';
import { UniverseCard } from '../../common/interfaces';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly searchService: SearchService = inject(SearchService);
  
  // Data signals
  universos = signal<UniverseCard[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Search signal from service
  searchTerm = this.searchService.searchTerm;
  
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

  constructor() {
    // Watch for search term changes from navbar
    effect(() => {
      const term = this.searchTerm();
      this.currentPage.set(1);
      this.loadUniverses();
    });
    
    // Watch for filter changes
    effect(() => {
      const sort = this.sortBy();
      const ord = this.order();
      
      if (!this.isSearchMode()) {
        this.currentPage.set(1);
        this.loadUniverses();
      }
    }, { allowSignalWrites: true });
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
  
  clearSearch(): void {
    this.searchService.clearSearch();
  }
  
  onSortChange(): void {
    // Effect will trigger reload
  }
  
  onOrderChange(): void {
    // Effect will trigger reload
  }
  
  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadUniverses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  prevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadUniverses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
