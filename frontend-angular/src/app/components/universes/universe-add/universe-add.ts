import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-universe-add',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './universe-add.html',
  styles: `
    .preview-image {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .preview-background {
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .color-preview {
      width: 60px;
      height: 38px;
      border-radius: 4px;
      border: 2px solid #dee2e6;
    }
  `,
})
export class UniverseAdd {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router: Router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  
  // Preview signals
  logoPreview = signal<string>('');
  backgroundPreview = signal<string>('');
  buttonImagePreview = signal<string>('');

  universeForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    logo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    backgroundImage: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    imagenBoton: ['', Validators.pattern(/^https?:\/\/.+/)],
    fontFamily: ['', Validators.maxLength(100)],
    primaryColor: ['#7D2424', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    secondaryColor: ['#5A4A42', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
    tertiaryColor: ['#C9A96E', Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
    textColor: ['#000000', Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
    popularityScore: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
    releaseDate: ['', Validators.required],
    isActive: [true],
    hasType: [false],
    hasAbilities: [false],
    hasStats: [false],
    labels: this.formBuilder.group({
      type: ['Tipo'],
      abilities: ['Habilidades'],
      stats: ['Estadísticas']
    }),
    statLabels: this.formBuilder.array([])
  });

  // Getters para los campos del formulario
  get name(): any {
    return this.universeForm.get('name');
  }
  
  get slug(): any {
    return this.universeForm.get('slug');
  }
  
  get description(): any {
    return this.universeForm.get('description');
  }
  
  get logo(): any {
    return this.universeForm.get('logo');
  }
  
  get backgroundImage(): any {
    return this.universeForm.get('backgroundImage');
  }
  
  get imagenBoton(): any {
    return this.universeForm.get('imagenBoton');
  }
  
  get fontFamily(): any {
    return this.universeForm.get('fontFamily');
  }
  
  get primaryColor(): any {
    return this.universeForm.get('primaryColor');
  }
  
  get secondaryColor(): any {
    return this.universeForm.get('secondaryColor');
  }
  
  get tertiaryColor(): any {
    return this.universeForm.get('tertiaryColor');
  }
  
  get textColor(): any {
    return this.universeForm.get('textColor');
  }
  
  get popularityScore(): any {
    return this.universeForm.get('popularityScore');
  }
  
  get releaseDate(): any {
    return this.universeForm.get('releaseDate');
  }
  
  get isActive(): any {
    return this.universeForm.get('isActive');
  }
  
  get hasType(): any {
    return this.universeForm.get('hasType');
  }
  
  get hasAbilities(): any {
    return this.universeForm.get('hasAbilities');
  }
  
  get hasStats(): any {
    return this.universeForm.get('hasStats');
  }
  
  get labels(): any {
    return this.universeForm.get('labels');
  }

  get statLabelsArray(): FormArray {
    return this.universeForm.get('statLabels') as FormArray;
  }

  addStatLabel(): void {
    const statLabelGroup = this.formBuilder.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
    this.statLabelsArray.push(statLabelGroup);
  }

  removeStatLabel(index: number): void {
    this.statLabelsArray.removeAt(index);
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    if (url && url.match(/^https?:\/\/.+/)) {
      this.logoPreview.set(url);
    } else {
      this.logoPreview.set('');
    }
  }

  onBackgroundChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    if (url && url.match(/^https?:\/\/.+/)) {
      this.backgroundPreview.set(url);
    } else {
      this.backgroundPreview.set('');
    }
  }

  onButtonImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    if (url && url.match(/^https?:\/\/.+/)) {
      this.buttonImagePreview.set(url);
    } else {
      this.buttonImagePreview.set('');
    }
  }

  generateSlug(): void {
    const name = this.name.value || '';
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.universeForm.patchValue({ slug });
  }

  onSubmit(): void {
    if (!this.universeForm.valid) {
      this.universeForm.markAllAsTouched();
      
      // Count invalid fields
      let invalidCount = 0;
      Object.keys(this.universeForm.controls).forEach(key => {
        const control = this.universeForm.get(key);
        if (control && control.invalid) {
          invalidCount++;
        }
      });
      
      this.error.set(`Por favor, completa todos los campos requeridos correctamente. ${invalidCount} campo(s) con errores.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.universeForm.getRawValue();
    
    // Convert statLabels array to object
    const statLabelsObject: { [key: string]: string } = {};
    formValue.statLabels.forEach((label: { key: string; value: string }) => {
      if (label.key && label.value) {
        statLabelsObject[label.key] = label.value;
      }
    });

    const universeData = {
      ...formValue,
      statLabels: statLabelsObject
    };

    this.apiService.addUniverse(universeData).subscribe({
      next: (response) => {
        this.success.set(true);
        this.loading.set(false);
        console.log('Universo creado exitosamente', response);
        
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al crear el universo');
        this.loading.set(false);
        console.error('Error al crear universo:', err);
      },
      complete: () => {
        console.log('Petición de creación de universo completada');
      }
    });
  }
}

