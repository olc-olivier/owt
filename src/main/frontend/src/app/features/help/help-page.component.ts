import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Reusable wrapper that gives every help page a consistent heading, icon,
 * and content area.  Import it in each page component's `imports` array.
 *
 * @category Components
 */
@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="help-page">
      <header class="page-header">
        <mat-icon class="page-icon">{{ icon() }}</mat-icon>
        <div>
          <h1 class="page-title">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="page-subtitle">{{ subtitle() }}</p>
          }
        </div>
      </header>
      <div class="page-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .help-page { max-width: 720px; }

    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--mat-sys-primary, #6750a4);
    }

    .page-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--mat-sys-primary, #6750a4);
      margin-top: 4px;
    }

    .page-title {
      margin: 0 0 4px;
      font-size: 24px;
      font-weight: 700;
      color: var(--mat-sys-on-surface);
    }

    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .page-body { font-size: 14.5px; line-height: 1.7; color: var(--mat-sys-on-surface); }

    :host ::ng-deep {
      h2 { font-size: 17px; font-weight: 600; margin: 28px 0 8px; }
      h3 { font-size: 15px; font-weight: 600; margin: 20px 0 6px; }
      p  { margin: 0 0 12px; }
      ul, ol { padding-left: 20px; margin: 0 0 12px; }
      li { margin-bottom: 4px; }

      .tip {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 12px 14px;
        border-radius: 8px;
        background: var(--mat-sys-secondary-container, #e8def8);
        margin: 16px 0;
        font-size: 13.5px;
      }

      .warn {
        background: #fff3e0;
        color: #bf360c;
      }

      .step-list {
        list-style: none;
        padding: 0;
        counter-reset: step;
      }

      .step-list li {
        counter-increment: step;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 14px;
      }

      .step-list li::before {
        content: counter(step);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--mat-sys-primary, #6750a4);
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        margin-top: 2px;
      }

      .kbd {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0.18);
        background: var(--mat-sys-surface-container, #f4f0f9);
        font-family: monospace;
        font-size: 12px;
      }

      table { border-collapse: collapse; width: 100%; margin: 12px 0 20px; font-size: 13.5px; }
      th { text-align: left; padding: 8px 12px; background: var(--mat-sys-surface-container, #f4f0f9); }
      td { padding: 8px 12px; border-bottom: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08)); }
    }
  `],
})
export class HelpPageComponent {
  title    = input.required<string>();
  subtitle = input<string>('');
  icon     = input<string>('help_outline');
}
