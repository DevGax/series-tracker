import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SortingCriteria =
  | 'recientes'
  | 'valoracion-desc'
  | 'valoracion-asc'
  | 'alfabetico-asc'
  | 'alfabetico-desc'
  | 'estado';

@Component({
  selector: 'app-sort-control',
  imports: [FormsModule],
  templateUrl: './sort-control.html',
  styleUrl: './sort-control.css',
})
export class SortControl {
  criteria: SortingCriteria = 'recientes';
  orderChanged = output<SortingCriteria>();

  changeCriteria(nuevo: SortingCriteria): void {
    this.criteria = nuevo;
    this.orderChanged.emit(nuevo);
  }
}
