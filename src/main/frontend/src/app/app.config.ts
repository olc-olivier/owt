/**
 * Root application providers passed to `bootstrapApplication`.
 *
 * Registered providers:
 * - **Router** – lazy routes defined in {@link routes}, with component-input binding enabled.
 * - **HttpClient** – uses the `fetch` API instead of `XMLHttpRequest`.
 * - **Animations** – async lazy-loaded Angular Material animations.
 * - **GlobalErrorListeners** – captures unhandled browser errors.
 *
 * @category Configuration
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
};
