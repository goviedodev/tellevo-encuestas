/**
 * Headers CORS configurados según regla del proyecto: ABIERTOS por defecto.
 * Esto permite que el frontend Qwik (desplegado en Cloudflare Pages)
 * pueda consumir la API sin restricciones de origen.
 */
export function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  const cors = getCorsHeaders();
  Object.entries(cors).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
