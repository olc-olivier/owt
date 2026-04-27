import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageComponent } from '../help-page.component';

/** @category Components */
@Component({
  selector: 'app-help-login',
  standalone: true,
  imports: [HelpPageComponent, MatIconModule],
  template: `
    <app-help-page title="Signing in" subtitle="How to log in to BoatFleet" icon="login">

      <p>
        BoatFleet requires you to sign in before you can view or manage any boats.
        Your session is remembered for the duration of your browser tab — closing the tab
        will sign you out automatically.
      </p>

      <h2>How to sign in</h2>
      <ol class="step-list">
        <li>Open the application. You will be taken to the <strong>Sign In</strong> page automatically.</li>
        <li>Enter your <strong>Username</strong> in the first field.</li>
        <li>Enter your <strong>Password</strong> in the second field.</li>
        <li>Click <strong>Sign In</strong>. You will be redirected to the Fleet Registry.</li>
      </ol>

      <div class="tip">
        <mat-icon>visibility</mat-icon>
        <span>Click the eye icon on the right of the password field to show or hide your password as you type.</span>
      </div>

      <h2>Sign out</h2>
      <p>
        Click your username in the bottom-left corner of the sidebar, then choose
        <strong>Sign out</strong> from the menu.
      </p>

      <h2>Troubleshooting</h2>
      <table>
        <thead><tr><th>Problem</th><th>Solution</th></tr></thead>
        <tbody>
          <tr><td>"Invalid credentials" appears</td><td>Check your username and password for typos. Both fields are case-sensitive.</td></tr>
          <tr><td>Fields are highlighted in red</td><td>Both username and password must be filled in before submitting.</td></tr>
          <tr><td>Page keeps reloading</td><td>Try clearing your browser cookies and logging in again.</td></tr>
        </tbody>
      </table>
    </app-help-page>
  `,
})
export class HelpLoginComponent {}
