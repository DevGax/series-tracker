import { Component, inject } from '@angular/core';
import { SitcomService } from '../../services/sitcom.service';
import { AsyncPipe } from '@angular/common';
import { SerieCard } from '../../components/serie-card/serie-card';
import { Observable } from 'rxjs/internal/Observable';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ActiveFilter } from '../../models/filter.model';
import { VisualMedia } from '../../models/generic.model';
import { SearchFilters } from '../../components/search-filters/search-filters';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, SerieCard, RouterModule, SearchFilters],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private filters$ = new BehaviorSubject<ActiveFilter>({
    text: '',
    state: '',
    platform: '',
    genre: '',
  });

  visualMediaFilters$: Observable<VisualMedia[]>;

  constructor(private sitcomService: SitcomService) {
    this.visualMediaFilters$ = combineLatest([this.sitcomService.visualMedia$, this.filters$]).pipe(
      map(([series, filtros]) => this.filterVisualMedia(series, filtros)),
    );
  }

  applyFilters(filtros: ActiveFilter): void {
    this.filters$.next(filtros);
  }

  private filterVisualMedia(series: VisualMedia[], filtros: ActiveFilter): VisualMedia[] {
    return series.filter((serie) => {
      if (filtros.text) {
        const busqueda = filtros.text.toLowerCase();
        const matchTitulo = serie.title.toLowerCase().includes(busqueda);
        const matchOpinion = serie.opinion?.toLowerCase().includes(busqueda) ?? false;
        const matchCreador = serie.creator?.toLowerCase().includes(busqueda) ?? false;
        if (!matchTitulo && !matchOpinion && !matchCreador) return false;
      }

      if (filtros.state && serie.status !== filtros.state) return false;

      if (filtros.platform && serie.platform !== filtros.platform) return false;

      if (
        filtros.genre &&
        !serie.genres.some((g) => g.toLowerCase() === filtros.genre.toLowerCase())
      )
        return false;

      return true;
    });
  }

  deleteMedia(id: string): void {
    if (confirm('¿Eliminar esta serie?')) {
      this.sitcomService.deleteVisualMedia(id);
    }
  }
}
