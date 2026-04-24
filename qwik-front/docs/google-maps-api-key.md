# Google Maps API Key — Referencia de Seguridad

> **Resumen:** La API key de Google Places se inyecta en el bundle del frontend. Esto la expone públicamente, por lo que **es obligatorio** configurar restricciones de dominio en Google Cloud Console.

---

## 1. Origen de la API Key

La key se define en el archivo de entorno de la raíz del proyecto:

**Archivo:** `.env` (raíz del proyecto Qwik)
```bash
VITE_GOOGLE_MAPS_APIKEY=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40
```

### ¿Por qué empieza con `VITE_`?
Vite solo expone al cliente las variables que comienzan con `VITE_`. Al hacer `import.meta.env.VITE_GOOGLE_MAPS_APIKEY`, Vite reemplaza esa expresión por el valor literal durante el build.

---

## 2. Flujo en el código

| Paso | Archivo | Detalle |
|------|---------|---------|
| **Lectura** | `src/components/survey/SurveyPage.tsx:90` | `const apiKey = import.meta.env.VITE_GOOGLE_MAPS_APIKEY` |
| **Paso a hijo** | `src/components/survey/SurveyPage.tsx` | Se pasa como prop `apiKey` a `<OriginDestSection>` |
| **Inyección** | `src/components/survey/OriginDestSection.tsx:36` | Crea dinámicamente un `<script>` con la URL de Google Maps API |

**URL generada:**
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40&libraries=places&callback=initAutocompleteCallback
```

---

## 3. Riesgo de seguridad

### La key queda expuesta en el bundle
Durante `npm run build`, Vite reemplaza `import.meta.env.VITE_GOOGLE_MAPS_APIKEY` por el string literal de la key. El resultado final es:

```javascript
// En dist/build/q-XXXXX.js (código minificado de producción)
script.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40&libraries=places&callback=initAutocompleteCallback"
```

### Implicaciones
- Cualquier usuario puede inspeccionar el código fuente (DevTools → Sources → Network) y ver la key.
- Sin restricciones de dominio, cualquier sitio web puede usar tu key y consumir tu cuota de Google Maps.
- Google cobra por uso después del free tier. Una key expuesta puede generar costos inesperados.

---

## 4. Mitigación obligatoria: Restricciones de dominio

Debes configurar la key para que solo funcione en los dominios oficiales del proyecto.

### Pasos en Google Cloud Console

1. Ir a [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Buscar la key: `AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40`
3. Click en "Editar" (lápiz)
4. En **"Application restrictions"**, seleccionar: `HTTP referrers (web sites)`
5. En **"Website restrictions"**, agregar estos dominios:
   ```
   encuesta-movilidad.pages.dev/*
   *.encuesta-movilidad.pages.dev/*
   ```
   *(Agrega también cualquier dominio personalizado que uses en producción)*
6. En **"API restrictions"**, seleccionar:
   - `Maps JavaScript API`
   - `Places API`
7. Guardar cambios. La restricción tarda ~5 minutos en propagarse.

---

## 5. Rotación de la key (si fue comprometida)

Si detectas uso no autorizado de la key:

1. En Google Cloud Console, ve a la misma key (`AIzaSyDzPh8jhXNP1fHcHJhch8QTutTbdmCai40`)
2. Click en el ícono de **regenerar** (flechas circulares) o "Delete" y crea una nueva.
3. Copia la nueva key.
4. Actualiza el archivo `.env`:
   ```bash
   VITE_GOOGLE_MAPS_APIKEY=AIzaSyNUEVA_KEY_AQUI
   ```
5. Rebuild y redeploy:
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

---

## 6. Alternativas futuras (mejores prácticas)

### Opción A: Proxy a través del Worker
En lugar de exponer la key en el frontend, el frontend llamaría a un endpoint del Worker (ej: `GET /api/maps/autocomplete?q=query`) y el Worker haría la petición a Google Maps usando la key de forma segura (almacenada como secret de Cloudflare).

**Pros:** Key 100% oculta del cliente.
**Contras:** Requiere reescribir el componente `OriginDestSection.tsx` para usar un proxy en vez de la API de Google Maps directamente.

### Opción B: Secret de Cloudflare (solo para server-side)
Si en algún momento el backend necesita geocodificación, la key debería almacenarse como:
```bash
npx wrangler secret put GOOGLE_MAPS_API_KEY
```
Y leerse en el Worker con:
```typescript
const apiKey = c.env.GOOGLE_MAPS_API_KEY;
```

**Nota:** Esto no aplica al frontend porque el navegador necesita cargar el script de Google Maps directamente.

---

## Referencias

- [Google Cloud: Restricting API keys](https://cloudflare.com/workers-secrets) *(corregir a URL real de Google)*
- [Vite: Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Workers: Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

---

*Actualizado: 2026-04-23*
