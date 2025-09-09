import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Estudiante, EstudianteCreate } from "./estudiante.model";

@Injectable({ providedIn: 'root' })
export class EstudianteService {

    private http = inject(HttpClient);
    private base = 'http://localhost:3000/api/estudiantes';

    getAll(): Observable<Estudiante[]> {
        return this.http.get<Estudiante[]>(this.base);
    }
    getById(id: number): Observable<Estudiante> {
        return this.http.get<Estudiante>(`${this.base}/${id}`);
    }
    create(data: EstudianteCreate): Observable<any> {
        return this.http.post<any>(this.base, data);
    }
    update(id: number, data: EstudianteCreate): Observable<any> {
        return this.http.put(`${this.base}/${id}`, data);
    }
    delete(id: number): Observable<any> {
        return this.http.delete(`${this.base}/${id}`);
    }
}