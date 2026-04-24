import { Hono } from 'hono';
import { cors } from 'hono/cors';
import avanzaRoutes from './routes/avanza';
import movilidadRoutes from './routes/movilidad';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

/**
 * CORS abierto por defecto (regla del proyecto).
 * Permite que cualquier origen consuma la API.
 */
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

/**
 * Health check simple.
 */
app.get('/', (c) => {
  return c.json({
    service: 'encuesta-worker',
    status: 'ok',
    version: '1.0.0',
    endpoints: [
      'GET  /api/v1/encuestas/avanza/email_exists?email=',
      'POST /api/v1/encuestas/avanza',
      'GET  /api/v1/encuestas/movilidad/email_exists?email=',
      'POST /api/v1/encuestas/movilidad',
    ],
  });
});

/**
 * Rutas específicas por encuesta.
 * Cada una opera sobre su propia tabla D1.
 */
app.route('/api/v1/encuestas/avanza', avanzaRoutes);
app.route('/api/v1/encuestas/movilidad', movilidadRoutes);

export default app;
