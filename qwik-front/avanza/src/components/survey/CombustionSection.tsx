import { component$ } from '@builder.io/qwik';

// Assuming formState structure from the original index.tsx
interface FormState {
  tipoTransporte: string; // Needed for conditional requirement
  combustion: string;
  errors: {
    combustion: string;
    // ... other error fields
  };
  // ... other formState fields
}

interface CombustionSectionProps {
  formState: FormState;
}

export default component$((props: CombustionSectionProps) => {
  const { formState } = props;

  const combustionOptions = [
    { value: "Gasolina", label: "Gasolina" },
    { value: "Híbrido", label: "Híbrido" },
    { value: "Diesel", label: "Diesel" },
    { value: "Eléctrico", label: "Eléctrico" },
    { value: "Desconozco", label: "Desconozco" },
    { value: "No Aplica", label: "No Aplica" }, // Should not be selectable if vehicle is chosen, but kept for consistency
  ];

  return (
    // The entire card's visibility is controlled by the parent (index.tsx)
    // This component just renders the content if it's included.
    <div class="card mb-4"> 
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Combustión</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Tipo de Combustible <span class="text-danger">*</span></label>
          {combustionOptions.map(opt => (
            <div class="form-check" key={`combustion-${opt.value}`}>
              <input
                class="form-check-input"
                type="radio"
                name="combustion"
                id={`combustion${opt.value.replace(/\s+/g, '')}`}
                value={opt.value}
                required={formState.tipoTransporte === 'vehiculo'}
                checked={formState.combustion === opt.value}
                onInput$={() => formState.combustion = opt.value}
                disabled={formState.tipoTransporte !== 'vehiculo' && opt.value !== "No Aplica"} // Disable other options if not vehicle
              />
              <label class="form-check-label" for={`combustion${opt.value.replace(/\s+/g, '')}`}>{opt.label}</label>
            </div>
          ))}
          {formState.errors.combustion && <div class="invalid-feedback d-block">{formState.errors.combustion}</div>}
          {!formState.errors.combustion && formState.tipoTransporte === 'vehiculo' && <div class="invalid-feedback">Por favor seleccione un tipo de combustible.</div>}
        </div>
      </div>
    </div>
  );
});
