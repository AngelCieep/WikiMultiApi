import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  FormBuilder, FormGroup, FormArray, Validators,
  ReactiveFormsModule, AbstractControl,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, switchMap, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseDetail } from '../../interfaces/universe-detail.interface';

@Component({
  selector: 'app-universe-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './universe-edit.html',
  styleUrl: '../add-universe/add-universe.css',
})
export class UniverseEdit {
  private readonly fb     = inject(FormBuilder);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);

  readonly slug         = this.route.snapshot.paramMap.get('slug') ?? '';
  readonly isSubmitting = signal(false);
  readonly errorMsg     = signal('');
  readonly successMsg   = signal('');
  readonly isLoading    = signal(true);
  private universeId    = '';

  readonly universe = toSignal(
    this.api.getUniverseStyle(this.slug).pipe(
      switchMap(r => this.api.getUniverse(r.status._id).pipe(map(u => u.status))),
      catchError(() => of(null as UniverseDetail | null))
    ),
    { initialValue: null as UniverseDetail | null }
  );

  form: FormGroup = this.fb.group({
    name:            ['', Validators.required],
    slug:            ['', [Validators.required, Validators.pattern(/^[a-z0-9\-]+$/)]],
    description:     [''],
    logo:            [''],
    backgroundImage: [''],
    imagenBoton:     [''],
    fontFamily:      [''],
    primaryColor:    ['#000000'],
    secondaryColor:  ['#ffffff'],
    tertiaryColor:   ['#cccccc'],
    textColor:       ['#ffffff'],
    popularityScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    releaseDate:     ['', Validators.required],
    isActive:        [true, Validators.required],
    labelType:       [''],
    labelAbilities:  [''],
    labelStats:      [''],
    typeLabels:      this.fb.array([]),
    statLabels:      this.fb.array([]),
    abilityLabels:   this.fb.array([]),
  });

  constructor() {
    effect(() => {
      const u = this.universe();
      if (!u) return;
      this.universeId = u._id;
      this.isLoading.set(false);

      const releaseDate = u.releaseDate ? u.releaseDate.split('T')[0] : '';
      this.form.patchValue({
        name: u.name, slug: u.slug, description: u.description ?? '',
        logo: u.logo ?? '', backgroundImage: u.backgroundImage ?? '',
        imagenBoton: u.imagenBoton ?? '',
        fontFamily: u.fontFamily ?? '',
        primaryColor: u.primaryColor ?? '#000000',
        secondaryColor: u.secondaryColor ?? '#ffffff',
        tertiaryColor: u.tertiaryColor ?? '#cccccc',
        textColor: u.textColor ?? '#ffffff',
        popularityScore: u.popularityScore ?? 0,
        releaseDate,
        isActive: u.isActive ?? true,
        labelType: u.labels?.type ?? '',
        labelAbilities: u.labels?.abilities ?? '',
        labelStats: u.labels?.stats ?? '',
      });

      this.typeLabels.clear();
      for (const [k, v] of Object.entries(u.typeLabels ?? {}))
        this.typeLabels.push(this.newPair(k, v as string));

      this.statLabels.clear();
      for (const [k, v] of Object.entries(u.statLabels ?? {}))
        this.statLabels.push(this.newPair(k, v as string));

      this.abilityLabels.clear();
      for (const [k, v] of Object.entries(u.abilityLabels ?? {}))
        this.abilityLabels.push(this.newPair(k, v as string));
    });
  }

  get typeLabels()    { return this.form.get('typeLabels')    as FormArray; }
  get statLabels()    { return this.form.get('statLabels')    as FormArray; }
  get abilityLabels() { return this.form.get('abilityLabels') as FormArray; }

  private newPair(k = '', v = ''): FormGroup {
    return this.fb.group({ key: [k], value: [v] });
  }

  addTypeLabel()             { this.typeLabels.push(this.newPair()); }
  addStatLabel()             { this.statLabels.push(this.newPair()); }
  addAbilityLabel()          { this.abilityLabels.push(this.newPair()); }
  removeTypeLabel(i: number)    { this.typeLabels.removeAt(i); }
  removeStatLabel(i: number)    { this.statLabels.removeAt(i); }
  removeAbilityLabel(i: number) { this.abilityLabels.removeAt(i); }

  onImgError(e: Event): void { (e.target as HTMLImageElement).style.display = 'none'; }

  onNameInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.form.get('slug')!.setValue(
      v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, ''),
      { emitEvent: false }
    );
  }

  private pairsToMap(pairs: { key: string; value: string }[]): Record<string, string> {
    const m: Record<string, string> = {};
    for (const { key, value } of pairs) if (key.trim()) m[key.trim()] = value.trim();
    return m;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const payload = {
      name: v.name, slug: v.slug, description: v.description,
      logo: v.logo, backgroundImage: v.backgroundImage, imagenBoton: v.imagenBoton,
      fontFamily: v.fontFamily, primaryColor: v.primaryColor,
      secondaryColor: v.secondaryColor, tertiaryColor: v.tertiaryColor,
      textColor: v.textColor, popularityScore: v.popularityScore,
      releaseDate: v.releaseDate, isActive: v.isActive,
      labels: { type: v.labelType, abilities: v.labelAbilities, stats: v.labelStats },
      typeLabels:    this.pairsToMap(v.typeLabels),
      statLabels:    this.pairsToMap(v.statLabels),
      abilityLabels: this.pairsToMap(v.abilityLabels),
    };
    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.api.updateUniverse(this.universeId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMsg.set('¡Universo actualizado correctamente!');
        setTimeout(() => this.router.navigate(['/universes', v.slug || this.slug]), 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.status?.message ?? 'Error al actualizar el universo.');
      },
    });
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }
}
