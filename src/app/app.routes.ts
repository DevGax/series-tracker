import { Routes } from '@angular/router';
import { authGuard, authRedirectGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'nueva',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/media-form/media-form').then((m) => m.SitcomForm),
  },
  {
    path: 'auth',
    canActivate: [authRedirectGuard],
    loadComponent: () => import('./pages/auth/auth').then((m) => m.Auth),
  },
  //   {
  //     path: 'serie/:id',
  //     loadComponent: () => import('./pages/serie-view/serie-view.component').then(m => m.SerieViewComponent)
  //   }
];
