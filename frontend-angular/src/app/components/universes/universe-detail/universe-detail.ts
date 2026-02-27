import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { UniverseDetail as UniverseDetailType, CharacterCard } from '../../../common/interfaces';

@Component({
  selector: 'app-universe-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './universe-detail.html',
  styles: `
    .hover-card {
      transition: transform 0.2s;
    }
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    }
    .pagination .page-link {
      border-color: #E8D5B7;
    }
    .pagination .page-item.disabled .page-link {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .pagination .page-link:hover:not(:disabled) {
      background-color: #F5EFE6;
    }
  `
})
export class UniverseDetail implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  universe = signal<UniverseDetailType | null>(null);
  characters = signal<CharacterCard[]>([]);
  loading = signal<boolean>(true);
  loadingCharacters = signal<boolean>(true);
  loadingToggle = signal<boolean>(false);
  loadingDelete = signal<boolean>(false);
  loadingCharacterToggle = signal<string | null>(null);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // Pagination signals
  currentPageChars = signal<number>(1);
  totalPagesChars = signal<number>(1);
  totalItemsChars = signal<number>(0);
  itemsPerPageChars = 8;
  
  // Computed signals
  hasPrevPageChars = computed(() => this.currentPageChars() > 1);
  hasNextPageChars = computed(() => this.currentPageChars() < this.totalPagesChars());
  
  private universeId: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUniverse(id);
    } else {
      this.error.set('ID de universo no válido');
      this.loading.set(false);
    }
  }

  private loadUniverse(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.universeId = id;

    this.apiService.getUniverse(id).subscribe({
      next: (response) => {
        this.universe.set(response.status);
        this.loading.set(false);
        
        // Load characters for this universe using ID
        this.loadCharacters();
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar el universo');
        this.loading.set(false);
        console.error('Error al cargar universo:', err);
      }
    });
  }

  private loadCharacters(): void {
    this.loadingCharacters.set(true);
    
    this.apiService.getCharactersByUniverseId(
      this.universeId, 
      this.currentPageChars(), 
      this.itemsPerPageChars
    ).subscribe({
      next: (response) => {
        this.characters.set(response.status || []);
        
        if (response.pagination) {
          this.totalPagesChars.set(response.pagination.totalPages || 1);
          this.totalItemsChars.set(response.pagination.total || 0);
        }
        
        this.loadingCharacters.set(false);
      },
      error: (err) => {
        console.error('Error al cargar personajes:', err);
        this.loadingCharacters.set(false);
      }
    });
  }
  
  nextPageChars(): void {
    if (this.hasNextPageChars()) {
      this.currentPageChars.set(this.currentPageChars() + 1);
      this.loadCharacters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  prevPageChars(): void {
    if (this.hasPrevPageChars()) {
      this.currentPageChars.set(this.currentPageChars() - 1);
      this.loadCharacters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToCharacter(characterId: string): void {
    const universeId = this.universe()?._id;
    if (universeId) {
      this.router.navigate(['/universo', universeId, 'personaje', characterId]);
    }
  }

  editCharacter(event: Event, characterId: string): void {
    event.stopPropagation();
    const universeId = this.universe()?._id;
    if (universeId) {
      this.router.navigate(['/universo', universeId, 'personaje', 'editar', characterId]);
    }
  }

  toggleUniverseStatus(): void {
    const currentUniverse = this.universe();
    if (!currentUniverse) return;

    const action = currentUniverse.isActive ? 'desactivar' : 'activar';
    const confirmMessage = `¿Estás seguro de que deseas ${action} este universo?`;
    
    if (!confirm(confirmMessage)) return;

    this.loadingToggle.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const updateData = {
      ...currentUniverse,
      isActive: !currentUniverse.isActive
    };

    this.apiService.updateUniverse(currentUniverse._id, updateData).subscribe({
      next: (response) => {
        this.universe.set(response.status);
        this.successMessage.set(`Universo ${action === 'desactivar' ? 'desactivado' : 'activado'} correctamente`);
        this.loadingToggle.set(false);
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.error.set(err.error?.error || `Error al ${action} el universo`);
        this.loadingToggle.set(false);
        console.error('Error al actualizar universo:', err);
      }
    });
  }

  editUniverse(): void {
    const universeId = this.universe()?._id;
    if (universeId) {
      this.router.navigate(['/universo/editar', universeId]);
    }
  }

  deleteUniverse(): void {
    const currentUniverse = this.universe();
    if (!currentUniverse) return;

    const confirmMessage = `¿Estás seguro de que deseas ELIMINAR "${currentUniverse.name}"? Esta acción no se puede deshacer y eliminará todos los personajes asociados.`;
    
    if (!confirm(confirmMessage)) return;

    this.loadingDelete.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    this.apiService.deleteUniverse(currentUniverse._id).subscribe({
      next: (response) => {
        this.successMessage.set('Universo eliminado correctamente. Redirigiendo...');
        
        // Redirect to homepage after 1 second
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al eliminar el universo');
        this.loadingDelete.set(false);
        console.error('Error al eliminar universo:', err);
      }
    });
  }

  toggleCharacterStatus(event: Event, characterId: string): void {
    event.stopPropagation();
    
    const character = this.characters().find(c => c._id === characterId);
    if (!character) return;

    this.loadingCharacterToggle.set(characterId);
    this.error.set(null);
    this.successMessage.set(null);

    const updateData = {
      isActive: !character.booleanField
    };

    this.apiService.updateCharacter(characterId, updateData).subscribe({
      next: (response) => {
        // Update character in the list
        const updatedCharacters = this.characters().map(c => 
          c._id === characterId ? { ...c, booleanField: !c.booleanField } : c
        );
        this.characters.set(updatedCharacters);
        
        this.successMessage.set(`Personaje ${updateData.isActive ? 'activado' : 'desactivado'} correctamente`);
        this.loadingCharacterToggle.set(null);
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al actualizar el personaje');
        this.loadingCharacterToggle.set(null);
        console.error('Error al actualizar personaje:', err);
      }
    });
  }
}
