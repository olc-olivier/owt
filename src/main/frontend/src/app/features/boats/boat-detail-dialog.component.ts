import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Boat, CreateBoatRequest } from '../../models/boat.model';

/**
 * Input data injected into {@link BoatDetailDialogComponent} via `MAT_DIALOG_DATA`.
 *
 * @category Components
 */
export interface DetailDialogData {
  /** The boat whose details are displayed. */
  boat: Boat;
}

/**
 * Value emitted by the dialog when it closes with an action.
 *
 * @category Components
 */
export interface DetailDialogResult {
  /** Whether the user chose to edit or delete the boat. */
  action: 'edit' | 'delete';
  /** Updated boat fields when `action === 'edit'`. */
  data?: CreateBoatRequest;
}

/**
 * Detail dialog for viewing and inline-editing a single boat.
 *
 * Selector: `app-boat-detail-dialog`
 *
 * Displays boat metadata in read-only view by default. An **Edit** button
 * switches to an inline reactive form. The dialog closes with a
 * {@link DetailDialogResult} when the user saves changes or requests deletion,
 * or `undefined` when they dismiss without action.
 *
 * @example
 * ```typescript
 * const ref = this.dialog.open(BoatDetailDialogComponent, { data: { boat } });
 * ref.afterClosed().subscribe((result: DetailDialogResult | undefined) => {
 *   if (result?.action === 'edit')   this.boatService.update(boat.id, result.data!).subscribe(...);
 *   if (result?.action === 'delete') this.boatService.delete(boat.id).subscribe(...);
 * });
 * ```
 *
 * @category Components
 */
@Component({
  selector: 'app-boat-detail-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="boat-avatar">
          <mat-icon>directions_boat</mat-icon>
        </div>
        <div class="header-info">
          @if (!editMode()) {
            <h2>{{ data.boat.name }}</h2>
            <span class="owner-chip">
              <mat-icon>person</mat-icon> {{ data.boat.ownerName }}
            </span>
          } @else {
            <h2>Edit Boat</h2>
          }
        </div>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider />

      <mat-dialog-content>
        @if (!editMode()) {
          <!-- Detail View -->
          <div class="detail-view">
            <p class="description">{{ data.boat.description }}</p>

            <div class="stats-grid">
              <div class="stat-card">
                <mat-icon>straighten</mat-icon>
                <div class="stat-info">
                  <span class="stat-value">{{ data.boat.length }} m</span>
                  <span class="stat-label">Length</span>
                </div>
              </div>
              <div class="stat-card">
                <mat-icon>group</mat-icon>
                <div class="stat-info">
                  <span class="stat-value">{{ data.boat.capacity }}</span>
                  <span class="stat-label">Capacity</span>
                </div>
              </div>
              <div class="stat-card">
                <mat-icon>calendar_today</mat-icon>
                <div class="stat-info">
                  <span class="stat-value">{{ data.boat.yearBuilt }}</span>
                  <span class="stat-label">Year Built</span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Edit Form -->
          <form [formGroup]="form" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" />
              @if (hasError('name', 'required')) { <mat-error>Required</mat-error> }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Owner Name</mat-label>
              <input matInput formControlName="ownerName" />
              @if (hasError('ownerName', 'required')) { <mat-error>Required</mat-error> }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-span">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
              @if (hasError('description', 'required')) { <mat-error>Required</mat-error> }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Length (m)</mat-label>
              <input matInput type="number" formControlName="length" min="0.1" step="0.1" />
              @if (hasError('length', 'min')) { <mat-error>Must be &gt; 0</mat-error> }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Capacity</mat-label>
              <input matInput type="number" formControlName="capacity" min="1" />
              @if (hasError('capacity', 'min')) { <mat-error>Must be ≥ 1</mat-error> }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Year Built</mat-label>
              <input matInput type="number" formControlName="yearBuilt" min="1800" />
              @if (hasError('yearBuilt', 'min')) { <mat-error>Must be ≥ 1800</mat-error> }
            </mat-form-field>
          </form>
        }
      </mat-dialog-content>

      <mat-divider />

      <mat-dialog-actions align="end">
        @if (!editMode()) {
          <button mat-stroked-button color="warn" (click)="emitDelete()">
            <mat-icon>delete</mat-icon> Delete
          </button>
          <span class="spacer"></span>
          <button mat-stroked-button mat-dialog-close>Close</button>
          <button mat-flat-button color="primary" (click)="editMode.set(true)">
            <mat-icon>edit</mat-icon> Edit
          </button>
        } @else {
          <button mat-stroked-button (click)="editMode.set(false)">Cancel</button>
          <button mat-flat-button color="primary" (click)="saveEdit()">
            <mat-icon>save</mat-icon> Save Changes
          </button>
        }
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 480px;

      @media (max-width: 520px) {
        min-width: unset;
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem 1rem;
    }

    .boat-avatar {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: linear-gradient(135deg, #696cff22, #9155fd22);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        color: #696cff;
        font-size: 1.75rem;
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    .header-info {
      flex: 1;

      h2 {
        margin: 0 0 0.25rem;
        font-size: 1.2rem;
        font-weight: 600;
      }
    }

    .owner-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.82rem;
      color: #888;

      mat-icon {
        font-size: 0.9rem;
        width: 0.9rem;
        height: 0.9rem;
      }
    }

    .close-btn {
      margin-left: auto;
      flex-shrink: 0;
    }

    .detail-view {
      padding: 1rem 0;
    }

    .description {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 10px;
      background: rgba(105, 108, 255, 0.06);
      border: 1px solid rgba(105, 108, 255, 0.12);

      mat-icon {
        color: #696cff;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
      padding-top: 0.5rem;

      @media (max-width: 520px) {
        grid-template-columns: 1fr;
      }
    }

    .full-span {
      grid-column: 1 / -1;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 0.75rem 1.5rem 1rem;
      gap: 0.5rem;
    }

    .spacer {
      flex: 1;
    }
  `],
})
export class BoatDetailDialogComponent {
  data: DetailDialogData = inject(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<BoatDetailDialogComponent>);
  private fb = inject(FormBuilder);

  editMode = signal(false);

  form = this.fb.nonNullable.group({
    name: [this.data.boat.name, Validators.required],
    description: [this.data.boat.description, Validators.required],
    ownerName: [this.data.boat.ownerName, Validators.required],
    length: [this.data.boat.length, [Validators.required, Validators.min(0.1)]],
    capacity: [this.data.boat.capacity, [Validators.required, Validators.min(1)]],
    yearBuilt: [this.data.boat.yearBuilt, [Validators.required, Validators.min(1800)]],
  });

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  emitDelete(): void {
    this.ref.close({ action: 'delete' } as DetailDialogResult);
  }

  saveEdit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close({ action: 'edit', data: this.form.getRawValue() as CreateBoatRequest });
  }
}
