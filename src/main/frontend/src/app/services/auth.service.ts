import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  username: string;
}

const STORAGE_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadUser());

  readonly user = this._user.asReadonly();

  get isAuthenticated(): boolean {
    return this._user() !== null;
  }

  login(username: string, password: string): boolean {
    if (!username || !password) return false;
    const user: AuthUser = { username };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._user.set(user);
    return true;
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
