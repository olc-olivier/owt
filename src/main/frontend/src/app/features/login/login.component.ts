import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

/**
 * Full-page login form for the BoatFleet application.
 *
 * Selector: `app-login`
 *
 * Validates that both username and password are non-empty before calling
 * {@link AuthService.login}. On success the user is navigated to `/boats`.
 * On failure an inline error message is displayed.
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
        </mat-card-content>

        <mat-card-footer>
          <p class="hint">Any credentials work — the fleet awaits.</p>
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

    .hint {
      text-align: center;
      font-size: 0.78rem;
      color: var(--mat-card-subtitle-text-color, #666);
      margin: 0;
    }
  `],
})
export class LoginComponent {
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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const { username, password } = this.form.getRawValue();
    const ok = this.auth.login(username, password);
    this.loading.set(false);
    if (ok) {
      this.router.navigate(['/boats']);
    } else {
      this.error.set('Invalid credentials. Please try again.');
    }
  }
}
