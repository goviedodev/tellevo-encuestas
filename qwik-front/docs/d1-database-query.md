# Consultas a la Base de Datos D1

Este documento describe cómo consultar y administrar la base de datos D1 para las encuestas de movilidad.

---

## Información de la Base de Datos

| Campo | Valor |
|-------|-------|
| **Nombre** | `encuestas-db` |
| **ID** | `6e607791-0067-4b87-977d-b7c024d72fde` |
| **Binding en Worker** | `DB` |

---

## Tablas Disponibles

| Tabla | Descripción |
|-------|-------------|
| `encuestas_avanza` | Respuestas de la encuesta "Avanza" |
| `encuestas_movilidad` | Respuestas de la encuesta "Movilidad" |

---

## Consultas con Wrangler CLI

### Ubicación del proyecto Worker

```bash
cd /home/goviedo/proyectos/tellevo/oficiales/encuesta-movilidad/qwik-front/encuesta-worker
```

### Ver todos los registros

```bash
# Encuesta Avanza
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_avanza" --remote

# Encuesta Movilidad
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_movilidad" --remote
```

### Ver los últimos registros

```bash
# Avanza - últimos 10
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_avanza ORDER BY created_at DESC LIMIT 10" --remote

# Movilidad - últimos 10
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_movilidad ORDER BY created_at DESC LIMIT 10" --remote
```

### Contar registros

```bash
# Contar todos en Avanza
npx wrangler d1 execute encuestas-db --command "SELECT COUNT(*) as total FROM encuestas_avanza" --remote

# Contar todos en Movilidad
npx wrangler d1 execute encuestas-db --command "SELECT COUNT(*) as total FROM encuestas_movilidad" --remote
```

### Ver estructura de la tabla

```bash
npx wrangler d1 execute encuestas-db --command ".schema encuestas_avanza" --remote
```

### Consultas específicas

```bash
# Buscar por email específico
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_avanza WHERE email = 'correo@ejemplo.cl'" --remote

# Ver registros de hoy
npx wrangler d1 execute encuestas-db --command "SELECT * FROM encuestas_avanza WHERE DATE(fecha) = DATE('now')" --remote

# Ver registros por empresa
npx wrizarro d1 execute encuestas-db --command "SELECT empresa, COUNT(*) as total FROM encuestas_avanza GROUP BY empresa" --remote
```

---

## Verificar datos via API

También puedes verificar si un email ya fue registrado usando la API del Worker:

```bash
# Reemplaza con el email a verificar
curl "https://encuesta-worker.desarrollo-501.workers.dev/api/v1/encuestas/avanza/email_exists?email=tucorreo@ejemplo.cl"
```

**Respuesta esperada:**
- Si existe: `{"exists":true}`
- Si no existe: `{"exists":false}`

---

## Schemas de las tablas

### encuestas_avanza / encuestas_movilidad

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | ID autoincremental |
| `fecha` | TEXT | Fecha ISO8601 |
| `email` | TEXT UNIQUE | Email normalizado a lowercase |
| `empresa` | TEXT | Nombre de la empresa |
| `tipo_transporte` | TEXT | Tipo de transporte (pie, bicicleta, moto, vehiculo, transporte_publico, otro) |
| `cilindrada_moto` | TEXT | Cilindrada moto (nullable) |
| `cilindrada_vehiculo` | TEXT | Cilindrada vehículo (nullable) |
| `origen` | TEXT | Dirección de origen |
| `destino` | TEXT | Dirección de destino |
| `dias_especificos` | TEXT | Días laborales (comma-separated) |
| `otro_tipo_transporte` | TEXT | Otro tipo si aplica (nullable) |
| `combustion` | TEXT | Tipo combustible |
| `tiempo_trabajo` | TEXT | Tiempo de trayecto |
| `compartir_vehiculo` | TEXT | Si comparte vehículo (nullable) |
| `origen_latitud` | REAL | Latitud origen |
| `origen_longitud` | REAL | Longitud origen |
| `destino_latitud` | REAL | Latitud destino |
| `destino_longitud` | REAL | Longitud destino |
| `created_at` | DATETIME | Fecha de creación |

---

## ⚠️ Notas Importantes

1. **Wrangler debe estar autenticado**: Asegúrate de estar logueado con `wrangler auth login`
2. **Considera limitar resultados**: En tablas grandes, usa `LIMIT` para evitarTimeouts
3. **Datos sensibles**: Los datos de ubicación son confidenciales - maneja con cuidado

---

## Links Relacionados

- [Deploy Guide](../DEPLOY.md)
- [Google Maps API Key](google-maps-api-key.md)
- [AGENTS.md](../AGENTS.md)