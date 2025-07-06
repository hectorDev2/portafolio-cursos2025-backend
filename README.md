# Portafolio de Cursos 2025 - Backend (NestJS, Prisma & JWT)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Backend para el sistema de gestión de portafolios de cursos, desarrollado con **NestJS**, **Prisma ORM** y **JSON Web Tokens (JWT)** para autenticación.

## Descripción General

Este proyecto centraliza la gestión de portafolios de cursos para docentes de la Escuela Profesional de Ingeniería Informática y de Sistemas. Permite a los docentes subir y organizar sílabos, material didáctico, asignaciones, exámenes y trabajos estudiantiles. El backend provee APIs seguras y escalables para la gestión de usuarios, portafolios y documentos.

## Características Clave

*   **Autenticación y Autorización**: Sistema robusto con JWT para control de acceso por roles.
*   **Gestión de Usuarios**: CRUD completo para la gestión de usuarios.
*   **Gestión de Portafolios**: CRUD completo para portafolios de cursos.
*   **Gestión de Cursos**: CRUD de cursos anidados dentro de un portafolio.
*   **Gestión de Documentos**: Subida y manejo de archivos (hasta 5MB), con almacenamiento local.
*   **Roles de Usuario**: Permisos diferenciados para Administradores, Docentes y Evaluadores.

## Tecnologías Utilizadas

| Componente      | Tecnología                                      |
| --------------- | ----------------------------------------------- |
| **Framework**   | [NestJS](https://nestjs.com/)                   |
| **Lenguaje**    | [TypeScript](https://www.typescriptlang.org/)   |
| **ORM**         | [Prisma](https://www.prisma.io/)                |
| **Base de Datos** | [SQLite](https://www.sqlite.org/index.html)     |
| **Autenticación** | [JWT](https://jwt.io/) / [Passport.js](http://www.passportjs.org/) |
| **Validación**  | `class-validator`, `class-transformer`          |
| **Servidor**    | [Node.js](https://nodejs.org/)                  |

## Endpoints de la API

A continuación se muestran los endpoints principales de la API. Todas las rutas, excepto `/auth/login` y `/auth/register`, están protegidas y requieren un token JWT.

| Método | Ruta                                               | Rol Requerido | Descripción                               |
| :----- | :------------------------------------------------- | :------------ | :---------------------------------------- |
| `POST` | `/auth/login`                                      | Público       | Inicia sesión y obtiene un token JWT.     |
| `POST` | `/auth/register`                                   | Público       | Registra un nuevo usuario (Docente).      |
| `GET`  | `/user`                                            | Docente       | Obtiene todos los usuarios.               |
| `GET`  | `/user/:id`                                        | Docente       | Obtiene un usuario por su ID.             |
| `POST` | `/user/:id`                                        | Docente       | Actualiza un usuario.                     |
| `DELETE`| `/user/:id`                                       | Docente       | Elimina un usuario.                       |
| `POST` | `/portfolios`                                      | Docente       | Crea un nuevo portafolio.                 |
| `GET`  | `/portfolios`                                      | Docente       | Obtiene los portafolios del docente.      |
| `GET`  | `/portfolios/:id`                                  | Docente, Admin, Evaluador | Obtiene un portafolio por su ID.          |
| `PATCH`| `/portfolios/:id`                                  | Docente       | Actualiza un portafolio.                  |
| `POST` | `/portfolios/:portfolioId/cursos`                  | Docente       | Crea un curso en un portafolio.           |
| `GET`  | `/portfolios/:portfolioId/cursos`                  | Docente       | Obtiene los cursos de un portafolio.      |
| `POST` | `/portfolios/:portfolioId/caratulas`               | Docente       | Sube el archivo de carátula.              |
| `POST` | `/portfolios/:portfolioId/carga-lectiva`           | Docente       | Sube el archivo de carga lectiva.         |
| `POST` | `/portfolios/:portfolioId/filosofias`              | Docente       | Sube el archivo de filosofía.             |

## Configuración y Ejecución

### Prerequisitos

*   Node.js (v18+ recomendado)
*   Bun (o npm/yarn)

### Pasos de Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/hectorDev2/portafolio-cursos2025-backend.git
    cd portafolio-cursos2025-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    bun install
    ```
    o si usas npm:
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y copia el contenido de `.env.template`.
    ```bash
    cp .env.template .env
    ```
    Abre el archivo `.env` y modifica las variables si es necesario. Como mínimo, necesitas `DATABASE_URL` y `SECRET`.

4.  **Aplicar las migraciones de la base de datos:**
    Esto creará el archivo de base de datos SQLite y las tablas según el `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

5.  **(Opcional) Poblar la base de datos con datos de prueba:**
    El script `seed` crea un usuario administrador y un usuario docente.
    ```bash
    npm run prisma:seed
    ```

### Ejecución

*   **Modo de desarrollo (con auto-recarga):**
    ```bash
    bun run dev
    ```

*   **Modo de producción:**
    ```bash
    bun run build
    bun run start:prod
    ```

## Scripts Principales

*   `bun run dev`: Inicia la aplicación en modo de desarrollo.
*   `bun run build`: Compila el código TypeScript a JavaScript.
*   `bun run start:prod`: Inicia la aplicación en modo de producción (requiere compilación previa).
*   `bun run lint`: Ejecuta ESLint para analizar el código.
*   `bun run format`: Formatea el código con Prettier.
*   `npx prisma studio`: Abre la interfaz de Prisma Studio para visualizar y editar la base de datos.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.