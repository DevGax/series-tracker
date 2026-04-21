import { Injectable } from '@angular/core';
import { GenericView } from '../models/generic.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SitcomService {
  private series = new BehaviorSubject<GenericView[]>([]);
  series$ = this.series.asObservable();

  constructor() {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    const datosGuardados = localStorage.getItem('mis-series');
    if (datosGuardados) {
      this.series.next(JSON.parse(datosGuardados));
    }
  }

  agregarSerie(serie: GenericView): void {
    const actuales = this.series.value;
    this.series.next([...actuales, serie]);
    this.guardar();
  }

  actualizarSerie(id: string, cambios: Partial<GenericView>): void {
    const actuales = this.series.value.map((s) => (s.id === id ? { ...s, ...cambios } : s));
    this.series.next(actuales);
    this.guardar();
  }

  eliminarSerie(id: string): void {
    this.series.next(this.series.value.filter((s) => s.id !== id));
    this.guardar();
  }

  private guardar(): void {
    localStorage.setItem('mis-series', JSON.stringify(this.series.value));
  }
}
