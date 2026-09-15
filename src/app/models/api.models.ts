// Entidades principales
export interface Rol {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol_id: number;
}

export interface Animal {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  sexo: string;
  peso: number;
  usuario_id: number;
}

// DTOs de Autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  exito: boolean;
  mensaje: string;
  nombre: string;
  email: string;
  rol_id: number;
  id: number;
  token: string;
}

// DTOs de Creación / Actualización
export interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
}

export interface UpdateUsuarioRequest {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
}

export interface CrearAnimalesRequest {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  sexo: string;
  peso: number;
  usuario_id: number;
}

export interface CrearRolRequest {
  nombre: string;
  descripcion: string;
}