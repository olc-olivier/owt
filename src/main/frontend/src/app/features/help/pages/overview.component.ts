import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-overview',
  standalone: true,
  imports: [HelpPageComponent, RouterLink, MatIconModule],
  template: `
    <app-help-page title="Welcome to BoatFleet" subtitle="Everything you need to manage your boat fleet" icon="home">

      <p>
        <strong>BoatFleet</strong> is a web application that lets you manage a fleet of boats from
        a single screen. You can add new boats, update their details, remove them, and search
        through the list in seconds.
      </p>

      <h2>What you can do</h2>
      <table>
        <thead><tr><th>Feature</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>📋 View the fleet</td><td>See all registered boats in a sortable, paginated table.</td></tr>
          <tr><td>➕ Add a boat</td><td>Register a new boat with name, description, size, and owner.</td></tr>
          <tr><td>✏️ Edit a boat</td><td>Update any detail of an existing boat at any time.</td></tr>
          <tr><td>🗑️ Delete a boat</td><td>Remove a boat permanently after a confirmation step.</td></tr>
          <tr><td>🔍 Search</td><td>Filter the list instantly by name or description.</td></tr>
          <tr><td>🌙 Dark mode</td><td>Switch between light and dark themes from the sidebar.</td></tr>
        </tbody>
      </table>

      <h2>Quick start</h2>
      <ol class="step-list">
        <li><a routerLink="../login">Sign in</a> with your username and password.</li>
        <li>You land on the <strong>Fleet Registry</strong> — the full list of boats.</li>
        <li>Click <strong>Add Boat</strong> to register your first boat.</li>
        <li>Click any row to open that boat's detail view.</li>
      </ol>

      <div class="tip">
        <mat-icon>lightbulb</mat-icon>
        <span>Use the sidebar on the left to navigate between sections. Click the chevron arrow to collapse it to an icon rail.</span>
      </div>
    </app-help-page>
  `,
})
export class HelpOverviewComponent {}
