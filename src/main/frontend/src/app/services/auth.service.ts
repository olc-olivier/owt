import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, map, of, tap } from 'rxjs';

/**
 * Minimal authenticated user representation.
 *
 * @category Services
 */
export interface AuthUser {
  /** Username of the currently authenticated user. */
  username: string;
  /** Granted authority names (e.g. ROLE_ADMIN). */
  roles?: string[];
}

interface LoginResponse {
  username: string;
  authenticated: boolean;
  roles: string[];
}

/**
 * Handles authentication state for the BoatFleet application.
 *
 * Supports two authentication paths:
 * - **Form login**: calls {@code POST /api/auth/login} with username/password
 *   credentials; the server returns a session cookie.
 * - **OAuth2 / Dex**: the browser is redirected to
 *   {@code /oauth2/authorization/dex}; Spring handles the redirect flow and
 *   creates a session on return.
 *
 * On construction the service calls {@code GET /api/auth/me} to restore any
 * existing session so that a page refresh does not force a re-login.
 *
 * @example
 * ```typescript
 * const auth = inject(AuthService);
 *
 * auth.login('admin', 'password').subscribe(ok => {
 *   if (ok) router.navigate(['/boats']);
 * });
 *
 * // Later…
 * auth.logout();
 * ```
 *
 * @category Services
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(null);
  private _ready = new ReplaySubject<void>(1);

  /**
   * Read-only signal exposing the currently authenticated user,
   * or {@code null} when no session is active.
   */
  readonly user = this._user.asReadonly();

  /**
   * Emits once (and replays) after the initial {@code /api/auth/me} check
   * has completed. Guards subscribe to this before checking {@link isAuthenticated}.
   */
  readonly sessionReady$ = this._ready.asObservable();

  /**
   * {@code true} when a valid session is present, {@code false} otherwise.
   */
  get isAuthenticated(): boolean {
    return this._user() !== null;
  }

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  /**
   * Authenticates the user against {@code POST /api/auth/login}.
   *
   * On success the server sets a session cookie and the signal is updated.
   *
   * @param username - The username to authenticate.
   * @param password - The password to authenticate.
   * @returns Observable that emits {@code true} on success, {@code false} on failure.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { username, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          this._user.set({ username: response.username, roles: response.roles });
        }),
        map(() => true),
        catchError(() => {
          this._user.set(null);
          return of(false);
        })
      );
  }

  /**
   * Clears the current session by calling {@code POST /api/auth/logout} and
   * resetting the local signal.
   */
  logout(): void {
    this.http
      .post('/api/auth/logout', {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe();
    this._user.set(null);
  }

  /**
   * Calls {@code GET /api/auth/me} to check whether an active session exists
   * (e.g. after a page refresh or OAuth2 redirect).
   */
  private restoreSession(): void {
    this.http
      .get<LoginResponse>('/api/auth/me', { withCredentials: true })
      .pipe(
        tap(response => {
          this._user.set({ username: response.username, roles: response.roles });
        }),
        catchError(() => {
          this._user.set(null);
          return of(null);
        })
      )
      .subscribe({ complete: () => this._ready.next() });
  }
}
