# Encuesta Movilidad

Aplicación de encuestas de movilidad para recopilar información sobre hábitos de transporte de los trabajadores. Soporta dos encuestas parametrizadas: **Avanza** y **Movilidad**.

## Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend Qwik │     │  Cloudflare      │     │   Cloudflare D1 │
│   (2 rutas)     │────▶│  Worker (Hono)   │────▶│   Database      │
│                 │     │                  │     │                 │
│ /avanza         │────▶│ /avanza/*        │────▶│ encuestas_avanza│
│ /movilidad      │────▶│ /movilidad/*     │────▶│ encuestas_movil │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

- **Frontend:** [Qwik](https://qwik.dev/) → Cloudflare Pages
- **Backend:** Cloudflare Worker (Hono) + D1 (SQLite distribuido)
- **Dev/Local:** FastAPI + SQLite (`python-backend/`)

---

## Estructura del Proyecto

```
encuesta-movilidad/
├── qwik-front/           # Frontend principal (Qwik, unificado)
│   ├── src/
│   │   ├── config/surveys.ts          # Configuración por encuesta
│   │   ├── components/survey/         # Componentes reutilizables
│   │   └── routes/
│   │       ├── index.tsx              # Selector de encuesta
│   │       ├── avanza/index.tsx       # Encuesta Avanza
│   │       └── movilidad/index.tsx    # Encuesta Movilidad
│   └── DEPLOY.md                      # Guía de deploy completa
├── python-backend/       # Backend de desarrollo (FastAPI + SQLite)
│   ├── main.py
│   ├── api/encuesta.py
│   ├── database_setup.py
│   └── create_encuesta_table.py
├── html-front/           # Frontend HTML legacy
├── nginx/                # Configuración Nginx + Certbot
│   ├── ms-encuesta.tellevoapp.com.conf
│   └── installation.md
└── data/
    └── encuesta.db       # Base de datos SQLite local
```

---

## Frontend (`qwik-front/`)

### Tecnologías
- [Qwik](https://qwik.dev/) v1.13
- [Vite](https://vitejs.dev/) v5.3
- TypeScript
- Cloudflare Pages (deploy)

### Rutas
| Ruta | Descripción |
|------|-------------|
| `/` | Selector de encuesta (Avanza / Movilidad) |
| `/avanza` | Formulario encuesta Avanza |
| `/movilidad` | Formulario encuesta Movilidad |

### Desarrollo local
```bash
cd qwik-front
npm install
npm run dev
```

### Build y deploy
```bash
npm run build              # Genera dist/
npx wrangler pages deploy dist
```

### Variables de entorno (`.env`)
```bash
VITE_API_BASE_URL=https://<worker-domain>.workers.dev
VITE_GOOGLE_MAPS_APIKEY=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40
```

---

## Backend de Desarrollo (`python-backend/`)

### Tecnologías
- [FastAPI](https://fastapi.tiangolo.com/) v0.115+
- [Uvicorn](https://www.uvicorn.org/)
- [Pydantic](https://docs.pydantic.dev/) v2
- SQLite (local)
- [uv](https://docs.astral.sh/uv/) para gestión de dependencias

### Requisitos
- Python >= 3.13
- `uv` instalado

### Instalación
```bash
cd python-backend
uv sync
```

### Setup de base de datos
```bash
uv run python database_setup.py
uv run python create_encuesta_table.py
```

### Ejecutar servidor
```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

La documentación interactiva de la API estará disponible en:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

### Endpoints API
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/encuestas/email_exists?email=` | Verifica si el email ya respondió |
| `POST` | `/api/v1/encuestas` | Guarda una nueva encuesta |

---

## Nginx (`nginx/`)

Configuración para servir la aplicación con HTTPS en `ms-encuesta.tellevoapp.com`.

### Instalación SSL (Certbot)
```bash
cd nginx
sudo ./copy-to-sites-available
sudo ./link-sites-enable
sudo certbot --nginx -d ms-encuesta.tellevoapp.com
```

Ver [`nginx/installation.md`](nginx/installation.md) para más detalles.

---

## Modelo de Datos

Ambas tablas (`encuestas_avanza` y `encuestas_movilidad`) comparten el mismo schema:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER PK | Autoincremental |
| `fecha` | TEXT | Fecha de respuesta (ISO8601) |
| `email` | TEXT UNIQUE | Email del respondente (lowercase) |
| `empresa` | TEXT | Empresa del respondente |
| `tipo_transporte` | TEXT | Medio de transporte principal |
| `cilindrada_moto` | TEXT | Cilindrada (solo motos) |
| `cilindrada_vehiculo` | TEXT | Cilindrada vehículo |
| `origen` | TEXT | Dirección de origen |
| `destino` | TEXT | Dirección de destino |
| `dias_especificos` | TEXT | Días de traslado (comma-separated) |
| `otro_tipo_transporte` | TEXT | Otro medio de transporte |
| `combustion` | TEXT | Tipo de combustión |
| `tiempo_trabajo` | TEXT | Tiempo al lugar de trabajo |
| `compartir_vehiculo` | TEXT | Disposición a compartir vehículo |
| `origen_latitud` / `origen_longitud` | REAL | Coordenadas origen |
| `destino_latitud` / `destino_longitud` | REAL | Coordenadas destino |
| `created_at` | DATETIME | Timestamp de creación |

---

## Reglas del Proyecto

- **CORS:** Abierto por defecto (`allow_origins=["*"]`)
- **Email:** Siempre normalizado a `lowercase` antes de insertar/verificar
- **Migraciones:** Prefijo `V{número}__` obligatorio (estilo Flyway)

---

## Documentación Adicional

| Archivo | Descripción |
|---------|-------------|
| [`qwik-front/DEPLOY.md`](qwik-front/DEPLOY.md) | Guía paso a paso para deploy en Cloudflare (Worker + D1 + Pages) |
| [`qwik-front/AGENTS.md`](qwik-front/AGENTS.md) | Arquitectura detallada del frontend y Worker |
| [`python-backend/AGENTS.md`](python-backend/AGENTS.md) | Guías de desarrollo para el backend FastAPI |
| [`nginx/installation.md`](nginx/installation.md) | Instalación de certificados SSL con Certbot |

---

## URLs Activas (Producción)

| Servicio | URL |
|----------|-----|
| Frontend (Cloudflare Pages) | `https://encuesta-movilidad.pages.dev` |
| Worker API | `https://encuesta-worker.desarrollo-501.workers.dev` |

---

*Proyecto de Tellevo — Encuesta de Movilidad*
