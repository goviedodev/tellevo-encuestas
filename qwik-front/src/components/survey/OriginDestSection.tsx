import { component$, useVisibleTask$, $ } from "@builder.io/qwik";

// Assuming formState structure from the original index.tsx
interface FormState {
  origen: string;
  origenLat: number | null;
  origenLng: number | null;
  destino: string;
  destinoLat: number | null;
  destinoLng: number | null;
  errors: {
    origen: string;
    destino: string;
    // ... other error fields
  };
  // ... other formState fields
}

interface OriginDestSectionProps {
  formState: FormState;
  apiKey: string;
  surveyId?: string;
}

export default component$((props: OriginDestSectionProps) => {
  const { formState, apiKey } = props;

  useVisibleTask$(
    ({ cleanup }) => {
      let script: HTMLScriptElement | null = null;
      const loadGoogleMaps = () => {
        if ((window as any).google && (window as any).google.maps) {
          initializeAutocomplete();
          return;
        }
        script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocompleteCallback`;
        script.async = true;
        script.defer = true;
        (window as any).initAutocompleteCallback = initializeAutocomplete; // Make it callable from global scope
        document.head.appendChild(script);
      };

      const initializeAutocomplete = $(() => {
        if (
          !(window as any).google ||
          !(window as any).google.maps ||
          !(window as any).google.maps.places
        ) {
          console.error("Google Maps Places library not loaded.");
          return;
        }
        const origenInput = document.getElementById(
          "autocomplete_search",
        ) as HTMLInputElement | null;
        const destinoInput = document.getElementById(
          "autocomplete_search2",
        ) as HTMLInputElement | null;

        const options = {
          componentRestrictions: { country: "CL" }, // Restringir a Chile
          types: ["address"],
        };

        if (origenInput) {
          const autocompleteOrigen = new (
            window as any
          ).google.maps.places.Autocomplete(origenInput, options);
          autocompleteOrigen.addListener("place_changed", () => {
            const place = autocompleteOrigen.getPlace();
            if (place.geometry && place.geometry.location) {
              const hasStreetNumber = place.address_components?.some(
                (component: any) => component.types.includes("street_number"),
              );
              if (!hasStreetNumber) {
                formState.errors.origen =
                  "La dirección debe incluir el número de calle.";
                formState.origenLat = null;
                formState.origenLng = null;
                return;
              }
              formState.origen = place.formatted_address;
              formState.origenLat = place.geometry.location.lat();
              formState.origenLng = place.geometry.location.lng();
              formState.errors.origen = ""; // Clear error if valid
            } else {
              // If no geometry, clear lat/lng but keep text if user typed something not in Places
              // formState.origen = origenInput.value; // Already set by onInput$
              formState.origenLat = null;
              formState.origenLng = null;
            }
          });
        }

        if (destinoInput) {
          const autocompleteDestino = new (
            window as any
          ).google.maps.places.Autocomplete(destinoInput, options);
          autocompleteDestino.addListener("place_changed", () => {
            const place = autocompleteDestino.getPlace();
            if (place.geometry && place.geometry.location) {
              const hasStreetNumber = place.address_components?.some(
                (component: any) => component.types.includes("street_number"),
              );
              if (!hasStreetNumber) {
                formState.errors.destino =
                  "La dirección debe incluir el número de calle.";
                formState.destinoLat = null;
                formState.destinoLng = null;
                return;
              }
              formState.destino = place.formatted_address;
              formState.destinoLat = place.geometry.location.lat();
              formState.destinoLng = place.geometry.location.lng();
              formState.errors.destino = ""; // Clear error if valid
            } else {
              // formState.destino = destinoInput.value; // Already set by onInput$
              formState.destinoLat = null;
              formState.destinoLng = null;
            }
          });
        }
      });

      loadGoogleMaps();

      cleanup(() => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any).initAutocompleteCallback;
      });
    },
    { strategy: "document-ready" },
  );

  return (
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Origen y Destino</h4>
        <p class="small text-warning mb-0">
          (Por favor, ingrese su dirección completa, incluido el número, para asignar correctamente conductores y pasajeros. Estos datos son confidenciales y solo los gestiona el equipo de Te Llevo bajo estrictas políticas de privacidad.)
        </p>
      </div>
      <div class="card-body">
        <div id="custom-search-input" class="mb-3">
          <div class="input-group">
            <input
              id="autocomplete_search"
              name="origen"
              type="text"
              class={`form-control ${formState.errors.origen ? "is-invalid" : ""}`}
              placeholder="Origen"
              value={formState.origen}
              onInput$={(e) => {
                formState.origen = (e.target as HTMLInputElement).value;
                // If user types manually after selecting a place, lat/lng might become stale.
                // Consider clearing lat/lng here or on blur if value differs from selected place.
                // For now, we rely on place_changed to update lat/lng.
                // If they type and don't select, lat/lng will be from previous selection or null.
              }}
            />
          </div>
          {formState.errors.origen && (
            <div class="invalid-feedback d-block">
              {formState.errors.origen}
            </div>
          )}
        </div>
        <div id="custom-search-input-2" class="mb-3">
          <div class="input-group">
            <input
              id="autocomplete_search2"
              name="destino"
              type="text"
              class={`form-control ${formState.errors.destino ? "is-invalid" : ""}`}
              placeholder="Destino"
              value={formState.destino}
              onInput$={(e) => {
                formState.destino = (e.target as HTMLInputElement).value;
                // Clear coordinates if user types manually
                const limiteDireccion = props.surveyId === 'avanza'
                  ? "C. Limache 1985, 2520558 Valparaíso, Viña del Mar, Valparaíso"
                  : "C. Limache 3405, Viña del Mar, Valparaíso";
                if (formState.destino !== limiteDireccion) {
                  formState.destinoLat = null;
                  formState.destinoLng = null;
                }
              }}
            />
          </div>
          <div class="input-group-text">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="checkbox"
                id="epucvCheckbox"
                checked={
                  props.surveyId === 'avanza'
                    ? formState.destino === "C. Limache 1985, 2520558 Valparaíso, Viña del Mar, Valparaíso"
                    : formState.destino === "C. Limache 3405, Viña del Mar, Valparaíso"
                }
                onChange$={(e) => {
                  const checked = (e.target as HTMLInputElement).checked;
                  if (checked) {
                    if (props.surveyId === 'avanza') {
                      formState.destino = "C. Limache 1985, 2520558 Valparaíso, Viña del Mar, Valparaíso";
                      formState.destinoLat = -33.04284;
                      formState.destinoLng = -71.51676;
                    } else {
                      formState.destino = "C. Limache 3405, Viña del Mar, Valparaíso";
                      formState.destinoLat = -33.04284;
                      formState.destinoLng = -71.51676;
                    }
                  } else {
                    formState.destino = "";
                    formState.destinoLat = null;
                    formState.destinoLng = null;
                  }
                }}
              />
              <label class="form-check-label" for="epucvCheckbox">
                Comunidad el Salto
              </label>
            </div>
          </div>
          {formState.errors.destino && (
            <div class="invalid-feedback d-block">
              {formState.errors.destino}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
