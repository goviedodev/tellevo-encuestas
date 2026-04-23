import { component$, useTask$ } from '@builder.io/qwik';

// Assuming formState structure from the original index.tsx
interface FormState {
  tipoTransporte: string;
  cilindradaMoto: string;
  cilindradaVehiculo: string;
  otroTipoTransporte: string;
  compartirVehiculo: string;
  combustion: string; // Needed for useTask logic
  errors: {
    tipoTransporte: string;
    compartirVehiculo: string; // Added for validation message
    // ... other error fields
  };
  // ... other formState fields
}

interface TransportTypeSectionProps {
  formState: FormState;
}

export default component$((props: TransportTypeSectionProps) => {
  const { formState } = props;

  // Task to set default radio values when sections become visible
  useTask$(({ track }) => {
    track(() => formState.tipoTransporte);

    if (formState.tipoTransporte === 'moto') {
      if (!formState.cilindradaMoto) {
        formState.cilindradaMoto = "menos1000";
      }
    } else {
      // formState.cilindradaMoto = ""; // Clear if not moto (optional)
    }

    if (formState.tipoTransporte === 'vehiculo') {
      if (!formState.cilindradaVehiculo) {
        formState.cilindradaVehiculo = "1000a2000";
      }
      if (!formState.compartirVehiculo) {
        formState.compartirVehiculo = "si";
      }
      // Optional: Set a default for combustion if vehicle is selected and current is "No Aplica"
      // if (formState.combustion === "No Aplica" || !formState.combustion) {
      //   formState.combustion = "Gasolina"; 
      // }
    } else {
      // If not a vehicle, reset vehicle-specific fields
      formState.cilindradaVehiculo = "";
      formState.compartirVehiculo = "";
      formState.combustion = "No Aplica"; // Reset to default if not a vehicle
    }
    
    if (formState.tipoTransporte !== 'moto') {
        formState.cilindradaMoto = ""; // Clear if not moto
    }

    if (formState.tipoTransporte !== 'otro') {
        // formState.otroTipoTransporte = ""; // Clear if not 'otro' (optional)
    }
  });

  const transportOptions = [
    { value: "pie", label: "A pie" },
    { value: "bicicleta", label: "Bicicleta" },
    { value: "moto", label: "Moto" },
    { value: "vehiculo", label: "Vehículo particular" },
    { value: "bus", label: "Bus" },
    { value: "metro", label: "Metro" },
    { value: "didiuber", label: "Didi-Uber-Etc" },
    { value: "scooter", label: "Scooter" },
    { value: "otro", label: "Otro" },
  ];

  const cilindradaOptions = [
    { value: "menos1000", label: "Menos de 1000 cc" },
    { value: "1000a2000", label: "Entre 1000 y 2000 cc" },
    { value: "mas2000", label: "Más de 2000 cc" },
  ];

  const compartirOptions = [
    { value: "si", label: "Sí" },
    { value: "no", label: "No" },
  ];

  return (
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Tipo de Transporte</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Seleccione su medio de transporte principal <span class="text-danger">*</span></label>
          
          {transportOptions.map(opt => (
            <div class="form-check" key={opt.value}>
              <input
                class="form-check-input transport-type"
                type="radio"
                name="tipoTransporte"
                id={`tipo${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}
                value={opt.value}
                required
                checked={formState.tipoTransporte === opt.value}
                onInput$={() => formState.tipoTransporte = opt.value}
              />
              <label class="form-check-label" for={`tipo${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}>{opt.label}</label>
            </div>
          ))}

          {/* Cilindrada Moto */}
          {formState.tipoTransporte === 'moto' && (
            <div id="cilindradaMotoContainer" class="ms-4 mt-2 mb-3">
              <label class="form-label">Cilindrada (Moto):</label>
              {cilindradaOptions.map(opt => (
                <div class="form-check" key={`moto-${opt.value}`}>
                  <input
                    class="form-check-input"
                    type="radio"
                    name="cilindradaMoto"
                    id={`moto${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}
                    value={opt.value}
                    checked={formState.cilindradaMoto === opt.value}
                    onInput$={() => formState.cilindradaMoto = opt.value}
                  />
                  <label class="form-check-label" for={`moto${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}>{opt.label}</label>
                </div>
              ))}
            </div>
          )}

          {/* Cilindrada Vehículo */}
          {formState.tipoTransporte === 'vehiculo' && (
            <div id="cilindradaVehiculoContainer" class="ms-4 mt-2 mb-3">
              <label class="form-label">Cilindrada (Vehículo):</label>
              {cilindradaOptions.map(opt => (
                <div class="form-check" key={`vehiculo-${opt.value}`}>
                  <input
                    class="form-check-input"
                    type="radio"
                    name="cilindradaVehiculo"
                    id={`vehiculo${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}
                    value={opt.value}
                    checked={formState.cilindradaVehiculo === opt.value}
                    onInput$={() => formState.cilindradaVehiculo = opt.value}
                  />
                  <label class="form-check-label" for={`vehiculo${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}>{opt.label}</label>
                </div>
              ))}
            </div>
          )}
          
          {/* Compartir Vehículo */}
          {formState.tipoTransporte === 'vehiculo' && (
            <div id="compartirVehiculoContainer" class="card mb-4">
              <div class="card-header bg-primary text-white">
                <h4 class="mb-0">¿Estarías dispuesto a compartir y ahorrar en este trayecto?</h4>
            </div>
              <div class="card-body">
                {compartirOptions.map(opt => (
                  <div class="form-check" key={`compartir-${opt.value}`}>
                    <input
                      class="form-check-input"
                      type="radio"
                      name="compartirVehiculo"
                      id={`compartir${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}
                      value={opt.value}
                      required={formState.tipoTransporte === 'vehiculo'}
                      checked={formState.compartirVehiculo === opt.value}
                      onInput$={() => formState.compartirVehiculo = opt.value}
                    />
                    <label class="form-check-label" for={`compartir${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}>{opt.label}</label>
                  </div>
                ))}
                {/* Display error for compartirVehiculo if vehicle is selected and no option is chosen */}
                {formState.tipoTransporte === 'vehiculo' && formState.errors.compartirVehiculo && 
                  <div class="invalid-feedback d-block">{formState.errors.compartirVehiculo}</div>}
              </div>
            </div>
          )}

          {/* Otro Tipo de Transporte */}
          {formState.tipoTransporte === 'otro' && (
            <div id="otroTransporteContainer" class="ms-4 mt-2 mb-3">
              <label for="otroTipoTransporteInput" class="form-label">¿Qué otro tipo de Transporte?</label>
              <input
                type="text"
                class="form-control"
                id="otroTipoTransporteInput"
                name="otroTipoTransporte"
                value={formState.otroTipoTransporte}
                onInput$={(e) => formState.otroTipoTransporte = (e.target as HTMLInputElement).value}
              />
            </div>
          )}
          {formState.errors.tipoTransporte && <div class="invalid-feedback d-block">{formState.errors.tipoTransporte}</div>}
          {!formState.errors.tipoTransporte && <div class="invalid-feedback">Por favor seleccione un tipo de transporte.</div>}
        </div>
      </div>
    </div>
  );
});
