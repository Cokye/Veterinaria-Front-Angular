import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalesService } from '../../services/animales.service';
import { AuthService } from '../../services/auth.service';
import { CrearAnimalesRequest } from '../../models/api.models';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-mascota.html',
  styleUrl: './registro-mascota.css'
})
export class RegistroMascotaComponent {
  private animalesService = inject(AnimalesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  nuevoAnimal: CrearAnimalesRequest = {
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    sexo: '',
    peso: 0,
    usuario_id: 0
  };

  onCrearAnimal(): void {
    const usuarioId = this.authService.usuarioActual()?.id;
    if (!usuarioId) {
      alert('Debes iniciar sesión para registrar una mascota');
      return;
    }

    this.nuevoAnimal.usuario_id = usuarioId;
    this.animalesService.crear(this.nuevoAnimal).subscribe({
      next: () => {
        this.router.navigate(['/mascotas']);
      },
      error: (err) => alert(typeof err.error === 'string' ? err.error : 'Error al crear animal')
    });
  }
}