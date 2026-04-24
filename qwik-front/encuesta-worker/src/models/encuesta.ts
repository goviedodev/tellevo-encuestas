/**
 * Modelo de datos de una encuesta de movilidad.
 * Se usa tanto para Avanza como para Movilidad (mismo schema, tablas separadas).
 */
export interface EncuestaPayload {
  FECHA: string;              // ISO8601
  EMAIL: string;
  EMPRESA: string;
  TIPO_TRANSPORTE: string;
  CILINDRADA_MOTO: string | null;
  CILINDRADA_VEHICULO: string | null;
  ORIGEN: string;
  DESTINO: string;
  DIAS_ESPECIFICOS: string;   // Comma-separated
  OTRO_TIPO_TRANSPORTE: string | null;
  COMBUSTION: string;
  TIEMPO_TRABAJO: string;
  COMPARTIR_VEHICULO: string | null;
  ORIGEN_LATITUD: number | null;
  ORIGEN_LONGITUD: number | null;
  DESTINO_LATITUD: number | null;
  DESTINO_LONGITUD: number | null;
}

export interface EncuestaRecord extends EncuestaPayload {
  id: number;
  created_at: string;
}
