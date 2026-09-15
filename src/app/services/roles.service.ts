import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Rol, CrearRolRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/roles';

  listaRoles = signal<Rol[]>([]);

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl).pipe(
      tap(roles => this.listaRoles.set(roles))
    );
  }

  // Función reutilizable en cualquier parte de la app
  obtenerRolNombre(rolId?: number | null): string {
    if (!rolId) return 'Sin rol';
    const rol = this.listaRoles().find(r => r.id === rolId);
    return rol ? rol.nombre : 'Rol desconocido';
  }

  crear(rol: CrearRolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol);
  }
}