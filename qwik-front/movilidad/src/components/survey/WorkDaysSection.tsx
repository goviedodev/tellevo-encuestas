import { component$, $ } from '@builder.io/qwik';

// Assuming formState structure from the original index.tsx
interface FormState {
  diasEspecificos: string[];
  errors: {
    diasEspecificos: string;
    // ... other error fields
  };
  // ... other formState fields
}

interface WorkDaysSectionProps {
  formState: FormState;
}

export default component$((props: WorkDaysSectionProps) => {
  const { formState } = props;

  const workDayOptions = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sabado", label: "Sábado" },
  ];

  const handleChange = $((dayValue: string, checked: boolean) => {
    if (checked) {
      formState.diasEspecificos = [...formState.diasEspecificos, dayValue];
    } else {
      formState.diasEspecificos = formState.diasEspecificos.filter(day => day !== dayValue);
    }
  });

  return (
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Días Laborales</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Seleccione los días que va al trabajo: <span class="text-danger">*</span></label>
          {workDayOptions.map(opt => (
            <div class="form-check" key={`dia-${opt.value}`}>
              <input
                class="form-check-input"
                type="checkbox"
                name="diasEspecificos[]" // Name indicates array in HTML forms
                id={`dia${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}
                value={opt.value}
                checked={formState.diasEspecificos.includes(opt.value)}
                onChange$={(e) => {
                  const target = e.target as HTMLInputElement;
                  handleChange(opt.value, target.checked);
                }}
              />
              <label class="form-check-label" for={`dia${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`}>{opt.label}</label>
            </div>
          ))}
          {formState.errors.diasEspecificos && <div class="invalid-feedback d-block">{formState.errors.diasEspecificos}</div>}
        </div>
      </div>
    </div>
  );
});
