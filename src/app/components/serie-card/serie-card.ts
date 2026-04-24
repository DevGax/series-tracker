import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VisualMedia } from '../../models/generic.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-serie-card',
  imports: [RouterLink],
  templateUrl: './serie-card.html',
  styleUrl: './serie-card.css',
})
export class SerieCard {
  @Output() delete = new EventEmitter<string>();
  @Input({ required: true }) genericView!: VisualMedia;

  get rating(): number {
    return this.genericView?.rating ?? 0;
  }

  get fullStars(): number {
    return Math.floor(this.rating / 2);
  }

  get hasHalfStar(): boolean {
    return (this.rating / 2) % 1 >= 0.5;
  }
  get badgeClass(): string {
    const map: Record<string, string> = {
      viewing: 'bg-blue-200 text-blue-600',
      completed: 'bg-green-200 text-green-600',
      abandoned: 'bg-red-200 text-red-600',
      pending: 'bg-amber-200 text-amber-600',
    };
    return map[this.genericView.status] || 'bg-gray-50 text-gray-600';
  }
}
