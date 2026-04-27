import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Boat } from '../../models/boat.model';

/**
 * Input data injected into {@link BoatDeleteDialogComponent} via `MAT_DIALOG_DATA`.
 *
 * @category Components
 */
export interface DeleteDialogData {
  /** The boat the user is about to delete. Used to show the boat name in the confirmation message. */
  boat: Boat;
}

/**
 * Confirmation dialog shown before permanently deleting a boat.
 *
 * Selector: `app-boat-delete-dialog`
 *
 * Open this dialog via `MatDialog.open(BoatDeleteDialogComponent, { data: { boat } })`.
 * The dialog closes with `true` when the user confirms deletion, or `undefined`
 * when they cancel.
 *
 * @example
 * ```typescript
 * const ref = this.dialog.open(BoatDeleteDialogComponent, { data: { boat } });
 * ref.afterClosed().subscribe(confirmed => {
 *   if (confirmed) this.boatService.delete(boat.id).subscribe(...);
 * });
 * ```
 *
 * @category Components
 */

@Component({
  selector: 'app-boat-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-dialog">
      <div class="icon-wrap">
        <mat-icon class="warn-icon">delete_forever</mat-icon>
      </div>
      <h2 mat-dialog-title>Delete Boat?</h2>
      <mat-dialog-content>
        <p>
          Are you sure you want to delete <strong>{{ data.boat.name }}</strong>?
          This action cannot be undone.
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="center">
        <button mat-stroked-button mat-dialog-close cdkFocusInitial>Cancel</button>
        <button mat-flat-button color="warn" (click)="confirm()">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog {
      text-align: center;
      padding: 1rem;
    }

    .icon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .warn-icon {
      font-size: 3.5rem;
      width: 3.5rem;
      height: 3.5rem;
      color: #d32f2f;
    }

    h2[mat-dialog-title] {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      text-align: center;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    mat-dialog-actions {
      gap: 0.75rem;
      padding-top: 1rem;
    }
  `],
})
export class BoatDeleteDialogComponent {
  data: DeleteDialogData = inject(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<BoatDeleteDialogComponent>);

  confirm(): void {
    this.ref.close(true);
  }
}
