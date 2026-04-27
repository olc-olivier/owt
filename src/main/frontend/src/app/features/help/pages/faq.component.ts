import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

interface FaqItem { q: string; a: string; open: boolean; }

/** @category Components */
@Component({
  selector: 'app-help-faq',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Frequently asked questions" subtitle="Quick answers to common questions" icon="help_outline">

      @for (item of items(); track item.q) {
        <div class="faq-item" [class.open]="item.open">
          <button class="faq-q" (click)="toggle(item)">
            <span>{{ item.q }}</span>
            <mat-icon>{{ item.open ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
          @if (item.open) {
            <div class="faq-a" [innerHTML]="item.a"></div>
          }
        </div>
      }
    </app-help-page>
  `,
  styles: [`
    .faq-item {
      border: 1px solid var(--mat-divider-color, rgba(0,0,0,0.1));
      border-radius: 8px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .faq-q {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 14px 16px;
      background: var(--mat-sys-surface-container-low, #fef7ff);
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: var(--mat-sys-on-surface);
    }

    .faq-item.open .faq-q {
      background: var(--mat-sys-secondary-container, #e8def8);
      color: var(--mat-sys-on-secondary-container, #1d192b);
    }

    .faq-a {
      padding: 12px 16px 14px;
      font-size: 13.5px;
      line-height: 1.65;
      color: var(--mat-sys-on-surface);
    }
  `],
})
export class HelpFaqComponent {
  items = signal<FaqItem[]>([
    {
      q: 'Can I undo a deletion?',
      a: 'No. Deletions are permanent. Always double-check the boat name shown in the confirmation dialog before confirming.',
      open: false,
    },
    {
      q: 'Why am I being redirected to the login page?',
      a: 'Your session is tied to the current browser tab. If you close and reopen the tab, or the session expires, you will need to sign in again.',
      open: false,
    },
    {
      q: 'Can I search by owner name or boat length?',
      a: 'Not currently. The search bar matches only the boat <strong>name</strong> and <strong>description</strong>. You can sort by owner or length by clicking the corresponding column heading.',
      open: false,
    },
    {
      q: 'How do I change the number of rows shown per page?',
      a: 'Use the <strong>Items per page</strong> selector in the bottom-left of the table. Available options are 5, 10, 25, and 50.',
      open: false,
    },
    {
      q: 'How do I switch to dark mode?',
      a: 'Click the moon icon (🌙) at the bottom of the left sidebar. Click the sun icon (☀️) to switch back to light mode. Your preference is saved automatically.',
      open: false,
    },
    {
      q: 'Can I edit multiple boats at once?',
      a: 'No. Boats must be edited one at a time using the edit button on each row or the Edit button inside the detail view.',
      open: false,
    },
    {
      q: 'What does the boat ID number mean?',
      a: 'Each boat is assigned a unique internal number when it is created. It appears below the boat name in the table. It has no special meaning for day-to-day use.',
      open: false,
    },
  ]);

  toggle(item: FaqItem): void {
    item.open = !item.open;
    this.items.update(list => [...list]);
  }
}
