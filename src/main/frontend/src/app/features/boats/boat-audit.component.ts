import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BoatRevision } from '../../models/audit.model';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-boat-audit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>history</mat-icon>
      Revision History
    </h2>

    <mat-dialog-content>
      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="36" />
          <span>Loading history…</span>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error() }}</span>
        </div>
      } @else if (revisions().length === 0) {
        <div class="empty-state">
          <mat-icon>history_toggle_off</mat-icon>
          <span>No revision history found.</span>
        </div>
      } @else {
        <table mat-table [dataSource]="revisions()" class="history-table">

          <ng-container matColumnDef="rev">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let row">{{ row.revisionNumber }}</td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let row">
              {{ row.revisionDate | date:'medium' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let row">
              <span class="type-badge" [class]="'type-' + row.revisionType.toLowerCase()">
                {{ row.revisionType }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row">{{ row.boat?.name ?? '–' }}</td>
          </ng-container>

          <ng-container matColumnDef="owner">
            <th mat-header-cell *matHeaderCellDef>Owner</th>
            <td mat-cell *matCellDef="let row">{{ row.boat?.ownerName ?? '–' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      mat-icon { color: #696cff; }
    }

    mat-dialog-content {
      min-width: 520px;
      max-width: 720px;
      padding-top: 0.5rem;
    }

    .loading-state, .error-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2.5rem;
      color: #888;
      font-size: 0.95rem;

      mat-icon { font-size: 2rem; width: 2rem; height: 2rem; }
    }

    .error-state { color: #d32f2f; }

    .history-table {
      width: 100%;

      th.mat-header-cell {
        font-weight: 600;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #888;
      }

      td.mat-cell { padding: 0.6rem 1rem; font-size: 0.88rem; }
    }

    .type-badge {
      display: inline-block;
      padding: 0.15rem 0.55rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .type-add { background: #e8f5e9; color: #2e7d32; }
    .type-mod { background: #e3f2fd; color: #1565c0; }
    .type-del { background: #ffebee; color: #c62828; }
  `],
})
export class BoatAuditComponent implements OnInit {
  private auditService = inject(AuditService);
  private dialogRef = inject(MatDialogRef<BoatAuditComponent>);
  private data = inject<{ boatId: number }>(MAT_DIALOG_DATA);

  revisions = signal<BoatRevision[]>([]);
  loading = signal(true);
  error = signal('');

  readonly columns = ['rev', 'date', 'type', 'name', 'owner'];

  ngOnInit(): void {
    this.auditService.getBoatHistory(this.data.boatId).subscribe({
      next: (data) => {
        this.revisions.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
