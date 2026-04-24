# AGENTS.md — Encuesta Movilidad (Qwik + Cloudflare Worker + D1)

## Fecha
2026-04-23

## Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend Qwik │     │  Cloudflare      │     │   Cloudflare D1 │
│   (3 rutas)     │────▶│  Worker (Hono)   │────▶│   Database      │
│                 │     │                  │     │                 │
│ / (Home)        │     │ /avanza/*        │     │ encuestas_avanza│
│ /avanza         │────▶│ /movilidad/*     │────▶│ encuestas_movil │
│ /movilidad      │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Frontend Qwik (Unificado)

### Rutas
| Ruta | Componente | Config |
|------|------------|--------|
| `/` | Home selector | — |
| `/avanza` | `SurveyPage` | `avanzaConfig` |
| `/movilidad` | `SurveyPage` | `movilidadConfig` |

### Archivos clave
- `src/config/surveys.ts` — Configuraciones por encuesta (`id`, `title`, `apiBaseUrl`, `logoSrc`, etc.)
- `src/components/survey/SurveyPage.tsx` — Componente parametrizado. Usa `${config.apiBaseUrl}/api/v1/encuestas/${config.id}/...`
- `src/components/survey/SurveyHeader.tsx` — Recibe `config` vía props
- `src/routes/avanza/index.tsx` — Wrapper con `avanzaConfig`
- `src/routes/movilidad/index.tsx` — Wrapper con `movilidadConfig`

### Variables de entorno (`.env`)
```bash
VITE_API_BASE_URL=https://<worker-domain>.workers.dev   # URL del Worker deployado
VITE_GOOGLE_MAPS_APIKEY=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40
```

### Endpoints consumidos por el frontend
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `{apiBaseUrl}/api/v1/encuestas/{id}/email_exists?email=` | Verifica duplicado |
| `POST` | `{apiBaseUrl}/api/v1/encuestas/{id}` | Guarda encuesta |

Donde `{id}` = `avanza` o `movilidad`.

---

## Cloudflare Worker (`encuesta-worker/`)

### Stack
- **Runtime:** Cloudflare Workers
- **Framework:** Hono v4.4
- **Base de datos:** Cloudflare D1
- **Lenguaje:** TypeScript

### Estructura
```
encuesta-worker/
├── src/
│   ├── index.ts                 # Entry point + routing principal
│   ├── routes/
│   │   ├── avanza.ts            # GET/POST /api/v1/encuestas/avanza/*
│   │   └── movilidad.ts         # GET/POST /api/v1/encuestas/movilidad/*
│   ├── utils/
│   │   ├── db.ts                # checkEmailExists, createEncuesta
│   │   ├── validation.ts        # validateEncuesta, validateEmailQuery
│   │   └── cors.ts              # Headers CORS abiertos
│   ├── models/
│   │   └── encuesta.ts          # Interfaces TypeScript
│   └── db/
│       ├── schema.sql           # DDL completo
│       └── migrations/
│           └── V1__init.sql     # Migración inicial (Flyway-style)
├── wrangler.toml                # Config Worker + D1 binding
├── package.json
└── tsconfig.json
```

### Endpoints del Worker
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Health check + lista de endpoints |
| `GET` | `/api/v1/encuestas/avanza/email_exists?email=` | Verifica email en `encuestas_avanza` |
| `POST` | `/api/v1/encuestas/avanza` | Crea registro en `encuestas_avanza` |
| `GET` | `/api/v1/encuestas/movilidad/email_exists?email=` | Verifica email en `encuestas_movilidad` |
| `POST` | `/api/v1/encuestas/movilidad` | Crea registro en `encuestas_movilidad` |

### Tablas D1
#### `encuestas_avanza`
| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | INTEGER PK AUTOINCREMENT | |
| `fecha` | TEXT NOT NULL | ISO8601 |
| `email` | TEXT NOT NULL UNIQUE | Normalizado a lowercase |
| `empresa` | TEXT NOT NULL | |
| `tipo_transporte` | TEXT NOT NULL | |
| `cilindrada_moto` | TEXT | Nullable |
| `cilindrada_vehiculo` | TEXT | Nullable |
| `origen` | TEXT NOT NULL | |
| `destino` | TEXT NOT NULL | |
| `dias_especificos` | TEXT NOT NULL | Comma-separated |
| `otro_tipo_transporte` | TEXT | Nullable |
| `combustion` | TEXT NOT NULL DEFAULT 'No Aplica' | |
| `tiempo_trabajo` | TEXT NOT NULL | |
| `compartir_vehiculo` | TEXT | Nullable |
| `origen_latitud` | REAL | Nullable |
| `origen_longitud` | REAL | Nullable |
| `destino_latitud` | REAL | Nullable |
| `destino_longitud` | REAL | Nullable |
| `created_at` | DATETIME DEFAULT CURRENT_TIMESTAMP | |

#### `encuestas_movilidad`
- Mismo schema exacto que `encuestas_avanza`.

---

## Deploy paso a paso

### 1. Crear base de datos D1
```bash
cd encuesta-worker
npx wrangler d1 create encuestas-db
```
Copiar el `database_id` que retorna el comando.

### 2. Configurar wrangler.toml
Reemplazar `PENDING_CREATION` en `wrangler.toml` con el `database_id` real.

### 3. Aplicar migración
```bash
npx wrangler d1 migrations apply encuestas-db
```

### 4. Deploy del Worker
```bash
npx wrangler deploy
```
Copiar la URL del Worker (ej: `https://encuesta-worker.tu-subdomain.workers.dev`).

### 5. Configurar frontend
En la raíz del proyecto Qwik, crear/actualizar `.env`:
```bash
VITE_API_BASE_URL=https://<worker-url>
VITE_GOOGLE_MAPS_APIKEY=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40
```

### 6. Deploy frontend
```bash
npm run build
# Subir dist/ a Cloudflare Pages (o usar wrangler pages deploy)
```

---

## Reglas del Proyecto

- **CORS:** Abierto por defecto (`origin: '*'`)
- **Email:** Siempre normalizado a lowercase antes de insertar/verificar
- **Migraciones:** Prefijo `V{número}__` obligatorio (Flyway-style)
- **Cambios API:** Notificar a equipo Flutter inmediatamente (si aplica)

---

## Estado de implementación

| Componente | Estado |
|------------|--------|
| Worker backend | ✅ Implementado |
| Schema D1 + migraciones | ✅ Implementado |
| Frontend parametrizado | ✅ Implementado |
| D1 creada en Cloudflare | ✅ `6e607791-0067-4b87-977d-b7c024d72fde` |
| Worker deployado | ✅ `https://encuesta-worker.desarrollo-501.workers.dev` |
| Tablas creadas en D1 | ✅ `encuestas_avanza`, `encuestas_movilidad` |
| Frontend conectado al Worker | ✅ `VITE_API_BASE_URL` actualizado |
| Frontend build | ✅ Listo en `dist/` |
| Frontend deployado en Pages | ✅ `https://encuesta-movilidad.pages.dev` |

### URLs activas
| Servicio | URL |
|----------|-----|
| Frontend (Pages) | `https://encuesta-movilidad.pages.dev` |
| Worker API | `https://encuesta-worker.desarrollo-501.workers.dev` |
| Health check | `GET /` |
| Avanza email | `GET /api/v1/encuestas/avanza/email_exists?email=` |
| Avanza submit | `POST /api/v1/encuestas/avanza` |
| Movilidad email | `GET /api/v1/encuestas/movilidad/email_exists?email=` |
| Movilidad submit | `POST /api/v1/encuestas/movilidad` |

**Ver la guía completa de deploy y troubleshooting en `DEPLOY.md`**.
