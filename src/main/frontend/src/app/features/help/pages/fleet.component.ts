import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-fleet',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Viewing the fleet" subtitle="Understanding the Fleet Registry page" icon="directions_boat">

      <p>
        After signing in, you land on the <strong>Fleet Registry</strong> — the main page of
        BoatFleet.  It gives you a complete overview of all registered boats and quick
        statistics about the fleet.
      </p>

      <h2>Statistics cards</h2>
      <p>
        The four cards at the top of the page update in real time as you add or remove boats:
      </p>
      <table>
        <thead><tr><th>Card</th><th>What it shows</th></tr></thead>
        <tbody>
          <tr><td>Total Boats</td><td>Number of registered boats in the fleet.</td></tr>
          <tr><td>Total Capacity</td><td>Combined maximum passenger count across all boats.</td></tr>
          <tr><td>Avg. Length</td><td>Average boat length in metres.</td></tr>
          <tr><td>Unique Owners</td><td>Number of distinct registered owners.</td></tr>
        </tbody>
      </table>

      <h2>The boat table</h2>
      <p>The main table lists every boat with the following columns:</p>
      <ul>
        <li><strong>Name</strong> — boat name and its internal ID.</li>
        <li><strong>Description</strong> — short description (hover to read the full text if it is truncated).</li>
        <li><strong>Length</strong> — length in metres.</li>
        <li><strong>Capacity</strong> — maximum number of passengers.</li>
        <li><strong>Year</strong> — year the boat was built.</li>
        <li><strong>Owner</strong> — name of the registered owner.</li>
        <li><strong>Actions</strong> — edit and delete buttons.</li>
      </ul>

      <h2>Sorting the table</h2>
      <p>
        Click any column heading to sort the table by that column.
        Click it again to reverse the sort order.
        A small arrow next to the heading shows the active sort direction.
      </p>

      <h2>Pagination</h2>
      <p>
        Use the controls at the bottom of the table to change the number of rows per page
        and navigate between pages.
      </p>

      <div class="tip">
        <mat-icon>lightbulb</mat-icon>
        <span>Click any row to open that boat's full detail view without entering edit mode.</span>
      </div>
    </app-help-page>
  `,
})
export class HelpFleetComponent {}
