import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Zoo, ZooCreate } from "./zoo.model";

@Injectable({ providedIn: 'root' })
export class ZooService {

    private http = inject(HttpClient);
    private base = 'http://localhost:3000/api/zoos';

    getAll(): Observable<Zoo[]> {
        return this.http.get<Zoo[]>(this.base);
    }
    getById(id: number): Observable<Zoo> {
        return this.http.get<Zoo>(`${this.base}/${id}`);
    }
    create(data: ZooCreate): Observable<any> {
        return this.http.post<any>(this.base, data);
    }
    update(id: number, data: ZooCreate): Observable<any> {
        return this.http.put(`${this.base}/${id}`, data);
    }
    delete(id: number): Observable<any> {
        return this.http.delete(`${this.base}/${id}`);
    }
}