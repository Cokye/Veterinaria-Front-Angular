# 🏥 Sistema Clínico Integral

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Oracle](https://img.shields.io/badge/Oracle_Database-F80000?style=for-the-badge&logo=oracle&logoColor=white)](https://www.oracle.com/database/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Aplicación web full-stack diseñada para la gestión clínica. La solución integra un backend desarrollado en **Spring Boot**, persistencia relacional empresarial en **Oracle Database** y un cliente web interactivo construido en **Angular**.

---

## 📌 Arquitectura del Proyecto

El sistema opera bajo un esquema desacoplado cliente-servidor mediante servicios web RESTful:

```
[ Cliente Angular ] <--- (REST / JSON) ---> [ Backend Spring Boot ] <--- (JDBC/JPA) ---> [ Oracle Database ]
```

* **Frontend (`frontend-angular`):** Interfaz SPA responsable de la interacción con el usuario, control de formularios reactivos y consumo de las APIs del sistema.
* **Backend (`backend-spring`):** Servidor API REST encargado de las reglas de negocio, validaciones, seguridad y transaccionalidad.
* **Base de Datos (`Oracle DB`):** Almacenamiento relacional para entidades, tablas intermedias, integridad referencial y secuencias.

---

## 🛠️ Stack Tecnológico y Dependencias

### ⚙️ Backend (Spring Boot)
* **Lenguaje:** Java 17+
* **Framework:** Spring Boot 3.x
* **Dependencias principales:**
  * `spring-boot-starter-web`: Creación de endpoints REST y manejo de solicitudes HTTP.
  * `spring-boot-starter-data-jpa`: Capa de persistencia con Hibernate ORM.
  * `com.oracle.database.jdbc:ojdbc11`: Driver JDBC oficial para conexión a Oracle Database.
  * `spring-boot-starter-validation`: Validación de payloads (`@NotNull`, `@Size`, `@Email`).
  * `spring-boot-starter-security` / `jjwt`: Control de autenticación basada en tokens o sesiones.
  * `lombok`: Generación automática de getters, setters, constructores y builders.

### 🅰️ Frontend (Angular)
* **Framework:** Angular 17+ / 18+
* **Lenguaje:** TypeScript
* **Dependencias principales:**
  * `@angular/common/http`: Comunicación HTTP con el backend mediante `HttpClient`.
  * `@angular/forms`: Gestión de formularios reactivos (`ReactiveFormsModule`).
  * `@angular/router`: Navegación interna y protección de rutas vía Guards.
  * `rxjs`: Control de eventos asíncronos y operadores reactivos.

### 🗄️ Base de Datos (Oracle)
* **Motor:** Oracle Database (Free / XE / Enterprise)
* **Características:** Esquema relacional estructurado, claves foráneas, restricciones de unicidad e índices para optimización de consultas.

---

## 📋 Requisitos Previos

* **Java Development Kit (JDK):** Versión 17 o superior.
* **Node.js y npm:** Node.js LTS (v18.x o v20.x).
* **Angular CLI:** Instalable con `npm install -g @angular/cli`.
* **Oracle Database:** Instancia activa (local, contenedor Docker o nube).
* **Gestor de compilación:** Maven (incluido típicamente como `./mvnw`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO.git](https://github.com/TU_USUARIO/TU_REPOSITORIO.git)
cd TU_REPOSITORIO
```

---

### 2. Configurar la Base de Datos (Oracle)
Asegúrate de tener un contenedor o servicio de Oracle en ejecución (por ejemplo, Oracle Database Free):

```bash
docker run -d --name oracle-db -p 1521:1521 -e ORACLE_PASSWORD=tu_password [container-registry.oracle.com/database/free:latest](https://container-registry.oracle.com/database/free:latest)
```

En `backend/src/main/resources/application.properties`, define la conexión:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/FREEPDB1
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 3. Backend (Spring Boot)
Ingresa a la carpeta del backend y ejecuta el proyecto:

```bash
cd backend
./mvnw clean spring-boot:run
```

* API disponible en: `http://localhost:8080`

---

### 4. Frontend (Angular)
Ingresa a la carpeta del cliente web, instala las dependencias y corre el servidor de desarrollo:

```bash
cd ../frontend
npm install
ng serve
```

* Aplicación disponible en: `http://localhost:4200`

---

## 🗄️ Estructura del Modelo Relacional

Principales tablas administradas en Oracle Database:

* `USUARIOS`: Almacena el personal médico, administradores y pacientes con sus credenciales y roles.
* `PACIENTES`: Ficha médica, datos personales y antecedentes clínicos.
* `MEDICOS`: Especialistas, especialidades asociadas y asignación horaria.
* `CITAS_MEDICAS`: Reservas agendadas, estado de atención, fecha, hora y relación paciente-médico.
* `HISTORIAL_CLINICO`: Entradas clínicas, diagnósticos, recetas y observaciones emitidas por los médicos.

---

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Autenticación de usuarios y entrega de credenciales |
| `GET` | `/api/pacientes` | Obtiene el listado completo de pacientes |
| `POST` | `/api/pacientes` | Registra una nueva ficha de paciente |
| `GET` | `/api/citas` | Consulta de citas médicas disponibles o asignadas |
| `POST` | `/api/citas` | Agenda una nueva cita en el sistema |

---
