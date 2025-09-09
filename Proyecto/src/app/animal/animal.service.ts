import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";  
import { Observable } from "rxjs";
import { Animal, AnimalCreate } from "./animal.model";


@Injectable({ providedIn: 'root' })
export class AnimalService {

    private http = inject(HttpClient);
    private base = 'http://localhost:3000/api/animales';

    getAll(): Observable<Animal[]> {
        return this.http.get<Animal[]>(this.base);
    }
    getById(id: number): Observable<Animal> {
        return this.http.get<Animal>(`${this.base}/${id}`);
    }
    create(data: AnimalCreate): Observable<any> {
        return this.http.post<any>(this.base, data);
    }
    update(id: number, data: AnimalCreate): Observable<any> {
        return this.http.put(`${this.base}/${id}`, data);
    }
    delete(id: number): Observable<any> {
        return this.http.delete(`${this.base}/${id}`);
    }
}