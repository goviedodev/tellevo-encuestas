import { component$ } from '@builder.io/qwik';

// Assuming formState structure from the original index.tsx
interface FormState {
  tiempoTrabajo: string;
  errors: {
    tiempoTrabajo: string;
    // ... other error fields
  };
  // ... other formState fields
}

interface TravelTimeSectionProps {
  formState: FormState;
}

export default component$((props: TravelTimeSectionProps) => {
  const { formState } = props;

  const travelTimeOptions = [
    { value: "-15min", label: "Menos de 15 minutos" },
    { value: "15-30min", label: "15-30 min" },
    { value: "31-60min", label: "31-60 min" },
    { value: "mas1Hora", label: "Mas de 1 hora" },
  ];

  return (
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Tiempo de Viaje</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">¿Cuánto tardas en llegar a tu trabajo? <span class="text-danger">*</span></label>
          {travelTimeOptions.map(opt => (
            <div class="form-check" key={`tiempo-${opt.value}`}>
              <input
                class="form-check-input"
                type="radio"
                name="tiempoTrabajo"
                id={`tiempo${opt.value.replace(/[^a-zA-Z0-9]/g, '')}`} // Sanitize ID
                value={opt.value}
                required
                checked={formState.tiempoTrabajo === opt.value}
                onInput$={() => formState.tiempoTrabajo = opt.value}
              />
              <label class="form-check-label" for={`tiempo${opt.value.replace(/[^a-zA-Z0-9]/g, '')}`}>{opt.label}</label>
            </div>
          ))}
          {formState.errors.tiempoTrabajo && <div class="invalid-feedback d-block">{formState.errors.tiempoTrabajo}</div>}
          {!formState.errors.tiempoTrabajo && <div class="invalid-feedback">Por favor seleccione tiempo de trayecto.</div>}
        </div>
      </div>
    </div>
  );
});
