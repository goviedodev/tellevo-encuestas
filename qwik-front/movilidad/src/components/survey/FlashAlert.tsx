import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

interface GlobalAlertStore {
  message: string;
  type: string;
}

interface FlashAlertProps {
  globalAlert: GlobalAlertStore;
  onClose$: PropFunction<() => void>;
}

export default component$((props: FlashAlertProps) => {
  const { globalAlert, onClose$ } = props;

  return (
    <>
      {globalAlert.message && (
        <div class={`alert alert-${globalAlert.type} alert-dismissible fade show`} role="alert">
          {globalAlert.message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick$={onClose$}></button>
        </div>
      )}
    </>
  );
});
