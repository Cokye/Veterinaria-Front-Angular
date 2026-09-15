import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, CrearAnimalesRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AnimalesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/animales';

  listar(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl);
  }

  crear(animal: CrearAnimalesRequest): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal);
  }
}