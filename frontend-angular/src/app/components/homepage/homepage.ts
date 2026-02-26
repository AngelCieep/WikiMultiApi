import { Component, inject, signal, computed, effect, untracked } from '@angular/core';
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
  loadingToggleId = signal<string | null>(null);
  
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
    // Watch for search term changes - reset to page 1
    effect(() => {
      this.searchTerm(); // Track this
      untracked(() => {
        this.currentPage.set(1);
      });
    });
    
    // Watch for filter changes - reset to page 1 when not searching
    effect(() => {
      this.sortBy();
      this.order();
      untracked(() => {
        const isSearch = this.searchTerm().trim() !== '';
        if (!isSearch) {
          this.currentPage.set(1);
        }
      });
    });
    
    // Watch for page changes - load data
    effect(() => {
      this.currentPage(); // Track page changes
      untracked(() => {
        this.loadUniverses();
      });
    });
  }

  private loadUniverses(): void {
    this.loading.set(true);
    this.error.set(null);
    
    // Read all signals in untracked context to avoid triggering effects
    const isSearch = untracked(() => this.isSearchMode());
    const searchTerm = untracked(() => this.searchTerm());
    const currentPage = untracked(() => this.currentPage());
    const sortBy = untracked(() => this.sortBy());
    const order = untracked(() => this.order());
    
    const apiCall = isSearch
      ? this.apiService.searchUniverses(
          searchTerm,
          currentPage,
          this.itemsPerPage
        )
      : this.apiService.getUniversesFiltered(
          currentPage,
          this.itemsPerPage,
          sortBy,
          order
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
          this.totalPages.set(itemsCount < this.itemsPerPage ? 1 : currentPage + 1);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  prevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPage.set(this.currentPage() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleUniverseStatus(event: Event, universo: UniverseCard): void {
    event.preventDefault();
    event.stopPropagation();

    const action = universo.isActive ? 'desactivar' : 'activar';
    const confirmMessage = `¿Estás seguro de que deseas ${action} "${universo.name}"?`;
    
    if (!confirm(confirmMessage)) return;

    this.loadingToggleId.set(universo._id);

    const updateData = {
      ...universo,
      isActive: !universo.isActive
    };

    this.apiService.updateUniverse(universo._id, updateData).subscribe({
      next: (response) => {
        // Update the universe in the list
        const currentUniversos = this.universos();
        const updatedUniversos = currentUniversos.map(u => 
          u._id === universo._id ? { ...u, isActive: !u.isActive } : u
        );
        this.universos.set(updatedUniversos);
        this.loadingToggleId.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.error || `Error al ${action} el universo`);
        this.loadingToggleId.set(null);
        console.error('Error al actualizar universo:', err);
      }
    });
  }
}
