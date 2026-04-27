// DOM access is deferred to initTheme() so construction is SSR-safe
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'theme';

/**
 * Manages the light/dark colour scheme for the application.
 *
 * Theme state is stored in `localStorage` under the key `"theme"`.  On first
 * visit the user's OS preference (`prefers-color-scheme`) is used as the
 * default.  DOM mutations are guarded with `isPlatformBrowser` so the service
 * is safe to construct during SSR.
 *
 * **Call {@link initTheme} once in the root component's `ngOnInit`** to
 * restore the saved preference before the first render.
 *
 * @example
 * ```typescript
 * // In AppComponent
 * export class App implements OnInit {
 *   private themeService = inject(ThemeService);
 *   ngOnInit() { this.themeService.initTheme(); }
 * }
 *
 * // In a toolbar toggle button
 * const theme = inject(ThemeService);
 * // template: (click)="theme.toggleTheme()"
 * //           [checked]="theme.isDarkMode()"
 * ```
 *
 * @category Services
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Signal that is `true` when dark mode is currently active.
   * Subscribe in templates with `theme.isDarkMode()`.
   */
  readonly isDarkMode = signal<boolean>(false);

  /**
   * Reads the persisted theme preference and applies it to the DOM.
   *
   * Priority order:
   * 1. Value stored in `localStorage` (`"dark"` or `"light"`).
   * 2. OS-level `prefers-color-scheme: dark` media query.
   * 3. Light mode as the fallback.
   *
   * No-op when called in a non-browser environment.
   */
  initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (!stored && prefersDark);

    this.applyTheme(dark);
  }

  /**
   * Toggles between dark and light mode and persists the new preference.
   */
  toggleTheme(): void {
    this.applyTheme(!this.isDarkMode());
  }

  /**
   * Applies the requested theme by updating the {@link isDarkMode} signal,
   * toggling CSS classes on `<html>` and `<body>`, and writing the preference
   * to `localStorage`.
   *
   * @param dark - `true` to activate dark mode, `false` for light mode.
   */
  private applyTheme(dark: boolean): void {
    this.isDarkMode.set(dark);

    if (!isPlatformBrowser(this.platformId)) return;

    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
