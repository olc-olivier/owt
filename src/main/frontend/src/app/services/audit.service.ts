import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoatRevision } from '../models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);

  getBoatHistory(id: number): Observable<BoatRevision[]> {
    return this.http.get<BoatRevision[]>(`/api/audit/boats/${id}/history`, {
      withCredentials: true,
    });
  }
}
