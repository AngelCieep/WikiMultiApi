import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CharacterDetail, UniverseStyle } from '../../../common/interfaces';

@Component({
  selector: 'app-personaje-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './personaje-detail.html',
  styles: `
    .character-image-container {
      max-height: 600px;
      overflow: hidden;
      border-radius: 8px;
    }
    .character-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .stat-bar {
      height: 8px;
      border-radius: 4px;
      background-color: #e9ecef;
      overflow: hidden;
    }
    .stat-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
  `,
})
export class PersonajeDetail implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  character = signal<CharacterDetail | null>(null);
  universeStyle = signal<UniverseStyle | null>(null);
  loading = signal<boolean>(true);
  loadingToggle = signal<boolean>(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const universeId = this.route.snapshot.paramMap.get('universeId');
    const characterId = this.route.snapshot.paramMap.get('id');
    
    if (universeId && characterId) {
      this.loadCharacter(universeId, characterId);
    } else {
      this.error.set('Parámetros de ruta inválidos');
      this.loading.set(false);
    }
  }

  private loadCharacter(universeId: string, characterId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getCharacter(universeId, characterId).subscribe({
      next: (response) => {
        this.character.set(response.status);
        this.loading.set(false);
        
        // Load universe to get slug, then load style
        if (response.status.universeId) {
          this.loadUniverseStyle(response.status.universeId);
        }
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar el personaje');
        this.loading.set(false);
        console.error('Error al cargar personaje:', err);
      }
    });
  }

  private loadUniverseStyle(universeId: string): void {
    // First get universe to obtain slug
    this.apiService.getUniverse(universeId).subscribe({
      next: (universeResponse) => {
        const slug = universeResponse.status.slug;
        
        // Then get style using slug
        this.apiService.getUniverseStyle(slug).subscribe({
          next: (styleResponse) => {
            this.universeStyle.set(styleResponse.status);
          },
          error: (err) => {
            console.error('Error al cargar estilo del universo:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar universo:', err);
      }
    });
  }

  goToUniverse(): void {
    const universeId = this.character()?.universeId;
    if (universeId) {
      this.router.navigate(['/universo', universeId]);
    }
  }

  toggleCharacterStatus(): void {
    const currentCharacter = this.character();
    if (!currentCharacter) return;

    this.loadingToggle.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const action = currentCharacter.booleanField ? 'desactivar' : 'activar';
    const updateData = {
      isActive: !currentCharacter.booleanField
    };

    this.apiService.updateCharacter(currentCharacter._id, updateData).subscribe({
      next: (response) => {
        const updatedCharacter = { ...currentCharacter, booleanField: !currentCharacter.booleanField };
        this.character.set(updatedCharacter);
        
        this.successMessage.set(`Personaje ${action}do correctamente`);
        this.loadingToggle.set(false);
        
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.error.set(err.error?.error || `Error al ${action} el personaje`);
        this.loadingToggle.set(false);
        console.error('Error al actualizar personaje:', err);
      }
    });
  }

  editCharacter(): void {
    const universeId = this.character()?.universeId;
    const characterId = this.character()?._id;
    if (universeId && characterId) {
      this.router.navigate(['/universo', universeId, 'personaje', 'editar', characterId]);
    }
  }

  getStatPercentage(value: number): number {
    return Math.min(100, Math.max(0, value));
  }
}

