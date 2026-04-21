import { Component, inject } from '@angular/core';
import { SitcomService } from '../../services/sitcom.service';
import { AsyncPipe } from '@angular/common';
import { SerieCard } from '../../components/serie-card/serie-card';
import { Observable } from 'rxjs/internal/Observable';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, SerieCard, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  series$!: Observable<any>;

  constructor(private sitcomService: SitcomService) {}

  ngOnInit(): void {
    this.series$ = this.sitcomService.series$;
  }
}
