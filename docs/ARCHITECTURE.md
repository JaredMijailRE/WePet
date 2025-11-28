# Arquitectura - WePet

Este documento describe la arquitectura general del monorepo `WePet`, los servicios que lo componen, el flujo de red, y comandos útiles para desarrollo local.

## Vista general
- Monorepo con un frontend en Expo (React Native + web) y varios microservicios backend en Python/FastAPI.
- Orquestación local con `docker-compose` que incluye Traefik como gateway/reverse-proxy, PostgreSQL por servicio y RabbitMQ como broker.

## Servicios principales

- `gateway` (Traefik)
  - Imagen: `traefik:v3.1`
  - Puertos: host `80` -> Traefik, `443` -> Traefik, `8080` -> dashboard de Traefik
  - Rol: enrutamiento de peticiones hacia los microservicios internos usando provider Docker.

- `group-managment`
  - Contenedor construido desde `GroupManagment/Dockerfile`
  - Depende de: `group-db` (Postgres)

- `pet-managment`
  - Contenedor construido desde `PetManagment/Dockerfile`
  - Depende de: `pet-db` (Postgres)

- `user-managment`
  - Contenedor construido desde `UserManagment/Dockerfile`
  - Depende de: `user-db` (Postgres)

- `sharing-service`
  - Contenedor construido desde `SharingService/Dockerfile`
  - Depende de: `sharing_db` (Postgres)

- `message-queue`
  - Imagen: `rabbitmq:4.1.5-management-alpine`
  - Rol: broker para mensajes/colas internas entre servicios.

- Bases de datos (Postgres)
  - `group-db`, `pet-db`, `user-db`, `sharing_db` (cada uno usa `postgres:17-alpine`)
  - Nota: en `docker-compose.yml` los volúmenes persisten los datos localmente.

## Puertos y acceso

- Traefik (host):
  - HTTP: `http://localhost:80`
  - HTTPS: `https://localhost:443` (si está configurado)
  - Dashboard: `http://localhost:8080`

- Microservicios:
  - Dentro de su contenedor normalmente ejecutan `uvicorn` en el puerto `80` (según Dockerfile). No están mapeados directamente al host en `docker-compose.yml` — Traefik actúa como proxy.
  - Para desarrollo local ejecutando `uvicorn` fuera de Docker, se suelen exponer en `:8000` u otro puerto local (ver instrucciones de cada servicio).

- PostgreSQL: no expuesto al host por defecto; comunicado internamente entre contenedores.

- RabbitMQ: expuesto dentro de Docker, dashboard puede estar disponible si la imagen lo publica internamente (usar `docker compose ps` para ver puertos).

## Flujo de red (simplificado)

1. Cliente (app Expo o navegador) hace peticiones a `http://localhost`.
2. Traefik recibe la petición y, según reglas/proveedores Docker, enruta hacia el contenedor correspondiente (`user-managment`, `pet-managment`, etc.).
3. El microservicio consulta su base de datos Postgres o publica/consume mensajes en RabbitMQ según necesidad.

```
[Cliente (Expo/web)] -> [Traefik:80/443] -> [Microservicio FastAPI] -> [Postgres / RabbitMQ]
```

## Endpoints y documentación

- Cada microservicio usa FastAPI; por defecto exponen OpenAPI / Swagger en `/<ruta>/docs` cuando `uvicorn` está corriendo.
- Si usas `docker compose` con Traefik, las rutas públicas dependen de cómo estén definidas las etiquetas de Traefik en los Dockerfiles o en la definición de servicios (revisar `Dockerfile` y `docker-compose.yml` si hay `labels`).

## Comandos útiles

- Levantar todo (root):

```pwsh
docker compose up --build
```

- Levantar un servicio concreto:

```pwsh
docker compose up --build user-managment
```

- Ver logs de un servicio:

```pwsh
docker compose logs -f user-managment
```

- Ejecutar una shell en un contenedor:

```pwsh
docker exec -it user-managment /bin/sh
```

## Desarrollo local (sin Docker)

- Para depurar o desarrollar un servicio individualmente:

```pwsh
cd UserManagment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt # o pip install -e . si se usa setup/poetry
uvicorn internal.main:app --reload --host 0.0.0.0 --port 8000
```

Luego puedes probar `http://localhost:8000/docs`.

## Consideraciones y recomendaciones

- Añadir etiquetas `labels` de Traefik en los `docker-compose` para documentar rutas públicas por servicio.
- Exponer health-check endpoints (`/health` o `/ready`) en cada servicio para facilitar orquestación y monitoreo.
- Añadir `docker-compose.override.yml` para desarrollo con mapeo de puertos a host y bind-mounts del código.
- Mantener `pyproject.toml` o `requirements.txt` sincronizados y considerar `poetry` para gestión de dependencias consistente.

