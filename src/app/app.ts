import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { RolesService } from './services/roles.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  authService = inject(AuthService);
  rolesService = inject(RolesService);
  private router = inject(Router);

  ngOnInit(): void {
    // Si hay usuario logueado, cargamos los roles para resolver el nombre en la barra
    if (this.authService.usuarioActual()) {
      this.rolesService.listar().subscribe();
    }
  }

  obtenerRol(rolId?: number | null): string {
    return this.rolesService.obtenerRolNombre(rolId);
  }

onLogout(): void {
  this.authService.logout().subscribe({
    next: () => this.router.navigate(['/login']),
    error: () => this.router.navigate(['/login'])
  });
}
}