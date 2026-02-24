import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SafeBgPipe } from '../../pipes/safe-bg.pipe';
import {
  FormBuilder, FormGroup, FormArray,
  Validators, ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, switchMap, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CharacterDetail } from '../../interfaces/character-detail.interface';
import { UniverseDetail } from '../../interfaces/universe-detail.interface';

@Component({
  selector: 'app-character-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SafeBgPipe],
  templateUrl: './character-edit.html',
  styleUrl: '../character-add/character-add.css',
})
export class CharacterEdit {
  private readonly fb     = inject(FormBuilder);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);

  readonly id           = this.route.snapshot.paramMap.get('id') ?? '';
  readonly isSubmitting = signal(false);
  readonly errorMsg     = signal('');
  readonly successMsg   = signal('');
  readonly isLoading    = signal(true);
  private  characterId  = '';
  private  universeSlug = '';

  // Load character, then universe for theming
  private readonly characterData = toSignal(
    this.api.getCharacter(this.id).pipe(
      map(r => r.status),
      catchError(() => of(null as CharacterDetail | null))
    ),
    { initialValue: null as CharacterDetail | null }
  );

  readonly universe = toSignal(
    this.api.getCharacter(this.id).pipe(
      switchMap(r => this.api.getUniverse(r.status.universeId).pipe(map(u => u.status))),
      catchError(() => of(null as UniverseDetail | null))
    ),
    { initialValue: null as UniverseDetail | null }
  );

  form: FormGroup = this.fb.group({
    name:         ['', Validators.required],
    title:        [''],
    description:  [''],
    image:        [''],
    location:     [''],
    affiliation:  [''],
    type:         [''],
    numericField: [null, [Validators.required, Validators.min(0)]],
    dateField:    ['', Validators.required],
    booleanField: [false, Validators.required],
    abilities:    this.fb.array([]),
    stats:        this.fb.array([]),
    descriptionSections: this.fb.array([]),
  });

  constructor() {
    effect(() => {
      const c = this.characterData();
      if (!c) return;
      this.characterId = c._id;
      this.isLoading.set(false);

      const dateField = c.dateField ? (c.dateField as string).split('T')[0] : '';

      this.form.patchValue({
        name: c.name, title: c.title ?? '', description: c.description ?? '',
        image: c.image ?? '', location: c.location ?? '',
        affiliation: c.affiliation ?? '', type: c.type ?? '',
        numericField: c.numericField ?? null,
        dateField,
        booleanField: c.booleanField ?? false,
      });

      this.abilitiesArray.clear();
      for (const a of (c.abilities ?? []))
        this.abilitiesArray.push(this.fb.control(a));

      this.statsArray.clear();
      for (const [k, v] of Object.entries(c.stats ?? {}))
        this.statsArray.push(this.fb.group({ key: [k], value: [v] }));

      this.sectionsArray.clear();
      for (const s of (c.descriptionSections ?? []))
        this.sectionsArray.push(this.fb.group({ sectionTitle: [s.sectionTitle], content: [s.content] }));
    });

    effect(() => {
      const u = this.universe();
      if (u) this.universeSlug = u.slug;
    });
  }

  get abilitiesArray(): FormArray { return this.form.get('abilities') as FormArray; }
  addAbility()                    { this.abilitiesArray.push(this.fb.control('')); }
  removeAbility(i: number)        { this.abilitiesArray.removeAt(i); }

  get statsArray(): FormArray { return this.form.get('stats') as FormArray; }
  addStat()                   { this.statsArray.push(this.fb.group({ key: [''], value: [0] })); }
  removeStat(i: number)       { this.statsArray.removeAt(i); }

  get sectionsArray(): FormArray { return this.form.get('descriptionSections') as FormArray; }
  addSection()                   { this.sectionsArray.push(this.fb.group({ sectionTitle: [''], content: [''] })); }
  removeSection(i: number)       { this.sectionsArray.removeAt(i); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();

    const statsMap: Record<string, number> = {};
    for (const s of raw.stats) if (s.key) statsMap[s.key] = Number(s.value);

    const payload = {
      ...raw,
      universeId: this.characterData()?.universeId,
      abilities: raw.abilities.filter((a: string) => a.trim() !== ''),
      stats: statsMap,
      descriptionSections: raw.descriptionSections.filter((s: any) => s.sectionTitle || s.content),
    };

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.api.updateCharacter(this.characterId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMsg.set('¡Personaje actualizado correctamente!');
        setTimeout(() => this.router.navigate(['/character', this.characterId]), 1200);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(err?.error?.status?.message ?? 'Error al actualizar el personaje.');
      },
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  hexToRgbStr(hex: string | null | undefined): string {
    if (!hex) return '18,18,26';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }
}
