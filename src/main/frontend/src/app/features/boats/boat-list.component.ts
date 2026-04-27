import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { Boat, CreateBoatRequest } from '../../models/boat.model';
import { BoatService } from '../../services/boat.service';
import { BoatDeleteDialogComponent } from './boat-delete-dialog.component';
import {
  BoatDetailDialogComponent,
  DetailDialogResult,
} from './boat-detail-dialog.component';
import {
  BoatFormDialogComponent,
} from './boat-form-dialog.component';

@Component({
  selector: 'app-boat-list',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
  ],
  template: `
    <div class="page">
      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>directions_boat</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ boats().length }}</div>
            <div class="stat-label">Total Boats</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>group</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ totalCapacity() }}</div>
            <div class="stat-label">Total Capacity</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal">
            <mat-icon>straighten</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ avgLength() | number:'1.1-1' }} m</div>
            <div class="stat-label">Avg. Length</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>person</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ uniqueOwners() }}</div>
            <div class="stat-label">Unique Owners</div>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <!-- Toolbar -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h3 class="table-title">
              <mat-icon>directions_boat</mat-icon>
              Fleet Registry
            </h3>
            @if (filterValue) {
              <mat-chip-set>
                <mat-chip (removed)="clearFilter()">
                  "{{ filterValue }}"
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              </mat-chip-set>
            }
          </div>
          <div class="toolbar-right">
            <mat-form-field appearance="outline" class="search-field" subscriptSizing="dynamic">
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                [(ngModel)]="filterValue"
                (ngModelChange)="applyFilter($event)"
                placeholder="Search by name or description…"
              />
              @if (filterValue) {
                <button matSuffix mat-icon-button (click)="clearFilter()">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </mat-form-field>
            <button mat-flat-button color="primary" class="add-btn" (click)="openAdd()">
              <mat-icon>add</mat-icon>
              Add Boat
            </button>
          </div>
        </div>

        <!-- Loading -->
        @if (loading()) {
          <div class="loading-state">
            <mat-spinner diameter="40" />
            <span>Loading fleet…</span>
          </div>
        }

        <!-- Error -->
        @if (error()) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <span>{{ error() }}</span>
            <button mat-stroked-button (click)="load()">Retry</button>
          </div>
        }

        <!-- Table -->
        @if (!loading() && !error()) {
          <div class="table-wrap">
            <table mat-table [dataSource]="dataSource" matSort class="boats-table">

              <!-- Name -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let row">
                  <div class="boat-cell">
                    <div class="boat-icon-wrap">
                      <mat-icon>directions_boat</mat-icon>
                    </div>
                    <div>
                      <div class="boat-name">{{ row.name }}</div>
                      <div class="boat-id">#{{ row.id }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Description -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
                <td mat-cell *matCellDef="let row">
                  <span class="description-cell" [matTooltip]="row.description">
                    {{ row.description }}
                  </span>
                </td>
              </ng-container>

              <!-- Length -->
              <ng-container matColumnDef="length">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Length</th>
                <td mat-cell *matCellDef="let row">
                  <span class="badge badge-blue">{{ row.length }} m</span>
                </td>
              </ng-container>

              <!-- Capacity -->
              <ng-container matColumnDef="capacity">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Capacity</th>
                <td mat-cell *matCellDef="let row">
                  <span class="badge badge-purple">
                    <mat-icon>group</mat-icon>
                    {{ row.capacity }}
                  </span>
                </td>
              </ng-container>

              <!-- Year -->
              <ng-container matColumnDef="yearBuilt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Year</th>
                <td mat-cell *matCellDef="let row">{{ row.yearBuilt }}</td>
              </ng-container>

              <!-- Owner -->
              <ng-container matColumnDef="ownerName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Owner</th>
                <td mat-cell *matCellDef="let row">
                  <div class="owner-cell">
                    <div class="owner-avatar">{{ row.ownerName[0] }}</div>
                    <span>{{ row.ownerName }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="actions-header">Actions</th>
                <td mat-cell *matCellDef="let row" class="actions-cell">
                  <button
                    mat-icon-button
                    class="action-btn edit-btn"
                    matTooltip="Edit"
                    (click)="openEdit(row, $event)"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    class="action-btn delete-btn"
                    matTooltip="Delete"
                    (click)="openDelete(row, $event)"
                  >
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
              <tr
                mat-row
                *matRowDef="let row; columns: columns"
                class="table-row"
                (click)="openDetail(row)"
                matTooltip="Click to view details"
                matTooltipShowDelay="600"
              ></tr>

              <tr class="mat-row" *matNoDataRow>
                <td [attr.colspan]="columns.length" class="no-data">
                  @if (filterValue) {
                    <mat-icon>search_off</mat-icon>
                    No boats match "{{ filterValue }}"
                  } @else {
                    <mat-icon>directions_boat</mat-icon>
                    No boats registered yet
                  }
                </td>
              </tr>
            </table>
          </div>

          <mat-paginator
            [pageSizeOptions]="[10, 25, 50]"
            pageSize="10"
            showFirstLastButtons
          />
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* ── Stats ── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;

      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      background: var(--mat-card-background-color, #fff);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.25rem;
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      &.blue   { background: #e8f4ff; mat-icon { color: #2196f3; } }
      &.purple { background: #f3e8ff; mat-icon { color: #9155fd; } }
      &.teal   { background: #e8fff8; mat-icon { color: #00bfa5; } }
      &.orange { background: #fff3e8; mat-icon { color: #ff9800; } }
    }

    /* ── Table Card ── */
    .table-card {
      background: var(--mat-card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .table-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;

      mat-icon {
        color: #696cff;
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .search-field {
      width: 280px;

      @media (max-width: 600px) {
        width: 100%;
      }
    }

    .add-btn {
      border-radius: 8px;
      height: 40px;
      white-space: nowrap;
    }

    /* ── States ── */
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 3rem;
      color: #888;
      font-size: 0.95rem;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }

    .error-state {
      color: #d32f2f;
    }

    /* ── Table ── */
    .table-wrap {
      overflow-x: auto;
    }

    .boats-table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      white-space: nowrap;
      padding: 0 1rem;
    }

    td.mat-cell {
      padding: 0.75rem 1rem;
    }

    .table-row {
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: rgba(105, 108, 255, 0.04);
      }
    }

    /* ── Cell styles ── */
    .boat-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .boat-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: rgba(105, 108, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        color: #696cff;
        font-size: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
      }
    }

    .boat-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .boat-id {
      font-size: 0.75rem;
      color: #aaa;
    }

    .description-cell {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 0.85rem;
      color: #666;
      max-width: 220px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;

      mat-icon {
        font-size: 0.9rem;
        width: 0.9rem;
        height: 0.9rem;
      }

      &.badge-blue   { background: #e8f4ff; color: #1565c0; }
      &.badge-purple { background: #f3e8ff; color: #6a1b9a; }
    }

    .owner-cell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.9rem;
    }

    .owner-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #696cff, #9155fd);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .actions-header {
      text-align: right;
    }

    .actions-cell {
      text-align: right;
      white-space: nowrap;
    }

    .action-btn {
      width: 34px;
      height: 34px;
      mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    }

    .edit-btn   { color: #696cff; }
    .delete-btn { color: #d32f2f; }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #aaa;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.95rem;

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    mat-paginator {
      border-top: 1px solid var(--mat-divider-color, rgba(0,0,0,0.08));
    }
  `],
})
/**
 * Main page for browsing and managing the boat fleet.
 *
 * Selector: `app-boat-list`
 *
 * Displays a stats summary row (total boats, total capacity, average length,
 * unique owners) followed by a sortable, paginated Material table.  Rows can
 * be searched by name or description in real time.
 *
 * **CRUD operations** are handled through three dialogs:
 * - {@link BoatFormDialogComponent} – create and edit.
 * - {@link BoatDetailDialogComponent} – view detail with inline edit option.
 * - {@link BoatDeleteDialogComponent} – delete confirmation.
 *
 * @category Components
 */
