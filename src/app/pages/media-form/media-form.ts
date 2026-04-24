import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VisualMedia, Status } from '../../models/generic.model';

@Component({
  selector: 'app-media-form',
  imports: [ReactiveFormsModule],
  templateUrl: './media-form.html',
  styleUrl: './media-form.css',
})
export class SitcomForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private serieService: MediaService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      type: ['serie', Validators.required],
      platform: ['Netflix', Validators.required],
      seasons: [1, [Validators.required, Validators.min(1)]],
      state: ['pending', Validators.required],
      rating: [null as number | null],
      genres: ['', Validators.required],
      opinion: [''],
    });
  }

  save(): void {
    console.log(this.form);
    if (this.form.invalid) return;

    const raw = this.form.value;
    const isStatus = (value: string): value is Status =>
      ['viewing', 'completed', 'abandoned', 'pending'].includes(value);

    const media: VisualMedia = {
      id: crypto.randomUUID(),
      title: raw.title!,
      platform: raw.platform!,
      type: raw.type!,
      seasons: raw.seasons!,
      status: isStatus(raw.state) ? raw.state : 'pending',
      rating: raw.rating ?? undefined,
      genres: raw
        .genres!.split(',')
        .map((g: string) => g.trim())
        .filter(Boolean),
      opinion: raw.opinion || undefined,
    };

    this.serieService.addVisualMedia(media);
    this.router.navigate(['/']);
  }
}
