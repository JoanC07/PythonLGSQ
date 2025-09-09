import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especie, EspecieCreate } from './especie.model';

@Injectable({ providedIn: 'root' })
export class EspecieService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/especies';

  getAll(): Observable<Especie[]> { return this.http.get<Especie[]>(this.base); }
  getById(id: number): Observable<Especie> { return this.http.get<Especie>(`${this.base}/${id}`); }
  create(data: EspecieCreate): Observable<any> { return this.http.post(this.base, data); }
  update(id: number, data: EspecieCreate): Observable<any> { return this.http.put(`${this.base}/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.base}/${id}`); }
}
