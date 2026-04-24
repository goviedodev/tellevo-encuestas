import { Hono } from 'hono';
import { checkEmailExists, createEncuesta } from '../utils/db';
import { validateEncuesta, validateEmailQuery } from '../utils/validation';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/v1/encuestas/avanza/count
 * Retorna el número de encuestas registradas.
 */
app.get('/count', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM encuestas_avanza'
    ).first<{ count: number }>();
    return c.json({ count: result?.count || 0 });
  } catch (err) {
    console.error('[Avanza] Error counting:', err);
    return c.json({ count: 0 });
  }
});

/**
 * GET /api/v1/encuestas/avanza/email_exists?email=...
 * Verifica si un email ya fue registrado en la encuesta Avanza.
 */
app.get('/email_exists', async (c) => {
  const email = c.req.query('email');

  const validation = validateEmailQuery(email);
  if (validation) {
    return c.json({ detail: [validation] }, 400);
  }

  // Extra safety: el email puede venir con mayúsculas desde el frontend
  const normalizedEmail = email!.toLowerCase().trim();

  try {
    const exists = await checkEmailExists(c.env.DB, 'encuestas_avanza', normalizedEmail);
    return c.json({ exists });
  } catch (err) {
    console.error('[Avanza] Error checking email:', err);
    return c.json({ detail: [{ msg: 'Error interno al verificar email' }] }, 500);
  }
});

/**
 * POST /api/v1/encuestas/avanza
 * Crea una nueva encuesta en la tabla avanza.
 */
app.post('/', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ detail: [{ msg: 'Body JSON inválido' }] }, 400);
  }

  // Validar campos obligatorios
  const errors = validateEncuesta(body);
  if (errors.length > 0) {
    return c.json({ detail: errors }, 422);
  }

  const normalizedEmail = body.EMAIL.toLowerCase().trim();

  try {
    // Verificar duplicado
    const exists = await checkEmailExists(c.env.DB, 'encuestas_avanza', normalizedEmail);
    if (exists) {
      return c.json({ detail: [{ msg: 'Este correo electrónico ya ha sido registrado.' }] }, 409);
    }

    // Insertar
    const id = await createEncuesta(c.env.DB, 'encuestas_avanza', {
      ...body,
      EMAIL: normalizedEmail,
    });

    return c.json({ id, message: 'Encuesta guardada correctamente' }, 201);
  } catch (err) {
    console.error('[Avanza] Error creating encuesta:', err);
    return c.json({ detail: [{ msg: 'Error interno al guardar la encuesta' }] }, 500);
  }
});

export default app;
