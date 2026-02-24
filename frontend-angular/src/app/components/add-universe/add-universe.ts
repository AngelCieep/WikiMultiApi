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

    // Labels
    labelType:       [''],
    labelAbilities:  [''],
    labelStats:      [''],

    // Mapas dinámicos
    typeLabels:      this.fb.array([]),
    statLabels:      this.fb.array([]),
    abilityLabels:   this.fb.array([]),
  });

  // ── Getters FormArrays ───────────────────────────────────────
  get typeLabels()    { return this.form.get('typeLabels')    as FormArray; }
  get statLabels()    { return this.form.get('statLabels')    as FormArray; }
  get abilityLabels() { return this.form.get('abilityLabels') as FormArray; }

  private newPair(k = '', v = ''): FormGroup {
    return this.fb.group({ key: [k], value: [v] });
  }

  addTypeLabel()    { this.typeLabels.push(this.newPair()); }
  addStatLabel()    { this.statLabels.push(this.newPair()); }
  addAbilityLabel() { this.abilityLabels.push(this.newPair()); }

  removeTypeLabel(i: number)    { this.typeLabels.removeAt(i); }
  removeStatLabel(i: number)    { this.statLabels.removeAt(i); }
  removeAbilityLabel(i: number) { this.abilityLabels.removeAt(i); }

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
      labels: {
        type:      v.labelType,
        abilities: v.labelAbilities,
        stats:     v.labelStats,
      },
      typeLabels:    this.pairsToMap(v.typeLabels),
      statLabels:    this.pairsToMap(v.statLabels),
      abilityLabels: this.pairsToMap(v.abilityLabels),
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
