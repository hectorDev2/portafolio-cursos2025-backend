# Portafolio de Cursos 2025 - Backend (NestJS, Prisma & JWT)

Backend para el sistema de gestión de portafolios de cursos, desarrollado con **NestJS**, **Prisma ORM** y **JSON Web Tokens (JWT)** para autenticación.

## Descripción General

Este proyecto centraliza la gestión de portafolios de cursos para docentes de la Escuela Profesional de Ingeniería Informática y de Sistemas. Permite a los docentes subir y organizar sílabos, material didáctico, asignaciones, exámenes y trabajos estudiantiles. El backend provee APIs seguras y escalables para la gestión de usuarios, portafolios y documentos.

## Objetivos

Desarrollar un sistema de información para gestionar el portafolio de cursos, aplicando la metodología Scrum y tecnologías modernas como NestJS, Prisma y JWT.

## Características Clave

* **Autenticación y Autorización**: Sistema robusto con JWT para control de acceso por roles (Administrador, Docente, Evaluador).
* **Gestión de Portafolios**: CRUD completo para portafolios de cursos.
* **Gestión de Documentos**: Subida y manejo de archivos (hasta 5MB), con integración para almacenamiento en la nube. Incluye funcionalidad de fusión de documentos para administradores.
* **Roles de Usuario**: Permisos diferenciados para Administradores, Docentes y Evaluadores.

## Tecnologías Utilizadas

* **Backend**: NestJS (Node.js)
* **Base de Datos**: SQLite (para desarrollo/pruebas)
* **ORM**: Prisma ORM
* **Autenticación**: JWT (`@nestjs/jwt`, `@nestjs/passport`)
* **Metodología**: SCRUM

## Estructura del Proyecto

Organización modular típica de NestJS:
```tree
src/
├── auth/            # Módulo de autenticación (login, registro, JWT strategy, guards)
├── users/           # Módulo de gestión de usuarios (creación, roles, etc.)
├── portfolios/      # Módulo para la gestión de portafolios (CRUD de portafolios)
├── documents/       # Módulo para la subida y gestión de documentos (subida, eliminación, etc.)
├── shared/          # Módulos o utilidades compartidas (DTOs, interfaces, helpers, pipes, guards generales)
├── main.ts          # Archivo de entrada de la aplicación
├── app.module.ts    # Módulo raíz de la aplicación
├── prisma/          # Directorio de Prisma (schema.prisma, migrations)
├── ...
## Configuración y Ejecución

### Prerequisitos

* Node.js (v16+ recomendado)
* npm o Yarn

### Instalación

1.  Clonar el repositorio: `git clone https://github.com/hectorDev2/portafolio-cursos2025-backend.git`
2.  Navegar al directorio: `cd portafolio-cursos2025-backend`
3.  Instalar dependencias: `npm install` (o `yarn install`)
4.  Generar cliente Prisma: `npx prisma generate`

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con:
```dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="TU_SECRETO_SEGURO_PARA_JWT" # ¡CAMBIAR EN PRODUCCIÓN!
JWT_EXPIRATION_TIME="1h"
