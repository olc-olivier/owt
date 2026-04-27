import { Routes } from '@angular/router';

/**
 * Child routes for the `/help` section.
 * Each path maps to a standalone help-page component.
 *
 * @category Configuration
 */
export const HELP_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview.component').then(m => m.HelpOverviewComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.HelpLoginComponent),
  },
  {
    path: 'fleet',
    loadComponent: () => import('./pages/fleet.component').then(m => m.HelpFleetComponent),
  },
  {
    path: 'add-boat',
    loadComponent: () => import('./pages/add-boat.component').then(m => m.HelpAddBoatComponent),
  },
  {
    path: 'edit-boat',
    loadComponent: () => import('./pages/edit-boat.component').then(m => m.HelpEditBoatComponent),
  },
  {
    path: 'delete-boat',
    loadComponent: () => import('./pages/delete-boat.component').then(m => m.HelpDeleteBoatComponent),
  },
  {
    path: 'boat-details',
    loadComponent: () => import('./pages/boat-details.component').then(m => m.HelpBoatDetailsComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search.component').then(m => m.HelpSearchComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq.component').then(m => m.HelpFaqComponent),
  },
];
