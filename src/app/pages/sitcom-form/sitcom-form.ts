import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SitcomService } from '../../services/sitcom.service';
import { GenericView, Status } from '../../models/generic.model';

@Component({
  selector: 'app-sitcom-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sitcom-form.html',
  styleUrl: './sitcom-form.css',
})
export class SitcomForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private serieService: SitcomService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      plataforma: ['Netflix', Validators.required],
      temporadas: [1, [Validators.required, Validators.min(1)]],
      estado: ['pending', Validators.required],
      valoracion: [null as number | null],
      generos: ['', Validators.required],
      opinion: [''],
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;
    const isStatus = (value: string): value is Status =>
      ['viewing', 'completed', 'abandoned', 'pending'].includes(value);

    const serie: GenericView = {
      id: crypto.randomUUID(),
      title: raw.titulo!,
      platform: raw.plataforma!,
      type: 'serie',
      season: raw.temporadas!,
      status: isStatus(raw.estado) ? raw.estado : 'pending',
      rating: raw.valoracion ?? undefined,
      genres: raw
        .generos!.split(',')
        .map((g: string) => g.trim())
        .filter(Boolean),
      opinion: raw.opinion || undefined,
    };

    this.serieService.agregarSerie(serie);
    this.router.navigate(['/']);
  }
}
