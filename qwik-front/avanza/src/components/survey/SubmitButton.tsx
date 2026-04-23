import { component$ } from '@builder.io/qwik';

interface FormState {
  isLoading: boolean;
  // Add other relevant parts of formState if needed by the button,
  // though typically only isLoading is directly used for the button's state.
}

interface SubmitButtonProps {
  formState: FormState;
}

export default component$((props: SubmitButtonProps) => {
  const { formState } = props;

  return (
    <div class="form-footer">
      <button type="submit" class="btn btn-primary btn-lg" disabled={formState.isLoading}>
        {formState.isLoading ? (
          <>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="visually-hidden">Cargando...</span>
            {' '}Enviando...
          </>
        ) : (
          "Enviar Información"
        )}
      </button>
    </div>
  );
});
