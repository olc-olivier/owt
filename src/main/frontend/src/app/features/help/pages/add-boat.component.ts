import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-add-boat',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Adding a boat" subtitle="Register a new boat in the fleet" icon="add_circle">

      <p>
        Use the <strong>Add Boat</strong> button to register a new boat.  The information you
        provide will appear immediately in the Fleet Registry after saving.
      </p>

      <h2>Step-by-step</h2>
      <ol class="step-list">
        <li>Go to the <strong>Fleet Registry</strong> page.</li>
        <li>Click the blue <strong>Add Boat</strong> button in the top-right of the table toolbar.</li>
        <li>Fill in the form fields (see below).</li>
        <li>Click <strong>Save</strong>. The dialog closes and the new boat appears in the table.</li>
      </ol>

      <h2>Form fields</h2>
      <table>
        <thead><tr><th>Field</th><th>Description</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Name <em>*</em></td><td>The boat's display name.</td><td>Sea Breeze</td></tr>
          <tr><td>Description <em>*</em></td><td>A short description of the boat.</td><td>Classic sailing yacht, ideal for coastal cruising.</td></tr>
          <tr><td>Length (m) <em>*</em></td><td>Overall length in metres.</td><td>12.5</td></tr>
          <tr><td>Capacity <em>*</em></td><td>Maximum number of passengers.</td><td>8</td></tr>
          <tr><td>Year built <em>*</em></td><td>The year the boat was manufactured.</td><td>2010</td></tr>
          <tr><td>Owner <em>*</em></td><td>Full name of the registered owner.</td><td>Alice Martin</td></tr>
        </tbody>
      </table>
      <p><em>* Required field</em></p>

      <div class="tip">
        <mat-icon>lightbulb</mat-icon>
        <span>All fields are required. The form will not submit until every field is completed.</span>
      </div>

      <h2>Cancelling</h2>
      <p>
        Click <strong>Cancel</strong> or press <span class="kbd">Esc</span> to close the dialog
        without saving any changes.
      </p>
    </app-help-page>
  `,
})
export class HelpAddBoatComponent {}
