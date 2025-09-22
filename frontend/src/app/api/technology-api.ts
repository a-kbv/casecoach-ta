import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTechnologyRequest, Technology, UpdateTechnologyRequest } from '../models/technology';


@Injectable({
  providedIn: 'root'
})
export class TechnologyApi {
  private apiUrl = 'http://localhost:3000/api/technologies';

  constructor(private http: HttpClient){}

  getAllTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>(this.apiUrl);
  }

  getTechnologyById(id: string): Observable<Technology> {
    return this.http.get<Technology>(`${this.apiUrl}/${id}`);
  }

  createTechnology(technology: CreateTechnologyRequest): Observable<Technology> {
    return this.http.post<Technology>(this.apiUrl, technology);
  }

  putTechnology(id: string, technology: UpdateTechnologyRequest): Observable<Technology> {
    return this.http.put<Technology>(`${this.apiUrl}/${id}`, technology);
  }

  patchTechnology(id: string, technology: UpdateTechnologyRequest): Observable<Technology> {
    return this.http.patch<Technology>(`${this.apiUrl}/${id}`, technology);
  }

  deleteTechnology(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
