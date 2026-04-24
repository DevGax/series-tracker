import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VisualMedia, Status } from '../../models/generic.model';
import { ImageUpload } from '../../components/image-upload/image-upload';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-form',
  imports: [ReactiveFormsModule, ImageUpload, CommonModule],
  templateUrl: './media-form.html',
  styleUrl: './media-form.css',
})
export class SitcomForm {
  form: FormGroup;

  modeEdition = false;
  mediaId?: string;
  previewUrl: string | null = null;
  posterFile: File | null = null;
  posterDeleted = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      type: ['serie', Validators.required],
      platform: ['Netflix', Validators.required],
      seasons: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', Validators.required],
      rating: [null as number | null],
      genres: ['', Validators.required],
      cardTitle: [''],
      opinion: [''],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeEdition = true;
      this.mediaId = id;
      this.loadMedia(id);
    }
  }

  async loadMedia(id: string): Promise<void> {
    // Obtener serie del observable
    this.mediaService.visualMedia$.subscribe((series) => {
      const serie = series.find((s) => s.id === id);
      if (serie) {
        this.form.patchValue({
          title: serie.title,
          platform: serie.platform,
          seasons: serie.seasons,
          status: serie.status,
          rating: serie.rating ?? null,
          genres: serie.genres.join(', '),
          cardTitle: serie.cardTitle ?? '',
          opinion: serie.opinion ?? '',
        });
        this.previewUrl = serie.posterUrl ?? null;
      }
    });
  }

  onImageSelected(file: File | null): void {
    if (file) {
      this.posterFile = file;
      this.posterDeleted = false;
      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      this.posterFile = null;
      this.posterDeleted = true;
      this.previewUrl = null;
    }
  }

  async save(): Promise<void> {
    console.log(this.form);
    if (this.form.invalid) return;

    this.saving = true;

    const raw = this.form.value;
    const isStatus = (value: string): value is Status =>
      ['viewing', 'completed', 'abandoned', 'pending'].includes(value);

    const media: VisualMedia = {
      id: crypto.randomUUID(),
      title: raw.title!,
      platform: raw.platform!,
      type: raw.type!,
      seasons: raw.seasons!,
      status: isStatus(raw.status) ? raw.status : 'pending',
      rating: raw.rating ?? undefined,
      genres: raw
        .genres!.split(',')
        .map((g: string) => g.trim())
        .filter(Boolean),
      cardTitle: raw.cardTitle || undefined,
      opinion: raw.opinion || undefined,
    };

    try {
      if (this.modeEdition && this.mediaId) {
        await this.mediaService.updateVisualMedia(
          this.mediaId,
          media,
          this.posterDeleted ? null : this.posterFile,
        );
      } else {
        await this.mediaService.addVisualMedia(media, this.posterFile);
      }
      this.router.navigate(['/']);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      this.saving = false;
    }
  }
}
