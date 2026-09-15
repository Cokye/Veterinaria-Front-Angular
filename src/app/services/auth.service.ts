import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  usuarioActual = signal<LoginResponse | null>(this.obtenerSesionGuardada());

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales, {
      withCredentials: true
    }).pipe(
      tap((res) => {
        if (res.exito) {
          localStorage.setItem('auth_user', JSON.stringify(res));
          this.usuarioActual.set(res);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap({
        next: () => this.limpiarSesion(),
        error: () => this.limpiarSesion() // Limpia la interfaz aunque el backend falle
      }),
      catchError(() => of(null)) // Evita propagar el error al componente
    );
  }

  limpiarSesion(): void {
    localStorage.removeItem('auth_user');
    this.usuarioActual.set(null);
  }

  private obtenerSesionGuardada(): LoginResponse | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  }
}