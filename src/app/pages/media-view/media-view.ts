import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VisualMedia } from '../../models/generic.model';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-media-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './media-view.html',
  styleUrl: './media-view.css',
})
export class MediaView {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mediaService = inject(MediaService);

  media?: VisualMedia;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) return of(undefined);
          return this.mediaService.visualMedia$.pipe(
            map((media) => media.find((m) => m.id === id)),
          );
        }),
      )
      .subscribe((media) => {
        this.media = media;
      });
  }

  get badgeClass(): string {
    if (!this.media) return '';
    const map: Record<string, string> = {
      viendo: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      completada: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      abandonada: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      pendiente: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    };
    return map[this.media.status] || 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }

  async delete(): Promise<void> {
    if (!this.media) return;
    if (confirm('¿Eliminar este medio permanentemente?')) {
      await this.mediaService.deleteVisualMedia(this.media.id);
      this.router.navigate(['/']);
    }
  }
}
