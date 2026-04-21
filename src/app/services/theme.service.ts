import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'series-tracker-theme';
  private readonly isBrowser: boolean;

  // Signal reactivo con el tema actual efectivo (light/dark)
  readonly temaEfectivo = signal<'light' | 'dark'>('light');
  readonly temaSeleccionado = signal<Theme>('system');

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.inicializarTema();
    }

    // Efecto que aplica/quita la clase .dark en <html>
    effect(() => {
      const tema = this.temaEfectivo();
      if (this.isBrowser) {
        const html = document.documentElement;
        if (tema === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
    });
  }

  private inicializarTema(): void {
    const guardado = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const temaInicial = guardado ?? 'system';
    this.temaSeleccionado.set(temaInicial);
    this.temaEfectivo.set(temaInicial === 'system' ? preferenciaSistema : temaInicial);

    // Escuchar cambios del sistema si está en "system"
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.temaSeleccionado() === 'system') {
        this.temaEfectivo.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTema(tema: Theme): void {
    this.temaSeleccionado.set(tema);
    if (tema === 'system') {
      const preferencia = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      this.temaEfectivo.set(preferencia);
    } else {
      this.temaEfectivo.set(tema);
    }
    localStorage.setItem(this.STORAGE_KEY, tema);
  }

  toggle(): void {
    const actual = this.temaEfectivo();
    this.setTema(actual === 'light' ? 'dark' : 'light');
  }
}
