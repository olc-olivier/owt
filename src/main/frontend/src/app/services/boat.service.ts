import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Boat, BoatPageResponse, CreateBoatRequest, UpdateBoatRequest } from '../models/boat.model';

/**
 * Data-access service for the `/api/boats` REST endpoint.
 *
 * All methods return cold `Observable`s — subscribe (or use the `async` pipe)
 * to trigger the HTTP request. The server uses Spring Data REST with HAL
 * paging, so list results are unwrapped from `_embedded.boatResponseList`
 * transparently.
 *
 * @example
 * ```typescript
 * const boatService = inject(BoatService);
 *
 * boatService.getAll().subscribe(boats => console.log(boats));
 * boatService.create({ name: 'Sea Breeze', ... }).subscribe(boat => ...);
 * ```
 *
 * @category Services
 */
@Injectable({ providedIn: 'root' })
export class BoatService {
  private http = inject(HttpClient);
  private readonly base = '/api/boats';

  /**
   * Fetches a flat list of boats from the server.
   *
   * The HAL paging envelope is unwrapped automatically; an empty array is
   * returned when there are no results.
   *
   * @param page - Zero-based page number (default `0`).
   * @param size - Maximum number of items to return (default `200`).
   * @returns Observable of the boat array for the requested page.
   */
  getAll(page = 0, size = 200): Observable<Boat[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<BoatPageResponse>(this.base, { params }).pipe(
      map(r => r._embedded?.boatResponseList ?? [])
    );
  }

  /**
   * Fetches a single boat by its unique identifier.
   *
   * @param id - The boat's numeric ID.
   * @returns Observable that emits the matching {@link Boat}.
   */
  getById(id: number): Observable<Boat> {
    return this.http.get<Boat>(`${this.base}/${id}`);
  }

  /**
   * Creates a new boat record on the server.
   *
   * @param body - The boat data to persist. See {@link CreateBoatRequest}.
   * @returns Observable that emits the newly created {@link Boat} (with server-assigned `id`).
   */
  create(body: CreateBoatRequest): Observable<Boat> {
    return this.http.post<Boat>(this.base, body);
  }

  /**
   * Replaces an existing boat record with the provided data.
   *
   * @param id - ID of the boat to update.
   * @param body - Fields to update. Only provided keys are sent. See {@link UpdateBoatRequest}.
   * @returns Observable that emits the updated {@link Boat}.
   */
  update(id: number, body: UpdateBoatRequest): Observable<Boat> {
    return this.http.put<Boat>(`${this.base}/${id}`, body);
  }

  /**
   * Permanently deletes a boat from the server.
   *
   * @param id - ID of the boat to delete.
   * @returns Observable that completes with no value on success.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
