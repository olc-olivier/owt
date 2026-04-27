import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../theme.service';

/**
 * Authenticated application shell with a collapsible sidebar.
 *
 * Selector: `app-layout`
 *
 * This component wraps all protected routes.  It renders:
 * - A **sidebar** with navigation links, a branding header, and a user menu.
 * - A **main content area** driven by `<router-outlet>`.
 *
 * **Sidebar states** (Sneat-style three-state rail):
 * | CSS class      | Description                                     |
 * |----------------|-------------------------------------------------|
 * | `pinned-open`  | Full sidebar (260 px), chevron points left.     |
 * | `pinned-closed`| Narrow icon rail (68 px), labels hidden.        |
 * | `peeking`      | Hover overlay expands rail to 260 px temporarily.|
 *
 * State is driven by two signals: {@link collapsed} and {@link hovering}.
 *
 * @category Components
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  template: `
    <div
      class="shell"
      [class.pinned-open]="!collapsed()"
      [class.pinned-closed]="collapsed() && !hovering()"
      [class.peeking]="collapsed() && hovering()"
    >
      <!-- ── Sidebar ── -->
      <aside
        class="sidebar"
        (mouseenter)="onSidebarEnter()"
        (mouseleave)="onSidebarLeave()"
      >
        <!-- Brand row -->
        <div class="sidebar-header">
          <mat-icon class="brand-icon">sailing</mat-icon>
          <span class="brand-name">BoatFleet</span>

          <!-- Chevron toggle — always rendered, CSS hides/shows it -->
          <button
            class="chevron-btn"
            (click)="togglePinned()"
            [title]="collapsed() ? 'Pin sidebar open' : 'Collapse sidebar'"
          >
            <mat-icon class="chevron-icon">
              {{ collapsed() ? 'chevron_right' : 'chevron_left' }}
            </mat-icon>
          </button>
        </div>

        <!-- Nav links -->
        <nav class="sidebar-nav">
          <a
            class="nav-item"
            routerLink="/boats"
            routerLinkActive="active"
          >
            <mat-icon class="nav-icon">directions_boat</mat-icon>
            <span class="nav-label">Fleet Management</span>
          </a>
          <a
            class="nav-item"
            routerLink="/help"
            routerLinkActive="active"
          >
            <mat-icon class="nav-icon">help_outline</mat-icon>
            <span class="nav-label">Help</span>
          </a>
        </nav>

        <!-- Footer -->
        <div class="sidebar-footer">
          <button
            class="footer-btn"
            (click)="themeService.toggleTheme()"
            [title]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <mat-icon class="nav-icon">
              {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
            <span class="nav-label">
              {{ themeService.isDarkMode() ? 'Light mode' : 'Dark mode' }}
            </span>
          </button>
        </div>
      </aside>

      <!-- ── Main area ── -->
      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="page-title">Fleet Management</h2>
          </div>
          <div class="topbar-right">
            <button
              mat-icon-button
              [matMenuTriggerFor]="userMenu"
              class="user-btn"
            >
              <span class="avatar">{{ userInitial() }}</span>
            </button>
            <mat-menu #userMenu="matMenu">
              <div class="user-menu-header">
                <span class="user-menu-name">{{ auth.user()?.username }}</span>
                <span class="user-menu-role">Administrator</span>
              </div>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                Sign out
              </button>
            </mat-menu>
          </div>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ─────────────────────────────────────────
       Shell
    ───────────────────────────────────────── */
    .shell {
      display: flex;
      height: 100dvh;
      overflow: hidden;
    }

    /* ─────────────────────────────────────────
       Sidebar — base (always rendered at full
       width; CSS width controls appearance)
    ───────────────────────────────────────── */
    .sidebar {
      width: 260px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: #2F3349;
      color: #fff;
      /* smooth width + overflow transitions */
      transition: width 0.25s cubic-bezier(.4,0,.2,1),
                  box-shadow 0.25s ease;
      overflow: hidden;
      position: relative;
      z-index: 100;
    }

    /* ── Pinned-open: full width, no shadow ── */
    .pinned-open .sidebar {
      width: 260px;
    }

    /* ── Pinned-closed (rail): narrow icons only ── */
    .pinned-closed .sidebar {
      width: 68px;
    }

    /* ── Peeking: user is hovering the collapsed rail
          → expand to full width as floating overlay ── */
    .peeking .sidebar {
      width: 260px;
      /* lift above content so it overlays it */
      box-shadow: 4px 0 20px rgba(0,0,0,0.35);
    }

    /* ─────────────────────────────────────────
       Sidebar header
    ───────────────────────────────────────── */
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 1rem;
      min-height: 64px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      overflow: hidden;
    }

    .brand-icon {
      color: #696cff;
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      flex-shrink: 0;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: -0.01em;
      white-space: nowrap;
      flex: 1;
      /* fade out when collapsed and not peeking */
      transition: opacity 0.2s ease, width 0.2s ease;
    }

    /* ─────────────────────────────────────────
       Chevron toggle button
       — always in the DOM, positioned at the
         right edge of the header. When the
         rail is narrow it stays visible
         because it's flush-right at 68px.
    ───────────────────────────────────────── */
    .chevron-btn {
      flex-shrink: 0;
      margin-left: auto;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, opacity 0.2s;
    }

    .chevron-btn:hover {
      background: rgba(105,108,255,0.25);
      color: #fff;
    }

    .chevron-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      /* rotate the chevron smoothly */
      transition: transform 0.25s ease;
    }

    /* In pinned-closed rail: keep icon visible, only hide the text label */
    .pinned-closed .sidebar-header {
      justify-content: flex-start;
      padding: 0 1rem;
    }

    .pinned-closed .brand-name {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    /* When peeking (hover): restore full header layout */
    .peeking .sidebar-header {
      justify-content: flex-start;
      padding: 0 1rem;
    }

    .peeking .brand-name,
    .peeking .brand-icon {
      opacity: 1;
      width: auto;
    }

    /* ─────────────────────────────────────────
       Nav items
    ───────────────────────────────────────── */
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: hidden;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        background: rgba(105,108,255,0.15);
        color: #fff;
      }

      &.active {
        background: rgba(105,108,255,0.2);
        color: #696cff;
      }
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .nav-label {
      transition: opacity 0.15s ease;
      white-space: nowrap;
    }

    /* In rail mode hide labels */
    .pinned-closed .nav-label {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    /* While peeking restore labels */
    .peeking .nav-label {
      opacity: 1;
      width: auto;
    }

    /* Centre icons in the narrow rail */
    .pinned-closed .nav-item {
      justify-content: center;
      padding: 0.65rem 0;
    }

    .peeking .nav-item {
      justify-content: flex-start;
      padding: 0.65rem 0.75rem;
    }

    /* ─────────────────────────────────────────
       Sidebar footer (theme toggle)
    ───────────────────────────────────────── */
    .sidebar-footer {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 0.75rem;
      overflow: hidden;
    }

    .footer-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.6);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        background: rgba(105,108,255,0.15);
        color: #fff;
      }
    }

    .pinned-closed .footer-btn {
      justify-content: center;
      padding: 0.6rem 0;
    }

    .pinned-closed .footer-btn .nav-label {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .peeking .footer-btn {
      justify-content: flex-start;
      padding: 0.6rem 0.75rem;
    }

    .peeking .footer-btn .nav-label {
      opacity: 1;
      width: auto;
    }

    /* ─────────────────────────────────────────
       Main area
    ───────────────────────────────────────── */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #f5f5f9;
      /* smooth left margin when sidebar width changes (pinned mode only) */
      transition: margin-left 0.25s cubic-bezier(.4,0,.2,1);
    }

    :host-context(.dark) .main-area {
      background: #25293c;
    }

    /* When peeking, the sidebar overlays the content — no push */
    .peeking .main-area {
      /* no transition flicker while hovering */
    }

    /* ─────────────────────────────────────────
       Top bar
    ───────────────────────────────────────── */
    .topbar {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      background: var(--mat-card-background-color, #fff);
      border-bottom: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .page-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-btn {
      width: 40px;
      height: 40px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #696cff, #9155fd);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .user-menu-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
      margin-bottom: 0.25rem;
      display: flex;
      flex-direction: column;

      .user-menu-name { font-weight: 600; font-size: 0.95rem; }
      .user-menu-role { font-size: 0.8rem; color: #888; }
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }
  `],
})
export class LayoutComponent {
  auth = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  /** true = rail (pinned closed), false = pinned open */
  collapsed = signal(false);

  /** true while the mouse is inside the sidebar rail */
  hovering = signal(false);

  userInitial() {
    return this.auth.user()?.username?.[0] ?? 'U';
  }

  togglePinned(): void {
    this.collapsed.update(v => !v);
    // when we pin open, clear any hover state
    if (!this.collapsed()) {
      this.hovering.set(false);
    }
  }

  onSidebarEnter(): void {
    if (this.collapsed()) {
      this.hovering.set(true);
    }
  }

  onSidebarLeave(): void {
    this.hovering.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
