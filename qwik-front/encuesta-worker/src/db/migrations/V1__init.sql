-- =============================================================================
-- Migración V1: Creación de tablas iniciales
-- =============================================================================

-- Tabla Avanza
CREATE TABLE IF NOT EXISTS encuestas_avanza (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    empresa TEXT NOT NULL,
    tipo_transporte TEXT NOT NULL,
    cilindrada_moto TEXT,
    cilindrada_vehiculo TEXT,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    dias_especificos TEXT NOT NULL,
    otro_tipo_transporte TEXT,
    combustion TEXT NOT NULL DEFAULT 'No Aplica',
    tiempo_trabajo TEXT NOT NULL,
    compartir_vehiculo TEXT,
    origen_latitud REAL,
    origen_longitud REAL,
    destino_latitud REAL,
    destino_longitud REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_avanza_email ON encuestas_avanza(email);
CREATE INDEX IF NOT EXISTS idx_avanza_fecha ON encuestas_avanza(fecha);

-- Tabla Movilidad
CREATE TABLE IF NOT EXISTS encuestas_movilidad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    empresa TEXT NOT NULL,
    tipo_transporte TEXT NOT NULL,
    cilindrada_moto TEXT,
    cilindrada_vehiculo TEXT,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    dias_especificos TEXT NOT NULL,
    otro_tipo_transporte TEXT,
    combustion TEXT NOT NULL DEFAULT 'No Aplica',
    tiempo_trabajo TEXT NOT NULL,
    compartir_vehiculo TEXT,
    origen_latitud REAL,
    origen_longitud REAL,
    destino_latitud REAL,
    destino_longitud REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_movilidad_email ON encuestas_movilidad(email);
CREATE INDEX IF NOT EXISTS idx_movilidad_fecha ON encuestas_movilidad(fecha);
