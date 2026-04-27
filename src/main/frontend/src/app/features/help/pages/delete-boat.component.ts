import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-delete-boat',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Deleting a boat" subtitle="Permanently remove a boat from the fleet" icon="delete">

      <div class="tip warn">
        <mat-icon>warning</mat-icon>
        <span><strong>Deletion is permanent.</strong> Once a boat is removed it cannot be recovered.</span>
      </div>

      <h2>How to delete a boat</h2>
      <ol class="step-list">
        <li>Find the boat in the <strong>Fleet Registry</strong> table.</li>
        <li>Click the <strong>trash icon</strong> (🗑️) in the Actions column for that row.</li>
        <li>A confirmation dialog appears showing the boat's name.</li>
        <li>Click <strong>Delete</strong> to confirm, or <strong>Cancel</strong> to go back.</li>
      </ol>

      <h2>Deleting from the detail view</h2>
      <ol class="step-list">
        <li>Click on a boat row to open its detail view.</li>
        <li>Click the <strong>Delete</strong> button inside the dialog.</li>
        <li>Confirm the action in the confirmation dialog that appears.</li>
      </ol>

      <h2>After deletion</h2>
      <p>
        The boat is removed from the table immediately.  The statistics cards at the top
        of the page update to reflect the new totals.
        A brief notification appears at the bottom of the screen confirming the deletion.
      </p>
    </app-help-page>
  `,
})
export class HelpDeleteBoatComponent {}
