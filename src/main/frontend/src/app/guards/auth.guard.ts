import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Route guard that protects authenticated-only routes.
 *
 * If the user has an active session (`AuthService.isAuthenticated === true`)
 * navigation proceeds normally.  Otherwise the user is redirected to `/login`
 * and the original navigation is cancelled.
 *
 * @example
 * ```typescript
 * // app.routes.ts
 * {
 *   path: '',
 *   loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
 *   canActivate: [authGuard],
 *   children: [...]
 * }
 * ```
 *
 * @returns `true` to allow navigation, or a `UrlTree` that redirects to `/login`.
 *
 * @category Guards
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.sessionReady$.pipe(
    take(1),
    map(() => auth.isAuthenticated ? true : router.createUrlTree(['/login']))
  );
};
