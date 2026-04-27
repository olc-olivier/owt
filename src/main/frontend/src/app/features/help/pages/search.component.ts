import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-search',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Search & filter" subtitle="Find boats quickly by name or description" icon="search">

      <p>
        The search bar at the top of the Fleet Registry table lets you narrow down the list
        in real time.  No need to press Enter — results update as you type.
      </p>

      <h2>How to search</h2>
      <ol class="step-list">
        <li>Click inside the <strong>Search</strong> field in the table toolbar.</li>
        <li>Start typing a boat name or any word from its description.</li>
        <li>The table updates immediately to show only matching boats.</li>
        <li>To clear the filter, click the <strong>×</strong> button that appears inside the field, or delete your text manually.</li>
      </ol>

      <h2>What gets searched?</h2>
      <table>
        <thead><tr><th>Field</th><th>Searchable?</th></tr></thead>
        <tbody>
          <tr><td>Name</td><td>✅ Yes</td></tr>
          <tr><td>Description</td><td>✅ Yes</td></tr>
          <tr><td>Owner, Length, Capacity, Year</td><td>❌ Not included in search</td></tr>
        </tbody>
      </table>

      <h2>Tips</h2>
      <ul>
        <li>The search is <strong>case-insensitive</strong> — "breeze", "Breeze", and "BREEZE" all return the same results.</li>
        <li>You can search for partial words — typing "sea" will match "Sea Breeze" and any description containing "seas".</li>
        <li>When a search is active, the table footer shows <em>"No boats match &hellip;"</em> if nothing is found.</li>
      </ul>

      <div class="tip">
        <mat-icon>lightbulb</mat-icon>
        <span>Sorting still works while a filter is active — click column headings to sort the filtered results.</span>
      </div>
    </app-help-page>
  `,
})
export class HelpSearchComponent {}
