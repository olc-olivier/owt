import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-boat-details',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Boat detail view" subtitle="Inspect and manage a single boat" icon="info">

      <p>
        The detail view gives you a full summary of a single boat and lets you edit or
        delete it — all without leaving the Fleet Registry page.
      </p>

      <h2>Opening the detail view</h2>
      <p>
        Click anywhere on a boat's row in the table (but not on the action buttons)
        to open the detail panel as an overlay dialog.
      </p>

      <h2>What you see</h2>
      <table>
        <thead><tr><th>Section</th><th>Contents</th></tr></thead>
        <tbody>
          <tr><td>Header</td><td>Boat name, owner chip, and a close button.</td></tr>
          <tr><td>Description</td><td>The boat's full description text.</td></tr>
          <tr><td>Stats grid</td><td>Length, capacity, and year built displayed as cards.</td></tr>
          <tr><td>Actions</td><td>Edit and Delete buttons.</td></tr>
        </tbody>
      </table>

      <h2>Editing from the detail view</h2>
      <p>
        Click <strong>Edit</strong> inside the dialog.  The detail fields transform into
        editable inputs.  Make your changes and click <strong>Save</strong>, or click
        <strong>Cancel</strong> to discard them.
      </p>

      <h2>Closing the detail view</h2>
      <p>
        Click the <strong>×</strong> button in the top-right corner of the dialog,
        press <span class="kbd">Esc</span>, or click anywhere outside the dialog.
      </p>
    </app-help-page>
  `,
})
export class HelpBoatDetailsComponent {}
