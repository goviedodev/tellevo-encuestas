import type { D1Database } from '@cloudflare/workers-types';
import type { EncuestaPayload } from '../models/encuesta';

/**
 * Verifica si un email ya existe en una tabla específica.
 */
export async function checkEmailExists(
  db: D1Database,
  tableName: 'encuestas_avanza' | 'encuestas_movilidad',
  email: string
): Promise<boolean> {
  const stmt = db.prepare(`SELECT 1 FROM ${tableName} WHERE email = ? LIMIT 1`);
  const result = await stmt.bind(email).first();
  return result !== null;
}

/**
 * Inserta una nueva encuesta en la tabla indicada.
 * Devuelve el ID generado.
 */
export async function createEncuesta(
  db: D1Database,
  tableName: 'encuestas_avanza' | 'encuestas_movilidad',
  payload: EncuestaPayload
): Promise<number> {
  const stmt = db.prepare(`
    INSERT INTO ${tableName} (
      fecha, email, empresa, tipo_transporte,
      cilindrada_moto, cilindrada_vehiculo,
      origen, destino, dias_especificos,
      otro_tipo_transporte, combustion,
      tiempo_trabajo, compartir_vehiculo,
      origen_latitud, origen_longitud,
      destino_latitud, destino_longitud
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    payload.FECHA,
    payload.EMAIL,
    payload.EMPRESA,
    payload.TIPO_TRANSPORTE,
    payload.CILINDRADA_MOTO ?? null,
    payload.CILINDRADA_VEHICULO ?? null,
    payload.ORIGEN,
    payload.DESTINO,
    payload.DIAS_ESPECIFICOS,
    payload.OTRO_TIPO_TRANSPORTE ?? null,
    payload.COMBUSTION,
    payload.TIEMPO_TRABAJO,
    payload.COMPARTIR_VEHICULO ?? null,
    payload.ORIGEN_LATITUD ?? null,
    payload.ORIGEN_LONGITUD ?? null,
    payload.DESTINO_LATITUD ?? null,
    payload.DESTINO_LONGITUD ?? null
  ).run();

  if (!result.success) {
    throw new Error(`Failed to insert into ${tableName}: ${result.error}`);
  }

  // D1 no devuelve lastRowId directamente en todas las versiones,
  // hacemos un SELECT para obtenerlo.
  const row = await db.prepare(`SELECT id FROM ${tableName} WHERE email = ?`).bind(payload.EMAIL).first<{ id: number }>();
  return row?.id ?? 0;
}