export class BoatListComponent implements OnInit, AfterViewInit {
  private boatService = inject(BoatService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Full list of boats returned by the last successful API call. */
  boats = signal<Boat[]>([]);
  /** `true` while the initial load or a reload is in progress. */
  loading = signal(true);
  /** Non-empty string when the API call failed. */
  error = signal('');
  /** Current text entered in the search field, kept in sync by {@link applyFilter}. */
  filterValue = '';

  /** `MatTableDataSource` driving the Material table — supports sort, paginator, and filter. */
  dataSource = new MatTableDataSource<Boat>([]);
  /** Ordered list of column keys rendered by the table. */
  readonly columns = ['name', 'description', 'length', 'capacity', 'yearBuilt', 'ownerName', 'actions'];

  /** Sum of all boat capacities. Recomputed reactively when {@link boats} changes. */
  totalCapacity = computed(() => this.boats().reduce((s, b) => s + b.capacity, 0));
  /** Average length in metres across all boats. Returns `0` when the list is empty. */
  avgLength = computed(() => {
    const b = this.boats();
    return b.length ? b.reduce((s, x) => s + x.length, 0) / b.length : 0;
  });
  /** Number of distinct owner names in the fleet. */
  uniqueOwners = computed(() => new Set(this.boats().map(b => b.ownerName)).size);

  /** Triggers the initial data load. */
  ngOnInit(): void {
    this.load();
  }

  /** Wires the sort and paginator into the data source and configures the filter predicate. */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (row, filter) => {
      const f = filter.toLowerCase();
      return row.name.toLowerCase().includes(f) || row.description.toLowerCase().includes(f);
    };
  }

