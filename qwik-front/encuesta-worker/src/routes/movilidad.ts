import { Hono } from 'hono';
import { checkEmailExists, createEncuesta } from '../utils/db';
import { validateEncuesta, validateEmailQuery } from '../utils/validation';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

/**
 * GET /api/v1/encuestas/movilidad/email_exists?email=...
 * Verifica si un email ya fue registrado en la encuesta Movilidad.
 */
app.get('/email_exists', async (c) => {
  const email = c.req.query('email');

  const validation = validateEmailQuery(email);
  if (validation) {
    return c.json({ detail: [validation] }, 400);
  }

  const normalizedEmail = email!.toLowerCase().trim();

  try {
    const exists = await checkEmailExists(c.env.DB, 'encuestas_movilidad', normalizedEmail);
    return c.json({ exists });
  } catch (err) {
    console.error('[Movilidad] Error checking email:', err);
    return c.json({ detail: [{ msg: 'Error interno al verificar email' }] }, 500);
  }
});

/**
 * POST /api/v1/encuestas/movilidad
 * Crea una nueva encuesta en la tabla movilidad.
 */
app.post('/', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ detail: [{ msg: 'Body JSON inválido' }] }, 400);
  }

  const errors = validateEncuesta(body);
  if (errors.length > 0) {
    return c.json({ detail: errors }, 422);
  }

  const normalizedEmail = body.EMAIL.toLowerCase().trim();

  try {
    const exists = await checkEmailExists(c.env.DB, 'encuestas_movilidad', normalizedEmail);
    if (exists) {
      return c.json({ detail: [{ msg: 'Este correo electrónico ya ha sido registrado.' }] }, 409);
    }

    const id = await createEncuesta(c.env.DB, 'encuestas_movilidad', {
      ...body,
      EMAIL: normalizedEmail,
    });

    return c.json({ id, message: 'Encuesta guardada correctamente' }, 201);
  } catch (err) {
    console.error('[Movilidad] Error creating encuesta:', err);
    return c.json({ detail: [{ msg: 'Error interno al guardar la encuesta' }] }, 500);
  }
});

export default app;
