import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BoatService } from './boat.service';
import { Boat, BoatPageResponse, CreateBoatRequest } from '../models/boat.model';

const MOCK_BOAT: Boat = {
  id: 1,
  name: 'Sea Breeze',
  description: 'A beautiful yacht',
  length: 12.5,
  capacity: 8,
  yearBuilt: 2010,
  ownerName: 'John Doe',
};

const MOCK_PAGE: BoatPageResponse = {
  _embedded: { boatResponseList: [MOCK_BOAT] },
  page: { size: 200, totalElements: 1, totalPages: 1, number: 0 },
};

describe('BoatService', () => {
  let service: BoatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BoatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should GET /api/boats with default pagination and return boats + total', () => {
      let result: { boats: Boat[]; total: number } | undefined;

      service.getAll().subscribe(r => (result = r));

      const req = httpMock.expectOne(r => r.url === '/api/boats');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      req.flush(MOCK_PAGE);

      expect(result).toEqual({ boats: [MOCK_BOAT], total: 1 });
    });

    it('should return empty boats and total 0 when _embedded is absent', () => {
      let result: { boats: Boat[]; total: number } | undefined;

      service.getAll().subscribe(r => (result = r));

      httpMock.expectOne(r => r.url === '/api/boats').flush({
        page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
      } as BoatPageResponse);

      expect(result).toEqual({ boats: [], total: 0 });
    });

    it('should pass custom page and size parameters', () => {
      service.getAll(2, 50).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/boats');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('size')).toBe('50');
      req.flush(MOCK_PAGE);
    });
  });

  describe('getById()', () => {
    it('should GET /api/boats/:id and return a single boat', () => {
      let result: Boat | undefined;

      service.getById(1).subscribe(boat => (result = boat));

      const req = httpMock.expectOne('/api/boats/1');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_BOAT);

      expect(result).toEqual(MOCK_BOAT);
    });
  });

  describe('create()', () => {
    it('should POST /api/boats with the request body and return the created boat', () => {
      const body: CreateBoatRequest = {
        name: 'New Wave',
        description: 'Speedy motor boat',
        length: 9,
        capacity: 4,
        yearBuilt: 2020,
        ownerName: 'Jane Smith',
      };
      let result: Boat | undefined;

      service.create(body).subscribe(boat => (result = boat));

      const req = httpMock.expectOne('/api/boats');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush({ ...body, id: 42 });

      expect(result?.id).toBe(42);
      expect(result?.name).toBe('New Wave');
    });
  });

  describe('update()', () => {
    it('should PUT /api/boats/:id with the update body and return the updated boat', () => {
      const patch = { name: 'Renamed' };
      let result: Boat | undefined;

      service.update(1, patch).subscribe(boat => (result = boat));

      const req = httpMock.expectOne('/api/boats/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(patch);
      req.flush({ ...MOCK_BOAT, ...patch });

      expect(result?.name).toBe('Renamed');
    });
  });

  describe('delete()', () => {
    it('should DELETE /api/boats/:id and complete without a body', () => {
      let completed = false;

      service.delete(1).subscribe({ complete: () => (completed = true) });

      const req = httpMock.expectOne('/api/boats/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });

      expect(completed).toBe(true);
    });
  });
});
