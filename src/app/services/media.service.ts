import { inject, Injectable, signal } from '@angular/core';
import { VisualMedia } from '../models/generic.model';
import { BehaviorSubject, from, Observable, shareReplay, switchMap } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private supabase = inject(SupabaseService);
  private reload$ = new BehaviorSubject<void>(undefined);
  loading = signal(false);

  visualMedia$: Observable<VisualMedia[]> = this.reload$.pipe(
    switchMap(() => from(this.loadMedias())),
    shareReplay(1),
  );

  private async loadMedias(): Promise<VisualMedia[]> {
    const userId = this.supabase.userId;
    if (!userId) return [];

    const { data, error } = await this.supabase.client
      .from('media')
      .select('*')
      .eq('user_id', userId)
      .order('create_date', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      platform: item.platform,
      seasons: item.seasons ?? undefined,
      status: item.status,
      rating: item.rating ?? undefined,
      cardTitle: item.card_title ?? undefined,
      opinion: item.opinion ?? undefined,
      genres: item.genres ?? [],
      posterUrl: item.poster_url ?? undefined,
      createDate: new Date(item.create_date),
    })) as VisualMedia[];
  }

  async addVisualMedia(
    media: Omit<VisualMedia, 'id' | 'createDate' | 'posterUrl'>,
    posterFile?: File | null,
  ): Promise<void> {
    const userId = this.supabase.userId;
    if (!userId) throw new Error('No autenticado');

    const { data: insertData, error: insertError } = await this.supabase.client
      .from('media')
      .insert({
        user_id: userId,
        title: media.title,
        type: media.type,
        platform: media.platform,
        seasons: media.seasons ?? undefined,
        status: media.status,
        rating: media.rating ?? undefined,
        opinion: media.opinion ?? undefined,
        genres: media.genres ?? [],
        card_title: media.cardTitle ?? undefined,
        poster_url: null,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    const mediaId = insertData.id;

    if (posterFile) {
      const posterUrl = await this.supabase.uploadPoster(posterFile, mediaId);
      await this.supabase.client.from('media').update({ poster_url: posterUrl }).eq('id', mediaId);
    }

    this.reload$.next();
  }

  async updateVisualMedia(
    id: string,
    cambios: Partial<VisualMedia>,
    newPoster?: File | null,
  ): Promise<void> {
    const updateData: any = {};
    if (cambios.title !== undefined) updateData.title = cambios.title;
    if (cambios.type !== undefined) updateData.type = cambios.type;
    if (cambios.platform !== undefined) updateData.platform = cambios.platform;
    if (cambios.seasons !== undefined) updateData.seasons = cambios.seasons;
    if (cambios.status !== undefined) updateData.status = cambios.status;
    if (cambios.rating !== undefined) updateData.rating = cambios.rating ?? null;
    if (cambios.cardTitle !== undefined) updateData.card_title = cambios.cardTitle ?? null;
    if (cambios.opinion !== undefined) updateData.opinion = cambios.opinion ?? null;
    if (cambios.genres !== undefined) updateData.genres = cambios.genres;

    if (newPoster) {
      const publicUrl = await this.supabase.uploadPoster(newPoster, id);
      updateData.poster_url = publicUrl;
    } else if (newPoster === null && cambios.posterUrl === undefined) {
      updateData.poster_url = null;
      await this.supabase.deletePoster(id);
    }

    const { error } = await this.supabase.client.from('media').update(updateData).eq('id', id);

    if (error) throw error;
    this.reload$.next();
  }

  async deleteVisualMedia(id: string): Promise<void> {
    await this.supabase.deletePoster(id);
    const { error } = await this.supabase.client.from('media').delete().eq('id', id);

    if (error) throw error;
    this.reload$.next();
  }

  recargar(): void {
    this.reload$.next();
  }
}
