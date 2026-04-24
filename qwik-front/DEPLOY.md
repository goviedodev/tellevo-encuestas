# Guía de Deploy — Encuesta Movilidad (Worker + D1 + Pages)

> **Prerrequisito:** Tener una cuenta en [Cloudflare](https://dash.cloudflare.com) y [wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) instalado.

---

## Índice
1. [Login en Cloudflare](#paso-1-login-en-cloudflare)
2. [Crear base de datos D1](#paso-2-crear-base-de-datos-d1)
3. [Configurar wrangler.toml](#paso-3-configurar-wranglertoml)
4. [Aplicar migraciones](#paso-4-aplicar-migraciones)
5. [Deploy del Worker](#paso-5-deploy-del-worker)
6. [Verificar Worker](#paso-6-verificar-worker)
7. [Configurar y deployar frontend](#paso-7-configurar-y-deployar-frontend)
8. [Verificar end-to-end](#paso-8-verificar-end-to-end)

---

## Paso 1: Login en Cloudflare

Autentica `wrangler` con tu cuenta de Cloudflare.

```bash
cd encuesta-worker
npx wrangler login
```

Esto abrirá un navegador. Autoriza el acceso y vuelve a la terminal.

**Verificación:**
```bash
npx wrangler whoami
```
Debe mostrar tu email de Cloudflare.

---

## Paso 2: Crear base de datos D1

Crea la base de datos SQLite distribuida en Cloudflare.

```bash
npx wrangler d1 create encuestas-db
```

**Salida esperada:**
```
✅ Successfully created DB 'encuestas-db'
database_id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ Importante:** Copia el `database_id` (UUID). Lo necesitarás en el paso 3.

**Nota:** El nombre `encuestas-db` debe coincidir con `database_name` en `wrangler.toml`.

---

## Paso 3: Configurar wrangler.toml

Abre `encuesta-worker/wrangler.toml` y reemplaza `PENDING_CREATION` con el `database_id` real.

**Antes:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "encuestas-db"
database_id = "PENDING_CREATION"
```

**Después:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "encuestas-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Guarda el archivo.**

---

## Paso 4: Aplicar migraciones

Ejecuta el SQL de creación de tablas en la base de datos D1.

```bash
npx wrangler d1 migrations apply encuestas-db
```

Wrangler detectará automáticamente el archivo `src/db/migrations/V1__init.sql` y lo ejecutará.

**Verificación (opcional):** Puedes verificar las tablas creadas:
```bash
npx wrangler d1 execute encuestas-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Debe mostrar:
```
encuestas_avanza
encuestas_movilidad
```

---

## Paso 5: Deploy del Worker

Compila y sube el Worker a Cloudflare.

```bash
npx wrangler deploy
```

**Salida esperada:**
```
Total Upload: xx.x KiB / gzip: xx.x KiB
Uploaded encuesta-worker (x.x sec)
Published encuesta-worker (x.x sec)
  https://encuesta-worker.tu-subdomain.workers.dev
```

**⚠️ Importante:** Copia la URL del Worker (`https://encuesta-worker....workers.dev`). La necesitarás en el paso 7.

---

## Paso 6: Verificar Worker

Antes de conectar el frontend, verifica que el Worker responde correctamente.

### 6.1 Health check
```bash
curl https://encuesta-worker.tu-subdomain.workers.dev/
```

**Respuesta esperada:**
```json
{
  "service": "encuesta-worker",
  "status": "ok",
  "version": "1.0.0",
  "endpoints": [...]
}
```

### 6.2 Verificar email (no existe)
```bash
curl "https://encuesta-worker.tu-subdomain.workers.dev/api/v1/encuestas/avanza/email_exists?email=test@example.com"
```

**Respuesta esperada:**
```json
{"exists": false}
```

### 6.3 Crear encuesta de prueba
```bash
curl -X POST https://encuesta-worker.tu-subdomain.workers.dev/api/v1/encuestas/avanza \
  -H "Content-Type: application/json" \
  -d '{
    "FECHA": "2026-04-23T12:00:00Z",
    "EMAIL": "test@example.com",
    "EMPRESA": "TestCorp",
    "TIPO_TRANSPORTE": "pie",
    "ORIGEN": "Santiago Centro",
    "DESTINO": "Las Condes",
    "DIAS_ESPECIFICOS": "Lunes, Martes",
    "COMBUSTION": "No Aplica",
    "TIEMPO_TRABAJO": "-15min"
  }'
```

**Respuesta esperada:**
```json
{"id": 1, "message": "Encuesta guardada correctamente"}
```

### 6.4 Verificar duplicado
```bash
curl "https://encuesta-worker.tu-subdomain.workers.dev/api/v1/encuestas/avanza/email_exists?email=test@example.com"
```

**Respuesta esperada:**
```json
{"exists": true}
```

---

## Paso 7: Configurar y deployar frontend

### 7.1 Actualizar variables de entorno

En la raíz del proyecto Qwik, edita `.env`:

```bash
# Antes (backend anterior)
# VITE_API_BASE_URL=https://ms-encuesta.tellevoapp.com:443

# Nuevo (Worker de Cloudflare)
VITE_API_BASE_URL=https://encuesta-worker.tu-subdomain.workers.dev
VITE_GOOGLE_MAPS_APIKEY=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40
```

### 7.2 Build de producción

```bash
cd ..  # volver a raíz si estás en encuesta-worker/
npm run build
```

Esto genera la carpeta `dist/` con el bundle de producción.

### 7.3 Deploy en Cloudflare Pages

**Opción A: Wrangler CLI**
```bash
npx wrangler pages deploy dist
```

**Opción B: Git integration**
Conecta el repositorio Git a Cloudflare Pages para deploy automático en cada push.

**Opción C: Drag & Drop**
En el dashboard de Cloudflare Pages, crea un proyecto nuevo y sube la carpeta `dist/` como zip.

---

## Paso 8: Verificar end-to-end

1. Abre la URL del frontend (ej: `https://tu-proyecto.pages.dev`)
2. Selecciona "Avanza" o "Movilidad"
3. Completa el formulario con un email de prueba
4. Verifica que:
   - La validación de email funciona (GET al Worker)
   - El submit guarda datos (POST al Worker)
   - Aparece el modal de éxito

---

## Troubleshooting

### Error: "database_id not found"
**Causa:** El `database_id` en `wrangler.toml` no es válido o la DB no existe.
**Solución:**
```bash
npx wrangler d1 list
# Verifica que 'encuestas-db' aparezca. Si no, vuelve al Paso 2.
```

### Error: "No such table: encuestas_avanza"
**Causa:** Las migraciones no se aplicaron.
**Solución:**
```bash
npx wrangler d1 migrations apply encuestas-db
```

### Error CORS en el frontend
**Causa:** El Worker no devuelve headers CORS correctos.
**Verificación:**
```bash
curl -I https://encuesta-worker.tu-subdomain.workers.dev/api/v1/encuestas/avanza/email_exists?email=test@test.com
```
Debe incluir `access-control-allow-origin: *`.

Si falta, verifica que `src/index.ts` tenga:
```typescript
app.use('*', cors({ origin: '*', ... }));
```

### Error: "Failed to fetch" en el frontend
**Causa:** El `VITE_API_BASE_URL` apunta a una URL incorrecta.
**Solución:** Verifica que `.env` tenga la URL del Worker (sin barra final).

### Error de TypeScript al build
```bash
cd encuesta-worker && npx tsc --noEmit
cd .. && npm run build.types
```
Ambos deben pasar sin errores antes de deployar.

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npx wrangler dev` | Levanta Worker en modo desarrollo local |
| `npx wrangler tail` | Muestra logs en tiempo real del Worker deployado |
| `npx wrangler d1 execute encuestas-db --command="SELECT * FROM encuestas_avanza;"` | Query directo a D1 |
| `npx wrangler d1 backup create encuestas-db` | Backup manual de la DB |
| `npx wrangler d1 migrations list encuestas-db` | Listar migraciones aplicadas |

---

## URLs de referencia

| Servicio | URL |
|----------|-----|
| Dashboard Cloudflare | https://dash.cloudflare.com |
| Docs Wrangler | https://developers.cloudflare.com/workers/wrangler/ |
| Docs D1 | https://developers.cloudflare.com/d1/ |
| Docs Hono | https://hono.dev/ |

---

*Actualizado: 2026-04-23*
