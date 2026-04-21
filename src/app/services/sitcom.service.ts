import { Injectable } from '@angular/core';
import { VisualMedia } from '../models/generic.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SitcomService {
  private visualMedia = new BehaviorSubject<VisualMedia[]>([]);
  visualMedia$ = this.visualMedia.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const datosGuardados = localStorage.getItem('mis-series');
    if (datosGuardados) {
      this.visualMedia.next(JSON.parse(datosGuardados));
    }
  }

  getUniquesGenres(): string[] {
    const generos = new Set<string>();
    this.visualMedia.value.forEach((s) => s.genres.forEach((g) => generos.add(g)));
    return Array.from(generos).sort();
  }

  addVisualMedia(serie: Omit<VisualMedia, 'id' | 'createDate'>): void {
    const nueva: VisualMedia = {
      ...serie,
      id: crypto.randomUUID(),
      createDate: new Date(),
    };
    const actuales = this.visualMedia.value;
    this.visualMedia.next([...actuales, nueva]);
    this.save();
  }

  updateVisualMedia(id: string, cambios: Partial<VisualMedia>): void {
    const actuales = this.visualMedia.value.map((s) => (s.id === id ? { ...s, ...cambios } : s));
    this.visualMedia.next(actuales);
    this.save();
  }

  deleteVisualMedia(id: string): void {
    this.visualMedia.next(this.visualMedia.value.filter((s) => s.id !== id));
    this.save();
  }

  private save(): void {
    localStorage.setItem('mis-series', JSON.stringify(this.visualMedia.value));
  }
}
