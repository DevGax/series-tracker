import { Component, inject, signal } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { AsyncPipe } from '@angular/common';
import { SerieCard } from '../../components/serie-card/serie-card';
import { Observable } from 'rxjs/internal/Observable';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, delay, map, of, startWith, tap } from 'rxjs';
import { ActiveFilter } from '../../models/filter.model';
import { VisualMedia } from '../../models/generic.model';
import { SearchFilters } from '../../components/search-filters/search-filters';
import { SortControl, SortingCriteria } from '../../components/sort-control/sort-control';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, SerieCard, RouterModule, SearchFilters, SortControl],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  mediaService = inject(MediaService);
  // Signal para el estado de carga
  loading = signal(true);
  private filters$ = new BehaviorSubject<ActiveFilter>({
    text: '',
    state: '',
    type: '',
    platform: '',
    genre: '',
  });

  private orden$ = new BehaviorSubject<SortingCriteria>('recientes');

  visualMediaFilters$: Observable<VisualMedia[]>;

  constructor() {
    this.visualMediaFilters$ = combineLatest([
      this.mediaService.visualMedia$,
      this.filters$,
      this.orden$,
    ]).pipe(
      tap(() => this.loading.set(true)),
      map(([series, filtros, orden]) => {
        const filtradas = this.filterVisualMedia(series, filtros);
        return this.sortMedias(filtradas, orden);
      }),
      delay(0),
      tap(() => this.loading.set(false)), // termina de cargar
      catchError((err) => {
        this.loading.set(false);
        console.error(err);
        return of([]);
      }),
    );
  }

  applyFilters(filtros: ActiveFilter): void {
    this.filters$.next(filtros);
  }

  applySort(orden: SortingCriteria): void {
    this.orden$.next(orden);
  }

  private filterVisualMedia(series: VisualMedia[], filtros: ActiveFilter): VisualMedia[] {
    return series.filter((serie) => {
      if (filtros.text) {
        const busqueda = filtros.text.toLowerCase();
        const matchTitulo = serie.title.toLowerCase().includes(busqueda);
        const matchOpinion = serie.opinion?.toLowerCase().includes(busqueda) ?? false;
        if (!matchTitulo && !matchOpinion) return false;
      }

      if (filtros.state && serie.status !== filtros.state) return false;

      if (filtros.type && serie.type !== filtros.type) return false;

      if (filtros.platform && serie.platform !== filtros.platform) return false;

      if (
        filtros.genre &&
        !serie.genres.some((g) => g.toLowerCase() === filtros.genre.toLowerCase())
      )
        return false;

      return true;
    });
  }

  private sortMedias(medias: VisualMedia[], criterio: SortingCriteria): VisualMedia[] {
    const copia = [...medias];

    switch (criterio) {
      case 'recientes':
        return copia.sort(
          (a, b) => new Date(b.createDate!).getTime() - new Date(a.createDate!).getTime(),
        );

      case 'valoracion-desc':
        return copia.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case 'valoracion-asc':
        return copia.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

      case 'alfabetico-asc':
        return copia.sort((a, b) => a.title.localeCompare(b.title));

      case 'alfabetico-desc':
        return copia.sort((a, b) => b.title.localeCompare(a.title));

      case 'estado':
        const ordenEstados = { viewing: 0, pending: 1, completed: 2, abandoned: 3 };
        return copia.sort((a, b) => ordenEstados[a.status] - ordenEstados[b.status]);

      default:
        return copia;
    }
  }

  deleteMedia(id: string): void {
    if (confirm('¿Eliminar esta serie?')) {
      this.mediaService.deleteVisualMedia(id);
    }
  }
}
