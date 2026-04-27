import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Full-page login form for the BoatFleet application.
 *
 * Selector: `app-login`
 *
 * Provides two authentication paths:
 * - **Username / password form**: calls {@link AuthService.login} which posts
 *   to {@code /api/auth/login}. On success navigates to {@code /boats}.
 * - **Sign in with Dex**: redirects the browser to
 *   {@code /oauth2/authorization/dex} for the OAuth2 redirect flow.
 *
 * **Features:**
 * - Reactive form with required-field validation.
 * - Password visibility toggle.
 * - Loading state while the authentication call is in progress.
 *
 * @category Components
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  template: `
    <div class="login-page">
      <div class="login-brand">
        <mat-icon class="brand-icon">sailing</mat-icon>
        <span class="brand-name">BoatFleet</span>
      </div>

      <mat-card class="login-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>Welcome back! 👋</mat-card-title>
          <mat-card-subtitle>Sign in to manage your fleet</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="on">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix>person_outline</mat-icon>
              <input matInput formControlName="username" autocomplete="username" placeholder="admin" />
              @if (form.get('username')?.hasError('required') && form.get('username')?.touched) {
                <mat-error>Username is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock_outline</mat-icon>
              <input
                matInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
              />
              <button type="button" mat-icon-button matSuffix (click)="showPassword.set(!showPassword())">
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            @if (error()) {
              <p class="error-msg">
                <mat-icon>error_outline</mat-icon>
                {{ error() }}
              </p>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="submit-btn"
              [disabled]="loading()"
            >
              @if (loading()) {
                <mat-spinner diameter="20" />
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="divider-row">
            <mat-divider class="divider-line" />
            <span class="divider-label">or</span>
            <mat-divider class="divider-line" />
          </div>

          <button
            mat-stroked-button
            color="accent"
            type="button"
            class="dex-btn"
            (click)="loginWithDex()"
            [disabled]="loading()"
          >
            <mat-icon>vpn_key</mat-icon>
            Sign in with Dex
          </button>
        </mat-card-content>

        <mat-card-footer>
          <p class="hint">Use admin / password for form login, or sign in via Dex OAuth2.</p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      color: white;

      .brand-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      .brand-name {
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      border-radius: 16px !important;
      overflow: hidden;

      mat-card-header {
        padding: 2rem 2rem 0;
      }

      mat-card-title {
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        margin-bottom: 0.25rem !important;
      }

      mat-card-subtitle {
        font-size: 0.9rem !important;
      }

      mat-card-content {
        padding: 1.5rem 2rem !important;
      }

      mat-card-footer {
        padding: 0 2rem 1.5rem;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .full-width {
      width: 100%;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #d32f2f;
      font-size: 0.85rem;
      margin: 0;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      margin-top: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .divider-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.25rem 0 1rem;

      .divider-line {
        flex: 1;
      }

      .divider-label {
        font-size: 0.8rem;
        color: var(--mat-card-subtitle-text-color, #888);
        white-space: nowrap;
      }
    }

    .dex-btn {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .hint {
      text-align: center;
      font-size: 0.78rem;
      color: var(--mat-card-subtitle-text-color, #666);
      margin: 0;
    }
  `],
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  showPassword = signal(false);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.auth.sessionReady$.pipe(take(1)).subscribe(() => {
      if (this.auth.isAuthenticated) {
        this.router.navigate(['/boats'], { replaceUrl: true });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe(ok => {
      this.loading.set(false);
      if (ok) {
        this.router.navigate(['/boats']);
      } else {
        this.error.set('Invalid credentials. Please try again.');
      }
    });
  }

  loginWithDex(): void {
    window.location.href = '/oauth2/authorization/dex';
  }
}
