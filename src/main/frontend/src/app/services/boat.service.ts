import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Boat, BoatPageResponse, CreateBoatRequest, UpdateBoatRequest } from '../models/boat.model';

@Injectable({ providedIn: 'root' })
export class BoatService {
  private http = inject(HttpClient);
  private readonly base = '/api/boats';

  getAll(page = 0, size = 200): Observable<Boat[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<BoatPageResponse>(this.base, { params }).pipe(
      map(r => r._embedded?.boatResponseList ?? [])
    );
  }

  getById(id: number): Observable<Boat> {
    return this.http.get<Boat>(`${this.base}/${id}`);
  }

  create(body: CreateBoatRequest): Observable<Boat> {
    return this.http.post<Boat>(this.base, body);
  }

  update(id: number, body: UpdateBoatRequest): Observable<Boat> {
    return this.http.put<Boat>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
