import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalesService } from '../../services/animales.service';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../services/auth.service';
import { Animal, Usuario, Rol } from '../../models/api.models';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css'
})
export class MascotasComponent implements OnInit {
  private authService = inject(AuthService);
  private animalesService = inject(AnimalesService);
  private usuarioService = inject(UsuariosService);
  private rolesService = inject(RolesService);

  listaAnimales = signal<Animal[]>([]);
  listaUsuarios = signal<Usuario[]>([]);
  listaRoles = signal<Rol[]>([]);

  misAnimales = computed(() => {
    const usuarioLogueadoId = this.authService.usuarioActual()?.id;
    if (!usuarioLogueadoId) return [];
    return this.listaAnimales().filter(a => a.usuario_id === usuarioLogueadoId);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.animalesService.listar().subscribe({
      next: (datos) => this.listaAnimales.set(datos),
      error: (err) => console.error('Error al listar animales:', err)
    });

    this.usuarioService.listar().subscribe({
      next: (usuarios) => this.listaUsuarios.set(usuarios),
      error: (err) => console.error('Error al listar usuarios:', err)
    });

    this.rolesService.listar().subscribe({
      next: (roles) => this.listaRoles.set(roles),
      error: (err) => console.error('Error al listar roles:', err)
    });
  }

  obtenerNombreDueno(usuarioId: number): string {
    const usuario = this.listaUsuarios().find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : 'Dueño desconocido';
  }

  obtenerRolDueno(usuarioIdRol?: number | null): string {
    if (!usuarioIdRol) return 'Sin rol';
    const rol = this.listaRoles().find(r => r.id === usuarioIdRol);
    return rol ? rol.nombre : 'Rol desconocido';
  }
}