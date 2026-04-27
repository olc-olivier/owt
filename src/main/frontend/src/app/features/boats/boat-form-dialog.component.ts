import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Boat, CreateBoatRequest } from '../../models/boat.model';

export interface FormDialogData {
  boat?: Boat;
}

@Component({
  selector: 'app-boat-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add_circle_outline' }}</mat-icon>
      {{ isEdit ? 'Edit Boat' : 'Add New Boat' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <mat-icon matPrefix>label</mat-icon>
          <input matInput formControlName="name" placeholder="Sea Breeze" />
          @if (hasError('name', 'required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Owner Name</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput formControlName="ownerName" placeholder="John Doe" />
          @if (hasError('ownerName', 'required')) {
            <mat-error>Owner is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-span">
          <mat-label>Description</mat-label>
          <mat-icon matPrefix>description</mat-icon>
          <textarea matInput formControlName="description" rows="3" placeholder="A beautiful sailing yacht..."></textarea>
          @if (hasError('description', 'required')) {
            <mat-error>Description is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Length (m)</mat-label>
          <mat-icon matPrefix>straighten</mat-icon>
          <input matInput type="number" formControlName="length" min="0.1" step="0.1" />
          @if (hasError('length', 'required')) {
            <mat-error>Length is required</mat-error>
          }
          @if (hasError('length', 'min')) {
            <mat-error>Must be &gt; 0</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacity</mat-label>
          <mat-icon matPrefix>group</mat-icon>
          <input matInput type="number" formControlName="capacity" min="1" step="1" />
          @if (hasError('capacity', 'required')) {
            <mat-error>Capacity is required</mat-error>
          }
          @if (hasError('capacity', 'min')) {
            <mat-error>Must be ≥ 1</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Year Built</mat-label>
          <mat-icon matPrefix>calendar_today</mat-icon>
          <input matInput type="number" formControlName="yearBuilt" min="1800" [max]="currentYear" />
          @if (hasError('yearBuilt', 'required')) {
            <mat-error>Year is required</mat-error>
          }
          @if (hasError('yearBuilt', 'min')) {
            <mat-error>Must be ≥ 1800</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">
        <mat-icon>{{ isEdit ? 'save' : 'add' }}</mat-icon>
        {{ isEdit ? 'Save Changes' : 'Add Boat' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 1rem;
      min-width: 520px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        min-width: unset;
      }
    }

    .full-span {
      grid-column: 1 / -1;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-content {
      padding-top: 0.5rem !important;
    }
  `],
})
export class BoatFormDialogComponent {
  data: FormDialogData = inject(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<BoatFormDialogComponent>);
  private fb = inject(FormBuilder);

  readonly currentYear = new Date().getFullYear();
  readonly isEdit = !!this.data.boat;

  form = this.fb.nonNullable.group({
    name: [this.data.boat?.name ?? '', Validators.required],
    description: [this.data.boat?.description ?? '', Validators.required],
    ownerName: [this.data.boat?.ownerName ?? '', Validators.required],
    length: [this.data.boat?.length ?? null as number | null, [Validators.required, Validators.min(0.1)]],
    capacity: [this.data.boat?.capacity ?? null as number | null, [Validators.required, Validators.min(1)]],
    yearBuilt: [this.data.boat?.yearBuilt ?? null as number | null, [Validators.required, Validators.min(1800)]],
  });

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const result: CreateBoatRequest = {
      name: v.name,
      description: v.description,
      ownerName: v.ownerName,
      length: v.length!,
      capacity: v.capacity!,
      yearBuilt: v.yearBuilt!,
    };
    this.ref.close(result);
  }
}
