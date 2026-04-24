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
      opinion: item.opinion ?? undefined,
      genres: item.genres ?? [],
      createDate: new Date(item.create_date),
    })) as VisualMedia[];
  }

  async addVisualMedia(media: Omit<VisualMedia, 'id' | 'createDate'>): Promise<void> {
    const userId = this.supabase.userId;
    if (!userId) throw new Error('No autenticado');

    const { error } = await this.supabase.client.from('media').insert({
      user_id: userId,
      title: media.title,
      type: media.type,
      platform: media.platform,
      seasons: media.seasons ?? undefined,
      status: media.status,
      rating: media.rating ?? undefined,
      opinion: media.opinion ?? undefined,
      genres: media.genres ?? [],
    });

    if (error) throw error;
    this.reload$.next();
  }

  async updateVisualMedia(id: string, cambios: Partial<VisualMedia>): Promise<void> {
    const updateData: any = {};
    if (cambios.title !== undefined) updateData.title = cambios.title;
    if (cambios.type !== undefined) updateData.type = cambios.type;
    if (cambios.platform !== undefined) updateData.platform = cambios.platform;
    if (cambios.seasons !== undefined) updateData.seasons = cambios.seasons;
    if (cambios.status !== undefined) updateData.status = cambios.status;
    if (cambios.rating !== undefined) updateData.rating = cambios.rating ?? null;
    if (cambios.opinion !== undefined) updateData.opinion = cambios.opinion ?? null;
    if (cambios.genres !== undefined) updateData.genres = cambios.genres;
    if (cambios.createDate !== undefined) updateData.createDate = cambios.createDate ?? null;

    const { error } = await this.supabase.client.from('media').update(updateData).eq('id', id);

    if (error) throw error;
    this.reload$.next();
  }

  async deleteVisualMedia(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('media').delete().eq('id', id);

    if (error) throw error;
    this.reload$.next();
  }

  recargar(): void {
    this.reload$.next();
  }
  // private visualMedia = new BehaviorSubject<VisualMedia[]>([]);
  // visualMedia$ = this.visualMedia.asObservable();

  // constructor() {
  //   this.loadInitialData();
  // }

  // private loadInitialData(): void {
  //   const datosGuardados = localStorage.getItem('mis-series');
  //   if (datosGuardados) {
  //     this.visualMedia.next(JSON.parse(datosGuardados));
  //   }
  // }

  // getUniquesGenres(): string[] {
  //   const generos = new Set<string>();
  //   this.visualMedia.value.forEach((s) => s.genres.forEach((g) => generos.add(g)));
  //   return Array.from(generos).sort();
  // }

  // addVisualMedia(serie: Omit<VisualMedia, 'id' | 'createDate'>): void {
  //   const nueva: VisualMedia = {
  //     ...serie,
  //     id: crypto.randomUUID(),
  //     createDate: new Date(),
  //   };
  //   const actuales = this.visualMedia.value;
  //   this.visualMedia.next([...actuales, nueva]);
  //   this.save();
  // }

  // updateVisualMedia(id: string, cambios: Partial<VisualMedia>): void {
  //   const actuales = this.visualMedia.value.map((s) => (s.id === id ? { ...s, ...cambios } : s));
  //   this.visualMedia.next(actuales);
  //   this.save();
  // }

  // deleteVisualMedia(id: string): void {
  //   this.visualMedia.next(this.visualMedia.value.filter((s) => s.id !== id));
  //   this.save();
  // }

  // private save(): void {
  //   localStorage.setItem('mis-series', JSON.stringify(this.visualMedia.value));
  // }
}
