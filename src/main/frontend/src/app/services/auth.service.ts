import { Injectable, signal } from '@angular/core';

/**
 * Minimal authenticated user representation stored in session storage.
 *
 * @category Services
 */
export interface AuthUser {
  /** Username of the currently authenticated user. */
  username: string;
}

const STORAGE_KEY = 'auth_user';

/**
 * Handles authentication state for the BoatFleet application.
 *
 * Credentials are validated client-side (any non-empty username/password
 * succeeds). The authenticated user is persisted in `sessionStorage` so
 * that a page refresh does not force a re-login within the same browser tab.
 *
 * @example
 * ```typescript
 * const auth = inject(AuthService);
 *
 * if (auth.login('admin', 'secret')) {
 *   router.navigate(['/boats']);
 * }
 *
 * // Later…
 * auth.logout();
 * ```
 *
 * @category Services
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadUser());

  /**
   * Read-only signal exposing the currently authenticated user,
   * or `null` when no session is active.
   */
  readonly user = this._user.asReadonly();

  /**
   * `true` when a valid session is present, `false` otherwise.
   *
   * @example
   * ```typescript
   * if (!auth.isAuthenticated) {
   *   router.navigate(['/login']);
   * }
   * ```
   */
  get isAuthenticated(): boolean {
    return this._user() !== null;
  }

  /**
   * Authenticates the user with the provided credentials.
   *
   * Any non-empty username and password combination is accepted.
   * On success the user is persisted to `sessionStorage`.
   *
   * @param username - The username to authenticate.
   * @param password - The password to authenticate.
   * @returns `true` on success, `false` when either field is empty.
   */
  login(username: string, password: string): boolean {
    if (!username || !password) return false;
    const user: AuthUser = { username };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._user.set(user);
    return true;
  }

  /**
   * Clears the current session and removes the stored user from
   * `sessionStorage`. Subscribers to {@link user} are notified immediately.
   */
  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
  }

  /**
   * Restores the user from `sessionStorage` at service construction time.
   * Returns `null` if no valid session exists or the stored value is corrupt.
   */
  private loadUser(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
