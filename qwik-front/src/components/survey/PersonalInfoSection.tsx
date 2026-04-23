import { component$ } from '@builder.io/qwik';

// Assuming formState structure from the original index.tsx
interface FormState {
  email: string;
  empresa: string;
  errors: {
    email: string;
    empresa: string;
    // ... other error fields
  };
  // ... other formState fields
}

interface PersonalInfoSectionProps {
  formState: FormState;
}

export default component$((props: PersonalInfoSectionProps) => {
  const { formState } = props;

  return (
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Información Personal</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
          <input
            type="email"
            class={`form-control ${formState.errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            required
            value={formState.email}
            onInput$={(e) => formState.email = (e.target as HTMLInputElement).value}
          />
          {formState.errors.email && <div class="invalid-feedback">{formState.errors.email}</div>}
          {!formState.errors.email && <div class="invalid-feedback">Por favor ingrese un correo electrónico válido.</div>}
        </div>
        <div class="mb-3">
          <label for="empresa" class="form-label">Nombre de empresa donde trabajas <span class="text-danger">*</span></label>
          <input
            type="text"
            class={`form-control ${formState.errors.empresa ? 'is-invalid' : ''}`}
            id="empresa"
            name="empresa"
            required
            value={formState.empresa}
            onInput$={(e) => formState.empresa = (e.target as HTMLInputElement).value}
          />
          {formState.errors.empresa && <div class="invalid-feedback">{formState.errors.empresa}</div>}
          {!formState.errors.empresa && <div class="invalid-feedback">Por favor ingrese el nombre de la empresa.</div>}
        </div>
      </div>
    </div>
  );
});
