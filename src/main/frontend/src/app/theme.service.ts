// DOM access is deferred to initTheme() so construction is SSR-safe
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly isDarkMode = signal<boolean>(false);

  initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (!stored && prefersDark);

    this.applyTheme(dark);
  }

  toggleTheme(): void {
    this.applyTheme(!this.isDarkMode());
  }

  private applyTheme(dark: boolean): void {
    this.isDarkMode.set(dark);

    if (!isPlatformBrowser(this.platformId)) return;

    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
