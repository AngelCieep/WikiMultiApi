import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SafeBgPipe } from '../../pipes/safe-bg.pipe';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-universe',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SafeBgPipe],
  templateUrl: './add-universe.html',
  styleUrl: './add-universe.css',
})
export class AddUniverse {
  private readonly fb     = inject(FormBuilder);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMsg     = signal('');
  readonly successMsg   = signal('');
  readonly showCustomFont = signal(false);

  // Lista de tipografías comunes
  readonly fontOptions = [
    "'Arial', sans-serif",
    "'Helvetica', sans-serif",
    "'Times New Roman', serif",
    "'Georgia', serif",
    "'Courier New', monospace",
    "'Verdana', sans-serif",
    "'Trebuchet MS', sans-serif",
    "'Comic Sans MS', cursive",
    "'Impact', sans-serif",
    "'Roboto', sans-serif",
    "'Open Sans', sans-serif",
    "'Lato', sans-serif",
    "'Montserrat', sans-serif",
    "'Oswald', sans-serif",
    "'Ubuntu', sans-serif",
    "'Press Start 2P', cursive",
    "'Creepster', cursive",
    "'Orbitron', sans-serif",
    "'Righteous', cursive",
    "'Bangers', cursive",
    "'Pacifico', cursive",
    "'Permanent Marker', cursive",
  ];

  form: FormGroup = this.fb.group({
    // Información principal
    name:            ['', Validators.required],
    slug:            ['', [Validators.required, Validators.pattern(/^[a-z0-9\-]+$/)]],
    description:     [''],

    // Imágenes
    logo:            [''],
    backgroundImage: [''],
    imagenBoton:     [''],

    // Estilos
    fontFamily:      [''],
    primaryColor:    ['#000000'],
    secondaryColor:  ['#ffffff'],
    tertiaryColor:   ['#cccccc'],
    textColor:       ['#ffffff'],

    // Campos obligatorios
    popularityScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    releaseDate:     ['', Validators.required],
    isActive:        [true, Validators.required],

    // Display flags
    hasType:         [true],
    hasAbilities:    [true],
    hasStats:        [true],

    // Labels
    labelType:       [''],
    labelAbilities:  [''],
    labelStats:      [''],

    // Mapas dinámicos
    statLabels:      this.fb.array([]),
  });

  // ── Getters FormArrays ───────────────────────────────────────
  get statLabels()    { return this.form.get('statLabels')    as FormArray; }

  private newPair(k = '', v = ''): FormGroup {
    return this.fb.group({ key: [k], value: [v] });
  }

  addStatLabel()    { this.statLabels.push(this.newPair()); }

  removeStatLabel(i: number)    { this.statLabels.removeAt(i); }

  // ── Selección de fuente ────────────────────────────────
  onFontSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'custom') {
      this.showCustomFont.set(true);
      this.form.get('fontFamily')!.setValue('');
    } else {
      this.showCustomFont.set(false);
      this.form.get('fontFamily')!.setValue(value);
    }
  }

  // ── Manejo de error en imágenes ────────────────────────────
  onImgError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.style.display = 'none';
  }

  // ── Auto-slug desde name ─────────────────────────────────────
  onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const slug  = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    this.form.get('slug')!.setValue(slug, { emitEvent: false });
  }

  // ── Convertir array de pares a objeto ────────────────────────
  private pairsToMap(pairs: { key: string; value: string }[]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const { key, value } of pairs) {
      if (key.trim()) map[key.trim()] = value.trim();
    }
    return map;
  }

  // ── Submit ───────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload = {
      name:            v.name,
      slug:            v.slug,
      description:     v.description,
      logo:            v.logo,
      backgroundImage: v.backgroundImage,
      imagenBoton:     v.imagenBoton,
      fontFamily:      v.fontFamily,
      primaryColor:    v.primaryColor,
      secondaryColor:  v.secondaryColor,
      tertiaryColor:   v.tertiaryColor,
      textColor:       v.textColor,
      popularityScore: v.popularityScore,
      releaseDate:     v.releaseDate,
      isActive:        v.isActive,
      hasType:         v.hasType,
      hasAbilities:    v.hasAbilities,
      hasStats:        v.hasStats,
      labels: {
        type:      v.labelType,
        abilities: v.labelAbilities,
        stats:     v.labelStats,
      },
      statLabels:    this.pairsToMap(v.statLabels),
    };

    this.isSubmitting.set(true);
    this.errorMsg.set('');

    this.api.addUniverse(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMsg.set('Universo creado correctamente');
        setTimeout(() => this.router.navigate(['/universes']), 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.status?.message ?? 'Error al crear el universo');
      },
    });
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }
}
