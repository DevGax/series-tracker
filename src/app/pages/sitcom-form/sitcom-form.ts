import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SitcomService } from '../../services/sitcom.service';
import { VisualMedia, Status } from '../../models/generic.model';

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
      title: ['', Validators.required],
      platform: ['Netflix', Validators.required],
      seasons: [1, [Validators.required, Validators.min(1)]],
      state: ['pending', Validators.required],
      rating: [null as number | null],
      genre: ['', Validators.required],
      opinion: [''],
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;
    const isStatus = (value: string): value is Status =>
      ['viewing', 'completed', 'abandoned', 'pending'].includes(value);

    const media: VisualMedia = {
      id: crypto.randomUUID(),
      title: raw.title!,
      platform: raw.platform!,
      type: 'serie',
      seasons: raw.seasons!,
      status: isStatus(raw.state) ? raw.state : 'pending',
      rating: raw.rating ?? undefined,
      genres: raw
        .genre!.split(',')
        .map((g: string) => g.trim())
        .filter(Boolean),
      opinion: raw.opinion || undefined,
    };

    this.serieService.addVisualMedia(media);
    this.router.navigate(['/']);
  }
}
