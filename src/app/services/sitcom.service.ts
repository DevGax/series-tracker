import { Injectable } from '@angular/core';
import { VisualMedia } from '../models/generic.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SitcomService {
  private series = new BehaviorSubject<VisualMedia[]>([]);
  series$ = this.series.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const datosGuardados = localStorage.getItem('mis-series');
    if (datosGuardados) {
      this.series.next(JSON.parse(datosGuardados));
    }
  }

  addVisualMedia(serie: VisualMedia): void {
    const actuales = this.series.value;
    this.series.next([...actuales, serie]);
    this.save();
  }

  updateVisualMedia(id: string, cambios: Partial<VisualMedia>): void {
    const actuales = this.series.value.map((s) => (s.id === id ? { ...s, ...cambios } : s));
    this.series.next(actuales);
    this.save();
  }

  deleteVisualMedia(id: string): void {
    this.series.next(this.series.value.filter((s) => s.id !== id));
    this.save();
  }

  private save(): void {
    localStorage.setItem('mis-series', JSON.stringify(this.series.value));
  }
}
