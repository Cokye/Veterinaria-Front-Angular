# 🏥 Frontend - Portal de Convenios Clínicos (Angular)

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)

Cliente web SPA desarrollado en **Angular** para el sistema clínico integral. Este módulo gestiona el flujo de autenticación de usuarios y la adquisición de planes y convenios de salud con descuentos tarifarios.

> **Nota:** Este repositorio contiene únicamente la interfaz de usuario. Consume la API REST expuesta por el [Backend Clínico en Spring Boot](https://github.com/Cokye/Backend-Clinica-React-angular).

---

## 📌 Funcionalidades Principales

* **Autenticación y Seguridad:** Módulo de Login con validación reactiva y almacenamiento de sesión/tokens.
* **Catálogo de Convenios:** Visualización de convenios disponibles, vigencias y porcentajes de descuento.
* **Adquisición y Contratación:** Registro de convenios contratados por el usuario para rebajas en atenciones médicas.
* **Guards de Rutas:** Protección de vistas privadas según el estado de la sesión.

---

## 🛠️ Stack Tecnológico y Dependencias

* **Framework:** Angular (v17+)
* **Lenguaje:** TypeScript
* **Dependencias principales:**
  * `@angular/common/http`: Comunicación cliente-servidor mediante `HttpClient`.
  * `@angular/forms`: Implementación de formularios reactivos (`ReactiveFormsModule`).
  * `@angular/router`: Configuración de rutas internas y navegación asistida por `RouterLink` y Guards.
  * `rxjs`: Manejo declarativo de flujos de datos asíncronos y operadores reactivos.

---

## 📋 Requisitos Previos

* **Node.js:** Versión 18.x o 20.x (LTS recomendada).
* **npm:** Gestor de paquetes incluido con Node.js.
* **Angular CLI:** Instalado globalmente mediante:
  ```bash
  npm install -g @angular/cli
  ```
* **Backend:** Instancia activa del servicio REST en ejecución (puerto por defecto `8080`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO_ANGULAR.git](https://github.com/TU_USUARIO/TU_REPOSITORIO_ANGULAR.git)
cd TU_REPOSITORIO_ANGULAR
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración del Endpoint Backend
Asegúrate de apuntar a la URL de la API (por defecto en `src/environments/environment.ts` o variables de entorno correspondientes):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 4. Ejecutar servidor de desarrollo
```bash
ng serve
```

* Aplicación disponible en: `http://localhost:4200`

---

## 🔗 Integración con el Sistema

```
[ Angular Frontend (:4200) ] ---> (HTTP REST / JSON) ---> [ Backend Spring Boot (:8080) ]
```

---

## 👤 Autor

* Desarrollado por **Felipe** ([@Cokye](https://github.com/Cokye))
