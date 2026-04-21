import { Component, Input } from '@angular/core';
import { GenericView } from '../../models/generic.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-serie-card',
  imports: [RouterLink],
  templateUrl: './serie-card.html',
  styleUrl: './serie-card.css',
})
export class SerieCard {
  @Input({ required: true }) genericView!: GenericView;

  get badgeClass(): string {
    const map: Record<string, string> = {
      viendo: 'bg-blue-50 text-blue-600',
      completada: 'bg-green-50 text-green-600',
      abandonada: 'bg-red-50 text-red-600',
      pendiente: 'bg-amber-50 text-amber-600',
    };
    return map[this.genericView.status] || 'bg-gray-50 text-gray-600';
  }
}
