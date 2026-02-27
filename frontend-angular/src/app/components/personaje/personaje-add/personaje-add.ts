import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-personaje-add',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './personaje-add.html',
  styles: `
    .preview-image {
      max-width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `,
})
export class PersonajeAdd implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  universeId = signal<string>('');
  isEditMode = signal<boolean>(false);
  characterId = signal<string | null>(null);
  
  // Preview signal
  imagePreview = signal<string>('');

  characterForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    title: ['', Validators.maxLength(200)],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    descriptionSections: this.formBuilder.array([]),
    image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    location: ['', Validators.maxLength(200)],
    affiliation: ['', Validators.maxLength(200)],
    type: ['', Validators.maxLength(100)],
    abilities: this.formBuilder.array([]),
    stats: this.formBuilder.array([]),
    numericField: [0, [Validators.required, Validators.min(0)]],
    dateField: ['', Validators.required],
    isActive: [true]
  });

  // Getters
  get name() {
    return this.characterForm.get('name');
  }
  
  get title() {
    return this.characterForm.get('title');
  }
  
  get description() {
    return this.characterForm.get('description');
  }
  
  get image() {
    return this.characterForm.get('image');
  }
  
  get location() {
    return this.characterForm.get('location');
  }
  
  get affiliation() {
    return this.characterForm.get('affiliation');
  }
  
  get type() {
    return this.characterForm.get('type');
  }
  
  get numericField() {
    return this.characterForm.get('numericField');
  }
  
  get dateField() {
    return this.characterForm.get('dateField');
  }
  
  get isActive() {
    return this.characterForm.get('isActive');
  }

  get descriptionSectionsArray(): FormArray {
    return this.characterForm.get('descriptionSections') as FormArray;
  }

  get abilitiesArray(): FormArray {
    return this.characterForm.get('abilities') as FormArray;
  }

  get statsArray(): FormArray {
    return this.characterForm.get('stats') as FormArray;
  }

  ngOnInit(): void {
    const universeId = this.route.snapshot.paramMap.get('universeId');
    const characterId = this.route.snapshot.paramMap.get('id');
    
    if (universeId) {
      this.universeId.set(universeId);
    } else {
      this.error.set('No se encontró el ID del universo');
      return;
    }

    if (characterId) {
      this.isEditMode.set(true);
      this.characterId.set(characterId);
      this.loadCharacter(universeId, characterId);
    }
  }

  private loadCharacter(universeId: string, characterId: string): void {
    this.loading.set(true);
    this.apiService.getCharacter(universeId, characterId).subscribe({
      next: (response) => {
        const character = response.status;
        
        // Populate form
        this.characterForm.patchValue({
          name: character.name,
          title: character.title || '',
          description: character.description,
          image: character.image,
          location: character.location || '',
          affiliation: character.affiliation || '',
          type: character.type || '',
          numericField: character.numericField,
          dateField: character.dateField ? character.dateField.split('T')[0] : '',
          isActive: character.booleanField !== undefined ? character.booleanField : true
        });

        // Set image preview
        if (character.image) this.imagePreview.set(character.image);

        // Add description sections
        if (character.descriptionSections && character.descriptionSections.length > 0) {
          character.descriptionSections.forEach(section => {
            const sectionGroup = this.formBuilder.group({
              sectionTitle: [section.sectionTitle || '', [Validators.required, Validators.maxLength(200)]],
              content: [section.content || '', [Validators.required, Validators.maxLength(5000)]]
            });
            this.descriptionSectionsArray.push(sectionGroup);
          });
        }

        // Add abilities
        if (character.abilities && character.abilities.length > 0) {
          character.abilities.forEach(ability => {
            this.abilitiesArray.push(this.formBuilder.control(ability, [Validators.required, Validators.maxLength(200)]));
          });
        }

        // Add stats
        if (character.stats && typeof character.stats === 'object') {
          Object.entries(character.stats).forEach(([key, value]) => {
            const statGroup = this.formBuilder.group({
              key: [key, [Validators.required, Validators.maxLength(100)]],
              value: [value, [Validators.required, Validators.min(0)]]
            });
            this.statsArray.push(statGroup);
          });
        }

        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el personaje');
        this.loading.set(false);
        console.error('===== ERROR AL CARGAR PERSONAJE =====');
        console.error('Error completo:', err);
        console.error('Mensaje de error:', err.error);
        console.error('Estado HTTP:', err.status);
        console.error('URL:', err.url);
        console.error('=====================================');
      }
    });
  }

  // Description Sections Methods
  addDescriptionSection(): void {
    const sectionGroup = this.formBuilder.group({
      sectionTitle: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(5000)]]
    });
    this.descriptionSectionsArray.push(sectionGroup);
  }

  removeDescriptionSection(index: number): void {
    this.descriptionSectionsArray.removeAt(index);
  }

  // Abilities Methods
  addAbility(): void {
    this.abilitiesArray.push(this.formBuilder.control('', [Validators.required, Validators.maxLength(200)]));
  }

  removeAbility(index: number): void {
    this.abilitiesArray.removeAt(index);
  }

  // Stats Methods
  addStat(): void {
    const statGroup = this.formBuilder.group({
      key: ['', [Validators.required, Validators.maxLength(100)]],
      value: [0, [Validators.required, Validators.min(0)]]
    });
    this.statsArray.push(statGroup);
  }

  removeStat(index: number): void {
    this.statsArray.removeAt(index);
  }

  // Image preview
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();
    if (url && url.match(/^https?:\/\/.+/)) {
      this.imagePreview.set(url);
    } else {
      this.imagePreview.set('');
    }
  }

  onSubmit(): void {
    if (!this.characterForm.valid) {
      this.characterForm.markAllAsTouched();
      
      let invalidCount = 0;
      const invalidFields: string[] = [];
      Object.keys(this.characterForm.controls).forEach(key => {
        const control = this.characterForm.get(key);
        if (control && control.invalid) {
          invalidCount++;
          invalidFields.push(key);
        }
      });
      
      console.error('===== FORMULARIO INVÁLIDO =====');
      console.error('Campos inválidos:', invalidFields);
      console.error('Total de campos con errores:', invalidCount);
      console.error('Errores por campo:', 
        Object.keys(this.characterForm.controls).reduce((acc: any, key) => {
          const control = this.characterForm.get(key);
          if (control && control.invalid) {
            acc[key] = control.errors;
          }
          return acc;
        }, {})
      );
      console.error('===============================');
      
      this.error.set(`Por favor, completa todos los campos requeridos correctamente. ${invalidCount} campo(s) con errores.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.characterForm.getRawValue();
    
    // Convert stats array to object
    const statsObject: { [key: string]: number } = {};
    formValue.stats.forEach((stat: { key: string; value: number }) => {
      if (stat.key && stat.value !== null && stat.value !== undefined) {
        statsObject[stat.key] = stat.value;
      }
    });

    const characterData = {
      ...formValue,
      universeId: this.universeId(),
      stats: statsObject,
      abilities: formValue.abilities.filter((ability: string) => ability.trim() !== '')
    };

    console.log(`===== ${this.isEditMode() ? 'ACTUALIZANDO' : 'CREANDO'} PERSONAJE =====`);
    console.log('Modo edición:', this.isEditMode());
    console.log('ID del personaje:', this.characterId());
    console.log('ID del universo:', this.universeId());
    console.log('Datos a enviar:', characterData);
    console.log('=======================================================');

    const apiCall = this.isEditMode() && this.characterId()
      ? this.apiService.updateCharacter(this.characterId()!, characterData)
      : this.apiService.addCharacter(characterData);

    apiCall.subscribe({
      next: (response) => {
        this.success.set(true);
        this.loading.set(false);
        console.log(`===== ÉXITO: PERSONAJE ${this.isEditMode() ? 'ACTUALIZADO' : 'CREADO'} =====`);
        console.log('Respuesta del servidor:', response);
        console.log('=======================================================');
        
        setTimeout(() => {
          if (this.isEditMode() && this.characterId()) {
            console.log('Navegando a detalle del personaje...');
            this.router.navigate(['/universo', this.universeId(), 'personaje', this.characterId()]);
          } else {
            console.log('Navegando a detalle del universo...');
            this.router.navigate(['/universo', this.universeId()]);
          }
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.error?.error || `Error al ${this.isEditMode() ? 'actualizar' : 'crear'} el personaje`);
        this.loading.set(false);
        console.error(`===== ERROR AL ${this.isEditMode() ? 'ACTUALIZAR' : 'CREAR'} PERSONAJE =====`);
        console.error('Error completo:', err);
        console.error('Mensaje de error:', err.error);
        console.error('Estado HTTP:', err.status);
        console.error('URL:', err.url);
        console.error('Datos enviados:', characterData);
        console.error('ID del personaje:', this.characterId());
        console.error('ID del universo:', this.universeId());
        console.error('====================================================');
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}

