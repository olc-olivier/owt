import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-edit-boat',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Editing a boat" subtitle="Update the details of a registered boat" icon="edit">

      <p>
        You can update a boat's information at any time.  There are two ways to open
        the edit form.
      </p>

      <h2>Method 1 — from the table row</h2>
      <ol class="step-list">
        <li>Find the boat in the <strong>Fleet Registry</strong> table.</li>
        <li>Click the <strong>pencil icon</strong> (✏️) in the Actions column for that row.</li>
        <li>The edit form opens pre-filled with the current values.</li>
        <li>Change any fields you need to update.</li>
        <li>Click <strong>Save</strong> to apply the changes.</li>
      </ol>

      <h2>Method 2 — from the detail view</h2>
      <ol class="step-list">
        <li>Click anywhere on a boat row to open its detail view.</li>
        <li>Click the <strong>Edit</strong> button inside the dialog.</li>
        <li>The form fields become editable in place.</li>
        <li>Click <strong>Save</strong> to confirm, or <strong>Cancel</strong> to discard.</li>
      </ol>

      <div class="tip">
        <mat-icon>lightbulb</mat-icon>
        <span>Only the fields you change are relevant — all fields are required to be non-empty when saving.</span>
      </div>

      <h2>What happens after saving?</h2>
      <p>
        The table refreshes automatically and shows the updated information.
        A brief confirmation message appears at the bottom of the screen.
      </p>
    </app-help-page>
  `,
})
export class HelpEditBoatComponent {}
