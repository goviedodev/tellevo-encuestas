import type { EncuestaPayload } from '../models/encuesta';

export interface ValidationError {
  msg: string;
}

/**
 * Valida los campos obligatorios del payload de encuesta.
 * Devuelve un array de errores compatibles con el formato que espera el frontend.
 */
export function validateEncuesta(body: Partial<EncuestaPayload>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.EMAIL || body.EMAIL.trim() === '') {
    errors.push({ msg: 'El correo electrónico es obligatorio. Use minúsculas por favor.' });
  } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(body.EMAIL)) {
    errors.push({ msg: 'Por favor ingrese un correo electrónico válido. Use minúsculas por favor.' });
  }

  if (!body.EMPRESA || body.EMPRESA.trim() === '') {
    errors.push({ msg: 'El nombre de la empresa es obligatorio.' });
  }

  if (!body.TIPO_TRANSPORTE || body.TIPO_TRANSPORTE.trim() === '') {
    errors.push({ msg: 'Seleccione un tipo de transporte.' });
  }

  if (body.TIPO_TRANSPORTE === 'vehiculo' && (!body.COMBUSTION || body.COMBUSTION.trim() === '')) {
    errors.push({ msg: 'Seleccione un tipo de combustible para vehículo.' });
  }

  if (body.TIPO_TRANSPORTE === 'vehiculo' && (!body.COMPARTIR_VEHICULO || body.COMPARTIR_VEHICULO.trim() === '')) {
    errors.push({ msg: 'Por favor, indique si estaría dispuesto a compartir el vehículo.' });
  }

  if (!body.ORIGEN || body.ORIGEN.trim() === '') {
    errors.push({ msg: 'El origen es obligatorio.' });
  }

  if (!body.DESTINO || body.DESTINO.trim() === '') {
    errors.push({ msg: 'El destino es obligatorio.' });
  }

  if (!body.DIAS_ESPECIFICOS || body.DIAS_ESPECIFICOS.trim() === '') {
    errors.push({ msg: 'Seleccione al menos un día laboral.' });
  }

  if (!body.TIEMPO_TRABAJO || body.TIEMPO_TRABAJO.trim() === '') {
    errors.push({ msg: 'Seleccione el tiempo de trayecto.' });
  }

  return errors;
}

/**
 * Valida un email individual para el endpoint email_exists.
 */
export function validateEmailQuery(email?: string): ValidationError | null {
  if (!email || email.trim() === '') {
    return { msg: 'Email requerido' };
  }
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    return { msg: 'Formato de email inválido' };
  }
  return null;
}