  /**
   * Fetches all boats from the server and refreshes the table and stats signals.
   * Resets the loading and error states before each request.
   */
  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.boatService.getAll().subscribe({
      next: (data) => {
        this.boats.set(data);
        this.dataSource.data = data;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load boats. Is the server running?');
        this.loading.set(false);
      },
    });
  }

  /**
   * Filters the table rows by the provided search string.
   * Matches against both `name` and `description` (case-insensitive).
   *
   * @param value - The search string typed by the user.
   */
  applyFilter(value: string): void {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  /** Clears the active search filter and shows all rows. */
  clearFilter(): void {
    this.filterValue = '';
    this.applyFilter('');
  }

  /** Opens the {@link BoatFormDialogComponent} in create mode. */
  openAdd(): void {
    const ref = this.dialog.open(BoatFormDialogComponent, {
      data: {},
      width: '600px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result: CreateBoatRequest | undefined) => {
      if (!result) return;
      this.boatService.create(result).subscribe({
        next: () => { this.load(); this.notify('Boat added successfully'); },
        error: () => this.notify('Failed to add boat', true),
      });
    });
  }

  /**
   * Opens the {@link BoatFormDialogComponent} pre-filled with the given boat's data.
   *
   * @param boat - The boat to edit.
   * @param event - The originating DOM event; propagation is stopped to avoid
   *   triggering the row's `(click)` handler.
   */
  openEdit(boat: Boat, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(BoatFormDialogComponent, {
      data: { boat },
      width: '600px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result: CreateBoatRequest | undefined) => {
      if (!result) return;
      this.boatService.update(boat.id, result).subscribe({
        next: () => { this.load(); this.notify('Boat updated successfully'); },
        error: () => this.notify('Failed to update boat', true),
      });
    });
  }

  /**
   * Opens the {@link BoatDeleteDialogComponent} for the given boat.
   *
   * @param boat - The boat to delete.
   * @param event - The originating DOM event; propagation is stopped to avoid
   *   triggering the row's `(click)` handler.
   */
  openDelete(boat: Boat, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(BoatDeleteDialogComponent, {
      data: { boat },
      width: '400px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.boatService.delete(boat.id).subscribe({
        next: () => { this.load(); this.notify('Boat deleted'); },
        error: () => this.notify('Failed to delete boat', true),
      });
    });
  }

  /**
   * Opens the {@link BoatDetailDialogComponent} for the given boat.
   * If the dialog closes with an edit or delete action, the corresponding
   * operation is executed immediately.
   *
   * @param boat - The boat whose details to display.
   */
  openDetail(boat: Boat): void {
    const ref = this.dialog.open(BoatDetailDialogComponent, {
      data: { boat },
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'detail-dialog',
    });
    ref.afterClosed().subscribe((result: DetailDialogResult | undefined) => {
      if (!result) return;
      if (result.action === 'delete') {
        this.openDelete(boat, new MouseEvent('click'));
      } else if (result.action === 'edit' && result.data) {
        this.boatService.update(boat.id, result.data).subscribe({
          next: () => { this.load(); this.notify('Boat updated successfully'); },
          error: () => this.notify('Failed to update boat', true),
        });
      }
    });
  }

  /**
   * Displays a brief snack-bar notification to the user.
   *
   * @param msg - The message to display.
   * @param isError - When `true` applies error styling; defaults to `false`.
   */
  private notify(msg: string, isError = false): void {
    this.snackBar.open(msg, 'OK', {
      duration: 3000,
      panelClass: isError ? 'snack-error' : 'snack-success',
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
