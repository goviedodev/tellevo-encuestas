import { component$, useStylesScoped$, type Signal } from '@builder.io/qwik';

interface SuccessModalProps {
  showModal: Signal<boolean>;
  onClose$: () => void;
}

export const STYLES = `
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050; /* Ensure it's above other content */
  }
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
    z-index: 1051;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: 500;
  }
  .modal-body {
    margin-bottom: 15px;
    font-size: 1rem;
    line-height: 1.5;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
    border-top: 1px solid #dee2e6;
  }
  .btn-close-modal {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;

export default component$((props: SuccessModalProps) => {
  useStylesScoped$(STYLES);

  if (!props.showModal.value) {
    return null;
  }

  return (
    <div class="modal-backdrop" onClick$={props.onClose$}>
      <div class="modal-content" onClick$={(event) => event.stopPropagation()}>
        <div class="modal-header">
          <h5 class="modal-title">Información Almacenada</h5>
          <button type="button" class="btn-close" aria-label="Close" onClick$={props.onClose$}></button>
        </div>
        <div class="modal-body">
          <p>
            Gracias por aportar. En Te Llevo, tu información nos permite construir un futuro con menos CO₂, más tiempo para ti y una mejor calidad de vida para todos.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-close-modal" onClick$={props.onClose$}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});
