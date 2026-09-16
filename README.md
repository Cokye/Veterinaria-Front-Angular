# 🅰️ Frontend - Gestión de Usuarios (Angular)

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)

Cliente web SPA desarrollado en **Angular** para el módulo de autenticación y visualización de usuarios. La aplicación implementa un formulario de login y una vista protegida que lista los usuarios registrados consumiendo una API REST centralizada.

> **Nota:** Este repositorio contiene únicamente el código del cliente frontend. Requiere el servicio backend en ejecución: [Backend Spring Boot](https://github.com/Cokye/Backend-Clinica-React-angular).

---

## 📌 Funcionalidades

* **Autenticación (Login):** Formulario reactivo con validación de credenciales.
* **Control de Sesión:** Manejo de estado de autenticación y protección de vistas.
* **Listado de Usuarios:** Tabla interactiva que consulta y renderiza la lista de usuarios obtenida desde la API REST.

---

## 🛠️ Stack Tecnológico y Dependencias

* **Framework:** Angular (v17+)
* **Lenguaje:** TypeScript
* **Dependencias principales:**
  * `@angular/common/http`: Cliente `HttpClient` para realizar peticiones REST al backend.
  * `@angular/forms`: Formularios reactivos (`ReactiveFormsModule`) para la captura y validación del login.
  * `@angular/router`: Enrutador para alternar entre la vista de login y el dashboard/listado.
  * `rxjs`: Manejo de flujos de datos asíncronos (`Observables`).

---

## 📋 Requisitos Previos

* **Node.js:** Versión 18.x o 20.x (LTS) y `npm`.
* **Angular CLI:** Instalado globalmente:
  ```bash
  npm install -g @angular/cli
  ```
* **Backend:** API Spring Boot en ejecución (puerto `8080`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/Cokye/Veterinaria-Front-Angular
cd TU_REPOSITORIO_ANGULAR
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Endpoint Backend
Asegúrate de que la URL apunte al backend (en `src/environments/environment.ts` o servicio de conexión):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 4. Ejecutar la aplicación
```bash
ng serve
```

* Disponible en: `http://localhost:4200`

---

## 🔗 Integración

```
[ Angular (:4200) ] ---> POST /api/auth/login  ---> [ Spring Boot API (:8080) ]
[ Angular (:4200) ] ---> GET  /api/usuarios    ---> [ Spring Boot API (:8080) ]
```

---

## 👤 Autor

* Desarrollado por **Felipe** ([@Cokye](https://github.com/Cokye))
