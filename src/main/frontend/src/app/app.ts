import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

/**
 * Root application component.
 *
 * Selector: `app-root`
 *
 * Responsibilities:
 * - Bootstraps the router via `<router-outlet>`.
 * - Initialises the {@link ThemeService} on startup so the saved colour
 *   scheme is applied before the first child route renders.
 *
 * @category Components
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private themeService = inject(ThemeService);

  /** Restores the user's saved theme preference on application startup. */
  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
