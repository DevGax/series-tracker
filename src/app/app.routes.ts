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
    path: 'editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/media-form/media-form').then((m) => m.SitcomForm),
  },
  {
    path: 'auth',
    canActivate: [authRedirectGuard],
    loadComponent: () => import('./pages/auth/auth').then((m) => m.Auth),
  },
  {
    path: 'media/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/media-view/media-view').then((m) => m.MediaView),
  },
];
