import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface HelpPage {
  path: string;
  label: string;
  icon: string;
  category: string;
}

const PAGES: HelpPage[] = [
  { path: 'overview',        label: 'Application overview',  icon: 'home',           category: 'Getting started' },
  { path: 'login',           label: 'Signing in',            icon: 'login',          category: 'Getting started' },
  { path: 'fleet',           label: 'Viewing the fleet',     icon: 'directions_boat',category: 'Fleet management' },
  { path: 'add-boat',        label: 'Adding a boat',         icon: 'add_circle',     category: 'Fleet management' },
  { path: 'edit-boat',       label: 'Editing a boat',        icon: 'edit',           category: 'Fleet management' },
  { path: 'delete-boat',     label: 'Deleting a boat',       icon: 'delete',         category: 'Fleet management' },
  { path: 'boat-details',    label: 'Boat detail view',      icon: 'info',           category: 'Fleet management' },
  { path: 'search',          label: 'Search & filter',       icon: 'search',         category: 'Fleet management' },
  { path: 'faq',             label: 'FAQ',                   icon: 'help_outline',   category: 'Support' },
];

/**
 * Shell component for the in-app help centre.
 *
 * Renders a fixed left sidebar with categorised navigation and a scrollable
 * content area driven by child routes.  A search bar filters the sidebar
 * links in real time.
 *
 * @category Components
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, FormsModule],
  template: `
    <div class="help-shell">

      <!-- ── Sidebar ── -->
      <aside class="help-sidebar">
        <div class="sidebar-header">
          <mat-icon>menu_book</mat-icon>
          <span>Help centre</span>
        </div>

        <div class="search-wrap">
          <mat-icon class="search-icon">search</mat-icon>
          <input
            class="search-input"
            placeholder="Search…"
            [(ngModel)]="query"
            (ngModelChange)="filterPages($event)"
            aria-label="Search help pages"
          />
        </div>

        @for (category of visibleCategories(); track category) {
          <div class="nav-category">{{ category }}</div>
          @for (page of pagesByCategory(category); track page.path) {
            <a
              class="nav-item"
              [routerLink]="page.path"
              routerLinkActive="active"
            >
              <mat-icon class="nav-icon">{{ page.icon }}</mat-icon>
              <span>{{ page.label }}</span>
            </a>
          }
        }

        @if (visibleCategories().length === 0) {
          <p class="no-results">No results for "{{ query }}"</p>
        }
      </aside>

      <!-- ── Content ── -->
      <main class="help-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .help-shell {
      display: flex;
      height: 100%;
      min-height: 0;
      background: var(--mat-sys-surface, #f5f5f5);
    }

    /* ── Sidebar ── */
    .help-sidebar {
      width: 240px;
      min-width: 240px;
      background: var(--mat-sys-surface-container-low, #fff);
      border-right: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding-bottom: 24px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 16px 12px;
      font-weight: 600;
      font-size: 15px;
      color: var(--mat-sys-on-surface);
      border-bottom: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
      margin-bottom: 8px;
    }

    .sidebar-header mat-icon { color: var(--mat-sys-primary, #6750a4); }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 12px 12px;
      padding: 6px 10px;
      border-radius: 20px;
      background: var(--mat-sys-surface-container, #ece6f0);
    }

    .search-icon { font-size: 18px; width: 18px; height: 18px; color: var(--mat-sys-on-surface-variant); }

    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 13px;
      flex: 1;
      color: var(--mat-sys-on-surface);
    }

    .nav-category {
      padding: 12px 16px 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--mat-sys-on-surface-variant, #6b7280);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      text-decoration: none;
      color: var(--mat-sys-on-surface);
      font-size: 13.5px;
      border-radius: 0 20px 20px 0;
      margin-right: 8px;
      transition: background 0.15s;
    }

    .nav-item:hover { background: var(--mat-sys-surface-container, rgba(0,0,0,0.04)); }
    .nav-item.active {
      background: var(--mat-sys-secondary-container, #e8def8);
      color: var(--mat-sys-on-secondary-container, #1d192b);
      font-weight: 600;
    }

    .nav-icon { font-size: 18px; width: 18px; height: 18px; }

    .no-results {
      padding: 16px;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
    }

    /* ── Content ── */
    .help-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px 40px;
    }

    @media (max-width: 700px) {
      .help-sidebar { width: 200px; min-width: 200px; }
      .help-content { padding: 20px 16px; }
    }
  `],
})
export class HelpComponent {
  query = '';
  private filtered = signal<HelpPage[]>(PAGES);

  filterPages(q: string): void {
    const lq = q.toLowerCase();
    this.filtered.set(lq ? PAGES.filter(p => p.label.toLowerCase().includes(lq) || p.category.toLowerCase().includes(lq)) : PAGES);
  }

  visibleCategories(): string[] {
    return [...new Set(this.filtered().map(p => p.category))];
  }

  pagesByCategory(category: string): HelpPage[] {
    return this.filtered().filter(p => p.category === category);
  }
}
