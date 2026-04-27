import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/**
 * Application-level route configuration.
 *
 * | Path       | Component           | Guard       | Notes                        |
 * |------------|---------------------|-------------|------------------------------|
 * | `/`        | —                   | —           | Redirects to `/boats`        |
 * | `/login`   | `LoginComponent`    | —           | Public                       |
 * | `/boats`   | `BoatListComponent` | `authGuard` | Requires active session      |
 * | `/help/**` | `HelpComponent`     | `authGuard` | In-app user manual           |
 * | `**`       | —                   | —           | Redirects to `/boats`        |
 *
 * All feature components are **lazy-loaded** via `loadComponent` to keep the
 * initial bundle small.
 *
 * @category Configuration
 */

export const routes: Routes = [
  { path: '', redirectTo: 'boats', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'boats',
        loadComponent: () =>
          import('./features/boats/boat-list.component').then(m => m.BoatListComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./features/help/help.component').then(m => m.HelpComponent),
        loadChildren: () =>
          import('./features/help/help.routes').then(m => m.HELP_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'boats' },
];
