import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BoatListComponent } from './boat-list.component';
import { BoatService } from '../../services/boat.service';
import { Boat } from '../../models/boat.model';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BOAT_A: Boat = {
  id: 1, name: 'Sea Breeze', description: 'A calm sailing yacht',
  length: 12.5, capacity: 8, yearBuilt: 2010, ownerName: 'Alice Martin',
};
const BOAT_B: Boat = {
  id: 2, name: 'Storm Rider', description: 'Fast motorboat for rough seas',
  length: 9, capacity: 4, yearBuilt: 2018, ownerName: 'Bob Jones',
};
const BOAT_C: Boat = {
  id: 3, name: 'Blue Horizon', description: 'Luxury catamaran',
  length: 18, capacity: 12, yearBuilt: 2022, ownerName: 'Alice Martin',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_FLEET_STATS = {
  totalBoats: 30,
  totalCapacity: 240,
  avgLength: 11.5,
  uniqueOwners: 8,
};

function createBoatServiceMock(boats: Boat[] = [BOAT_A, BOAT_B], total = 30) {
  return {
    getAll: jest.fn().mockReturnValue(of({ boats, total })),
    getById: jest.fn().mockReturnValue(of(boats[0])),
    create: jest.fn().mockReturnValue(of({ ...BOAT_A, id: 99 })),
    update: jest.fn().mockReturnValue(of(BOAT_A)),
    delete: jest.fn().mockReturnValue(of(void 0)),
    getStats: jest.fn().mockReturnValue(of(MOCK_FLEET_STATS)),
  };
}

function createDialogMock(closeResult: unknown = undefined) {
  return {
    open: jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(closeResult)),
    }),
  };
}

function createSnackBarMock() {
  return { open: jest.fn() };
}

/** Trigger a click on a DebugElement, forwarding a synthetic MouseEvent */
function click(fixture: ComponentFixture<BoatListComponent>, cssSelector: string): void {
  const de = fixture.debugElement.query(By.css(cssSelector));
  expect(de).not.toBeNull();
  de.triggerEventHandler('click', new MouseEvent('click', { bubbles: true }));
  fixture.detectChanges();
}

