import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SafeBgPipe } from '../../pipes/safe-bg.pipe';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UniverseStyle } from '../../interfaces/universe-style.interface';

@Component({
  selector: 'app-character-add',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SafeBgPipe, SafeUrlPipe],
  templateUrl: './character-add.html',
  styleUrl: './character-add.css',
})
export class CharacterAdd {
  private readonly fb     = inject(FormBuilder);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly errorMsg     = signal('');
  readonly successMsg   = signal('');

  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  readonly universe = toSignal(
    this.api.getUniverseStyle(this.slug).pipe(
      map(r => r.status),
      catchError(() => of(null as UniverseStyle | null))
    ),
    { initialValue: null as UniverseStyle | null }
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

  imagePreview = computed(() => this.form.get('image')?.value || '');

  // ── Abilities ──────────────────────────────────────────────
  get abilitiesArray(): FormArray { return this.form.get('abilities') as FormArray; }
  addAbility()                    { this.abilitiesArray.push(this.fb.control('')); }
  removeAbility(i: number)        { this.abilitiesArray.removeAt(i); }

  // ── Stats ──────────────────────────────────────────────────
  get statsArray(): FormArray { return this.form.get('stats') as FormArray; }
  addStat()                   { this.statsArray.push(this.fb.group({ key: [''], value: [0] })); }
  removeStat(i: number)       { this.statsArray.removeAt(i); }

  // ── Description sections ───────────────────────────────────
  get sectionsArray(): FormArray { return this.form.get('descriptionSections') as FormArray; }
  addSection()                   { this.sectionsArray.push(this.fb.group({ sectionTitle: [''], content: [''] })); }
  removeSection(i: number)       { this.sectionsArray.removeAt(i); }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const univ = this.universe();
    if (!univ) {
      this.errorMsg.set('No se pudo obtener el universo.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    const raw = this.form.getRawValue();

    // Convert stats array to map object
    const statsMap: Record<string, number> = {};
    for (const s of raw.stats) {
      if (s.key) statsMap[s.key] = Number(s.value);
    }

    const payload = {
      ...raw,
      universeId: univ._id,
      abilities: raw.abilities.filter((a: string) => a.trim() !== ''),
      stats: statsMap,
      descriptionSections: raw.descriptionSections.filter(
        (s: any) => s.sectionTitle || s.content
      ),
    };

    this.api.addCharacter(payload).subscribe({
      next: () => {
        this.successMsg.set('¡Personaje añadido correctamente!');
        this.isSubmitting.set(false);
        setTimeout(() => this.router.navigate(['/universes', this.slug]), 1200);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.status?.message ?? 'Error al añadir el personaje.');
        this.isSubmitting.set(false);
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
