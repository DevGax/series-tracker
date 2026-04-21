import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'nueva',
    loadComponent: () => import('./pages/sitcom-form/sitcom-form').then((m) => m.SitcomForm),
  },
  //   {
  //     path: 'serie/:id',
  //     loadComponent: () => import('./pages/serie-view/serie-view.component').then(m => m.SerieViewComponent)
  //   }
];