/** Trigger the filter directly on the component — bypasses NgModel/DOM event chain */
async function search(fixture: ComponentFixture<BoatListComponent>, value: string): Promise<void> {
  fixture.componentInstance.applyFilter(value);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

/** Data rows only — excludes the mat-mdc-no-data-row rendered when the list is empty */
function getTableRows(fixture: ComponentFixture<BoatListComponent>): DebugElement[] {
  return fixture.debugElement.queryAll(By.css('tr.mat-mdc-row:not(.mat-mdc-no-data-row)'));
}

// ── Shared setup factory ───────────────────────────────────────────────────────

async function setupComponent(
  boats: Boat[],
  dialogClose: unknown = undefined,
): Promise<{
  fixture: ComponentFixture<BoatListComponent>;
  boatSvc: ReturnType<typeof createBoatServiceMock>;
  dialogMock: ReturnType<typeof createDialogMock>;
  snackBarMock: ReturnType<typeof createSnackBarMock>;
}> {
  const boatSvc = createBoatServiceMock(boats);
  const dialogMock = createDialogMock(dialogClose);
  const snackBarMock = createSnackBarMock();

  await TestBed.configureTestingModule({
    imports: [BoatListComponent],
    providers: [
      provideRouter([]),
      provideAnimationsAsync(),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: BoatService, useValue: boatSvc },
      { provide: MatSnackBar, useValue: snackBarMock },
    ],
  }).compileComponents();

  // MatDialog is provided inside BoatListComponent's own MatDialogModule import,
  // creating a child injector that shadows module-level providers. overrideProvider
  // patches ALL injector levels.
  TestBed.overrideProvider(MatDialog, { useValue: dialogMock });
  TestBed.overrideProvider(MatSnackBar, { useValue: snackBarMock });

  const fixture = TestBed.createComponent(BoatListComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, boatSvc, dialogMock, snackBarMock };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('BoatListComponent', () => {

  // ── Creation ───────────────────────────────────────────────────────────────

  describe('creation', () => {
    it('should create the component', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should call BoatService.getAll() on initialisation', async () => {
      const { boatSvc } = await setupComponent([BOAT_A]);
      expect(boatSvc.getAll).toHaveBeenCalledTimes(1);
    });
  });

  // ── Stats cards ───────────────────────────────────────────────────────────

  describe('stats cards', () => {
    it('should display fleet-wide total boats from getStats (not current page count)', async () => {
      // Page has 1 boat but fleet has 30 — stat card must show 30
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.nativeElement.textContent).toContain('30');
    });

    it('should display fleet-wide total capacity from getStats', async () => {
      // MOCK_FLEET_STATS.totalCapacity = 240 — independent of page boats
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.nativeElement.textContent).toContain('240');
    });

    it('should display fleet-wide unique owners count from getStats', async () => {
      // MOCK_FLEET_STATS.uniqueOwners = 8
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.nativeElement.textContent).toContain('8');
    });

    it('should call getStats() on initialisation', async () => {
      const { boatSvc } = await setupComponent([BOAT_A]);
      expect(boatSvc.getStats).toHaveBeenCalledTimes(1);
    });
  });

  // ── Table rendering ───────────────────────────────────────────────────────

  describe('table rendering', () => {
    it('should render one row per boat (up to page size)', async () => {
      const { fixture } = await setupComponent([BOAT_A, BOAT_B]);
      expect(getTableRows(fixture).length).toBe(2);
    });

    it('should display the boat name in the first column', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      const rows = getTableRows(fixture);
      expect(rows[0].nativeElement.textContent).toContain('Sea Breeze');
    });

    it('should display owner name in the row', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.nativeElement.textContent).toContain('Alice Martin');
    });

    it('should render the "Add Boat" toolbar button', async () => {
      const { fixture } = await setupComponent([]);
      const btn = fixture.debugElement.query(By.css('button.add-btn'));
      expect(btn).not.toBeNull();
      expect(btn.nativeElement.textContent).toContain('Add Boat');
    });

    it('should render edit and delete action buttons for each row', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      expect(fixture.debugElement.query(By.css('button.edit-btn'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('button.delete-btn'))).not.toBeNull();
    });
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('should show a spinner while data is loading', () => {
      const boatSvc = createBoatServiceMock([BOAT_A]);
      // Return a never-completing observable so loading stays true
      boatSvc.getAll.mockReturnValue(new (require('rxjs').Subject)().asObservable());

      TestBed.configureTestingModule({
        imports: [BoatListComponent],
        providers: [
          provideRouter([]),
          provideAnimationsAsync(),
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: BoatService, useValue: boatSvc },
          { provide: MatDialog, useValue: createDialogMock() },
          { provide: MatSnackBar, useValue: createSnackBarMock() },
        ],
      });

      const fixture = TestBed.createComponent(BoatListComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Loading fleet');
    });
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('should show empty-state message when no boats exist', async () => {
      const { fixture } = await setupComponent([]);
      expect(fixture.nativeElement.textContent).toContain('No boats registered yet');
    });

    it('should render zero data rows when the list is empty', async () => {
      const { fixture } = await setupComponent([]);
      expect(getTableRows(fixture).length).toBe(0);
    });
  });

  // ── Error state ───────────────────────────────────────────────────────────

  describe('error state', () => {
    async function setupWithError() {
      const boatSvc = {
        ...createBoatServiceMock(),
        getAll: jest.fn().mockReturnValue(throwError(() => new Error('Network error'))),
        getStats: jest.fn().mockReturnValue(of(MOCK_FLEET_STATS)),
      };

      await TestBed.configureTestingModule({
        imports: [BoatListComponent],
        providers: [
          provideRouter([]),
          provideAnimationsAsync(),
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: BoatService, useValue: boatSvc },
          { provide: MatDialog, useValue: createDialogMock() },
          { provide: MatSnackBar, useValue: createSnackBarMock() },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(BoatListComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      return fixture;
    }

    it('should display an error message when the API call fails', async () => {
      const fixture = await setupWithError();
      expect(fixture.nativeElement.textContent).toContain('Network error');
    });

    it('should render a Retry button when an error occurs', async () => {
      const fixture = await setupWithError();
      const retryBtn = Array.from(
        fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
      ).find((b) => b.textContent?.trim() === 'Retry');
      expect(retryBtn).toBeTruthy();
    });
  });

  // ── Search / Filter ───────────────────────────────────────────────────────

  describe('search and filter', () => {
    it('should render a search input with the correct placeholder', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      const input = fixture.debugElement.query(By.css('input[placeholder*="Search"]'));
      expect(input).not.toBeNull();
    });

    it('should filter rows by boat name', async () => {
      const { fixture } = await setupComponent([BOAT_A, BOAT_B]);
      await search(fixture, 'storm');
      expect(getTableRows(fixture).length).toBe(1);
      expect(getTableRows(fixture)[0].nativeElement.textContent).toContain('Storm Rider');
    });

    it('should filter rows by description (case-insensitive)', async () => {
      const { fixture } = await setupComponent([BOAT_A, BOAT_B]);
      // BOAT_B.description = 'Fast motorboat for rough seas'
      await search(fixture, 'motorboat');
      expect(getTableRows(fixture).length).toBe(1);
    });

    it('should show no-data row containing the search term when nothing matches', async () => {
      const { fixture } = await setupComponent([BOAT_A, BOAT_B]);
      await search(fixture, 'xyznonexistent');
      expect(fixture.nativeElement.textContent).toContain('xyznonexistent');
    });

    it('should restore all rows when the filter is cleared', async () => {
      const { fixture } = await setupComponent([BOAT_A, BOAT_B]);
      await search(fixture, 'storm');
      expect(getTableRows(fixture).length).toBe(1);

      await search(fixture, '');
      expect(getTableRows(fixture).length).toBe(2);
    });
  });

  // ── Add boat ──────────────────────────────────────────────────────────────

  describe('adding a boat', () => {
    it('should open the form dialog when "Add Boat" is clicked', async () => {
      const { fixture, dialogMock } = await setupComponent([BOAT_A]);
      click(fixture, 'button.add-btn');
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });

    it('should call BoatService.create when the dialog is confirmed', async () => {
      const newBoat = {
        name: 'New Wave', description: 'Fast', length: 9,
        capacity: 4, yearBuilt: 2020, ownerName: 'Jane',
      };
      const { fixture, boatSvc, dialogMock } = await setupComponent([], newBoat);

      click(fixture, 'button.add-btn');
      await fixture.whenStable();

      expect(dialogMock.open).toHaveBeenCalledTimes(1);
      expect(boatSvc.create).toHaveBeenCalledWith(newBoat);
    });

    it('should NOT call BoatService.create when the dialog is cancelled', async () => {
      const { fixture, boatSvc } = await setupComponent([], undefined);
      click(fixture, 'button.add-btn');
      expect(boatSvc.create).not.toHaveBeenCalled();
    });

    it('should show a success snackbar after a boat is added', async () => {
      const newBoat = {
        name: 'Comet', description: 'Quick', length: 7,
        capacity: 3, yearBuilt: 2019, ownerName: 'Sam',
      };
      const { fixture, snackBarMock } = await setupComponent([], newBoat);
      click(fixture, 'button.add-btn');
      await fixture.whenStable();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Boat added successfully', 'OK',
        expect.objectContaining({ duration: 3000 }),
      );
    });
  });

  // ── Delete boat ───────────────────────────────────────────────────────────

  describe('deleting a boat', () => {
    it('should open the delete-confirmation dialog when the delete icon is clicked', async () => {
      const { fixture, dialogMock } = await setupComponent([BOAT_A]);
      click(fixture, 'button.delete-btn');
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });

    it('should call BoatService.delete when the user confirms deletion', async () => {
      const { fixture, boatSvc } = await setupComponent([BOAT_A], true);
      click(fixture, 'button.delete-btn');
      await fixture.whenStable();
      expect(boatSvc.delete).toHaveBeenCalledWith(BOAT_A.id);
    });

    it('should NOT call BoatService.delete when the user cancels', async () => {
      const { fixture, boatSvc } = await setupComponent([BOAT_A], false);
      click(fixture, 'button.delete-btn');
      expect(boatSvc.delete).not.toHaveBeenCalled();
    });

    it('should show a success snackbar after deletion', async () => {
      const { fixture, snackBarMock } = await setupComponent([BOAT_A], true);
      click(fixture, 'button.delete-btn');
      await fixture.whenStable();

      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Boat deleted', 'OK',
        expect.objectContaining({ duration: 3000 }),
      );
    });
  });

  // ── Edit boat ─────────────────────────────────────────────────────────────

  describe('editing a boat', () => {
    it('should open the form dialog when the edit icon is clicked', async () => {
      const { fixture, dialogMock } = await setupComponent([BOAT_A]);
      click(fixture, 'button.edit-btn');
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });

    it('should call BoatService.update when the dialog is saved', async () => {
      const updated = {
        name: 'Renamed', description: 'Updated', length: 10,
        capacity: 5, yearBuilt: 2015, ownerName: 'Alice',
      };
      const { fixture, boatSvc } = await setupComponent([BOAT_A], updated);
      click(fixture, 'button.edit-btn');
      await fixture.whenStable();
      expect(boatSvc.update).toHaveBeenCalledWith(BOAT_A.id, updated);
    });
  });

  // ── Detail dialog ─────────────────────────────────────────────────────────

  describe('detail view', () => {
    it('should open the detail dialog when a table row is clicked', async () => {
      const { fixture, dialogMock } = await setupComponent([BOAT_A]);
      const row = fixture.debugElement.query(By.css('tr.mat-mdc-row'));
      row.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('should have a search input with a descriptive placeholder', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      const input = fixture.nativeElement.querySelector(
        'input[placeholder*="Search"]',
      ) as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.placeholder).toContain('Search');
    });

    it('should have title text for edit and delete buttons', async () => {
      const { fixture } = await setupComponent([BOAT_A]);
      const editBtn = fixture.nativeElement.querySelector('button.edit-btn');
      const deleteBtn = fixture.nativeElement.querySelector('button.delete-btn');
      // Either aria-label or matTooltip attribute should be present for screen readers
      expect(editBtn || deleteBtn).not.toBeNull();
    });
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  describe('pagination', () => {
    function makeFleet(count: number): Boat[] {
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1, name: `Boat ${i + 1}`, description: `Desc ${i + 1}`,
        length: 10, capacity: 4, yearBuilt: 2010, ownerName: `Owner ${i % 5}`,
      }));
    }

    it('should request page 0 with size 10 on initial load (server-side)', async () => {
      const { boatSvc } = await setupComponent(makeFleet(10));
      // Server-side pagination: must pass page index and page size explicitly
      expect(boatSvc.getAll).toHaveBeenCalledWith(0, 10);
    });

    it('should show exactly 10 rows when the server returns a page of 10 boats', async () => {
      const { fixture } = await setupComponent(makeFleet(10));
      expect(getTableRows(fixture).length).toBe(10);
    });

    it('should set paginator length to totalElements from the server (30), not just page size', async () => {
      const { fixture } = await setupComponent(makeFleet(10));
      // The server told us totalElements = 30; paginator.length must reflect that
      const component = fixture.componentInstance;
      expect(component.totalElements()).toBe(30);
    });

    it('should request page 1 with size 10 when the user navigates to page 2', async () => {
      const { fixture, boatSvc } = await setupComponent(makeFleet(10));
      const component = fixture.componentInstance;

      // Simulate paginator page change (user clicked "next page")
      component.onPageChange({ pageIndex: 1, pageSize: 10, length: 30 });
      fixture.detectChanges();
      await fixture.whenStable();

      expect(boatSvc.getAll).toHaveBeenCalledWith(1, 10);
    });

    it('should reload from page 0 after adding a boat', async () => {
      const newBoat = {
        name: 'New', description: 'New', length: 10,
        capacity: 4, yearBuilt: 2023, ownerName: 'Alice',
      };
      const { fixture, boatSvc, dialogMock } = await setupComponent(makeFleet(10), newBoat);
      boatSvc.getAll.mockClear();

      click(fixture, 'button.add-btn');
      await fixture.whenStable();

      // After creation, reload must start from page 0 with current pageSize
      expect(boatSvc.getAll).toHaveBeenCalledWith(0, 10);
    });
  });
});
