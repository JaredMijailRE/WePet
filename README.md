# WePet

Pequeña guía para desarrollar y ejecutar el proyecto WePet (monorepo con frontend en Expo y microservicios en Python/FastAPI).

## Resumen rápido
- **Frontend:** Expo (React Native / React) con TypeScript. Carpeta: `Frontend`.
- **Backends:** Microservicios en Python usando FastAPI, SQLAlchemy y PostgreSQL. Carpetas: `UserManagment`, `PetManagment`, `GroupManagment`, `SharingService`.
- **Mensajería:** RabbitMQ (service `message-queue` en `docker-compose.yml`).
- **Reverse proxy / gateway:** Traefik (service `gateway`).
- **Contenerización:** Docker + `docker-compose.yml` en la raíz.

## Requisitos locales
- Docker & Docker Compose instalado.
- Node.js (recomendado LTS, v18+).
- Python 3.12+ si vas a ejecutar servicios backend localmente fuera de Docker.

## Arranque rápido (modo recomendado: Docker)
Levanta todos los servicios (base de datos, queue, traefik y microservicios):

```pwsh
docker compose up --build
```

Esto construirá las imágenes y levantará:
- Traefik (puertos: `80`, `443`, dashboard `8080`).
- Servicios: `group-managment`, `pet-managment`, `user-managment`, `sharing-service`.
- Bases de datos Postgres (un contenedor por servicio).
- RabbitMQ (message queue).

Para levantar sólo un servicio durante desarrollo (ej.: `user-managment`):

```pwsh
docker compose up --build user-managment
```

## Desarrollo frontend (local)
1. Ir al directorio del frontend:

```pwsh
cd Frontend
```
2. Instalar dependencias:

```pwsh
npm install
```
3. Ejecutar Expo:

```pwsh
npm run start
```

Notas:
- `Frontend` usa `expo-router`, `react-native`, `react` y TypeScript.
- Usa comandos estándar de Expo (`android`, `ios`, `web`) definidos en `package.json`.

## Desarrollo backend (local con Docker)
La forma más sencilla es usar `docker compose` (se describe arriba). Cada servicio tiene su propio `Dockerfile`.

Si deseas correr un servicio localmente sin Docker (opcional):

```pwsh
# ejemplo para UserManagment
cd UserManagment
# crea y activa un entorno virtual
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# instalar dependencias (pyproject.toml) - usar pip/poetry según preferencia
pip install -e .
# o instalar dependencias listadas manualmente
pip install fastapi uvicorn sqlalchemy psycopg2-binary pyjwt
# arrancar uvicorn
uvicorn internal.main:app --host 0.0.0.0 --port 8000 --reload
```

Nota: los `pyproject.toml` requieren Python >= 3.12.

## Variables de entorno y configuración
- En `docker-compose.yml` se definen `DATABASE_URL` para cada servicio (ejemplo):
  `postgresql+psycopg2://admin:admin@user-db:5432/userdb`.
- Para desarrollo local fuera de Docker, crea un archivo `.env` o exporta `DATABASE_URL` apropiado.
- Evita dejar credenciales en producción dentro del `docker-compose.yml`; usa secretos o gestores de secretos.

## Puertos y acceso
- Traefik: `http://localhost:80`, `https://localhost:443`, dashboard `http://localhost:8080`.
- Servicios FastAPI (internamente): normalmente exponen `uvicorn` en `:80` dentro del contenedor.
- Postgres: expuesto solo entre contenedores (no mapeado a host por defecto).

## Comandos útiles
- Levantar todo: `docker compose up --build`
- Levantar solo frontend (local): desde `Frontend` -> `npm run start`
- Acceder al contenedor: `docker exec -it user-managment /bin/sh` (o `bash` si disponible)

## Recomendaciones
- Añadir `README.md` por servicio explicando cómo arrancar y dónde están los endpoints.
- Añadir `.env.example` con variables necesarias (`DATABASE_URL`, `SECRET_KEY`, etc.).
- Añadir scripts de `make` o `task` para comandos comunes.
- Integrar CI que construya y pruebe cada servicio.

## Estructura de carpetas (resumen)
- `Frontend/` — app Expo (React Native / web). 
- `UserManagment/`, `PetManagment/`, `GroupManagment/`, `SharingService/` — microservicios Python/FastAPI.
- `docker-compose.yml` — orquestación local (Traefik, Postgres, RabbitMQ, servicios).
## Arquitectura del Proyecto

<div align="center">
  <img src="_img/ArquiDiagram.png" alt="NixOS Logo" width="800"/>
</div>
