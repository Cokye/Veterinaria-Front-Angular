import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/api.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales: LoginRequest = { email: '', password: '' };
  errorLogin = signal<string | null>(null);

  onLogin(): void {
    this.errorLogin.set(null);

    this.authService.login(this.credenciales).subscribe({
      next: () => {
        this.router.navigate(['/mascotas']);
      },
      error: (err) => {
        this.errorLogin.set(err.error?.mensaje || 'Error al iniciar sesión');
      }
    });
  }
}