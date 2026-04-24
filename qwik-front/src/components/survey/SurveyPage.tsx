import { component$, useStylesScoped$, useStore, $, useSignal } from "@builder.io/qwik";

// Import components
import SuccessModal from "~/components/survey/SuccessModal";
import SurveyHeader from "~/components/survey/SurveyHeader";
import FlashAlert from "~/components/survey/FlashAlert";
import PersonalInfoSection from "~/components/survey/PersonalInfoSection";
import TransportTypeSection from "~/components/survey/TransportTypeSection";
import CombustionSection from "~/components/survey/CombustionSection";
import OriginDestSection from "~/components/survey/OriginDestSection";
import WorkDaysSection from "~/components/survey/WorkDaysSection";
import TravelTimeSection from "~/components/survey/TravelTimeSection";
import SubmitButton from "~/components/survey/SubmitButton";
import type { SurveyConfig } from "~/config/surveys";

// Define styles that were in the <style> tag in the PHP file
const STYLES = `
  .hidden {
    display: none;
  }
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .form-header {
    margin-bottom: 30px;
    text-align: center;
  }
  .form-footer {
    margin-top: 30px;
    text-align: center;
  }
  /* Basic styling for the map placeholder, can be improved */
  #map {
    height: 300px; /* Or any appropriate height */
    background-color: #e9e9e9;
    margin-bottom: 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #666;
  }
`;

interface Props {
  config: SurveyConfig;
}

export default component$<Props>(({ config }) => {
  useStylesScoped$(STYLES);

  const showSuccessModal = useSignal(false);

  const formState = useStore({
    email: "",
    empresa: "",
    tipoTransporte: "pie",
    cilindradaMoto: "",
    cilindradaVehiculo: "",
    otroTipoTransporte: "",
    compartirVehiculo: "",
    combustion: "No Aplica",
    diasEspecificos: [] as string[],
    tiempoTrabajo: "",
    origen: "",
    origenLat: null as number | null,
    origenLng: null as number | null,
    destino: "",
    destinoLat: null as number | null,
    destinoLng: null as number | null,
    isLoading: false,
    errors: {
      email: "",
      empresa: "",
      tipoTransporte: "",
      combustion: "",
      diasEspecificos: "",
      tiempoTrabajo: "",
      origen: "",
      destino: "",
      compartirVehiculo: "",
    }
  });

  const globalAlert = useStore({ message: "", type: "" });
  const apiBaseUrl = config.apiBaseUrl;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_APIKEY;

  const validateForm = $(async () => {
    let isValid = true;
    formState.errors = {
      email: "", empresa: "", tipoTransporte: "", combustion: "",
      diasEspecificos: "", tiempoTrabajo: "", origen: "", destino: "",
      compartirVehiculo: "",
    };

    const postStatement = ' Use minúsculas por favor.';
    if (!formState.email) {
      formState.errors.email = "El correo electrónico es obligatorio."+postStatement;
      isValid = false;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formState.email)) {
      formState.errors.email = "Por favor ingrese un correo electrónico válido."+postStatement;
      isValid = false;
    } else {
      const emailController = new AbortController();
      const emailTimeoutId = setTimeout(() => emailController.abort(), 10000);
      try {
        const emailCheckResponse = await fetch(`${apiBaseUrl}/api/v1/encuestas/${config.id}/email_exists?email=${encodeURIComponent(formState.email)}`, {
          signal: emailController.signal,
        });
        clearTimeout(emailTimeoutId);

        const emailCheckResult = await emailCheckResponse.json();
        if(emailCheckResponse.ok) {
          if (emailCheckResult.exists) {
            formState.errors.email = "Este correo electrónico ya ha sido registrado.";
            isValid = false;
          }
        } else {
          const errEmail = emailCheckResult.detail[0].msg;
          const substring = "period immediately before the @-sign";

          if(errEmail.includes(substring)) {
            formState.errors.email = "Los correos con un punto antes del @ son considerados inválidos, por favor intente con uno diferente.";
          } else {
            formState.errors.email = errEmail;
          }
          isValid = false;
        }
      } catch (err: any) {
        clearTimeout(emailTimeoutId);
        console.error("Error checking email existence:", err);
        if (err.name === 'AbortError') {
          formState.errors.email = "La verificación del correo ha tardado demasiado. Por favor, inténtelo de nuevo.";
        } else {
          if(err.detail) {
            formState.errors.email = err.detail[0].msg;
          } else {
            formState.errors.email = "Tenemos un error desconocido";
          }
        }
      }
    }

    if (!formState.empresa) {
      formState.errors.empresa = "El nombre de la empresa es obligatorio.";
      isValid = false;
    }
    if (!formState.tipoTransporte) {
      formState.errors.tipoTransporte = "Seleccione un tipo de transporte.";
      isValid = false;
    }
    if (formState.tipoTransporte === 'vehiculo' && !formState.combustion) {
      formState.errors.combustion = "Seleccione un tipo de combustible para vehículo.";
      isValid = false;
    }
    if (formState.tipoTransporte === 'vehiculo' && !formState.compartirVehiculo) {
      formState.errors.compartirVehiculo = "Por favor, indique si estaría dispuesto a compartir el vehículo.";
      isValid = false;
    }
    if (!formState.origen) {
        formState.errors.origen = "El origen es obligatorio.";
        isValid = false;
    }
    if (!formState.destino) {
        formState.errors.destino = "El destino es obligatorio.";
        isValid = false;
    }
    if (formState.diasEspecificos.length === 0) {
      formState.errors.diasEspecificos = "Seleccione al menos un día laboral.";
      isValid = false;
    }
    if (!formState.tiempoTrabajo) {
      formState.errors.tiempoTrabajo = "Seleccione el tiempo de trayecto.";
      isValid = false;
    }
    return isValid;
  });

  const handleSubmit = $(async () => {
    globalAlert.message = "";
    formState.isLoading = true;
    const isValid = await validateForm();

    if (!isValid) {
      globalAlert.message = "Por favor corrija los errores en el formulario.";
      globalAlert.type = "danger";
      formState.isLoading = false;
      return;
    }

    const submissionData = {
      FECHA: new Date().toISOString(),
      EMAIL: formState.email,
      EMPRESA: formState.empresa,
      TIPO_TRANSPORTE: formState.tipoTransporte,
      CILINDRADA_MOTO: formState.tipoTransporte === 'moto' ? formState.cilindradaMoto : null,
      CILINDRADA_VEHICULO: formState.tipoTransporte === 'vehiculo' ? formState.cilindradaVehiculo : null,
      ORIGEN: formState.origen,
      DESTINO: formState.destino,
      DIAS_ESPECIFICOS: formState.diasEspecificos.join(', '),
      OTRO_TIPO_TRANSPORTE: formState.tipoTransporte === 'otro' ? formState.otroTipoTransporte : null,
      COMBUSTION: formState.tipoTransporte === 'vehiculo' ? formState.combustion : "No Aplica",
      TIEMPO_TRABAJO: formState.tiempoTrabajo,
      COMPARTIR_VEHICULO: formState.tipoTransporte === 'vehiculo' ? formState.compartirVehiculo : null,
      ORIGEN_LATITUD: formState.origenLat,
      ORIGEN_LONGITUD: formState.origenLng,
      DESTINO_LATITUD: formState.destinoLat,
      DESTINO_LONGITUD: formState.destinoLng,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/encuestas/${config.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        await response.json();
        showSuccessModal.value = true;
        formState.email = "";
        formState.empresa = "";
        formState.tipoTransporte = "pie";
        formState.cilindradaMoto = "";
        formState.cilindradaVehiculo = "";
        formState.otroTipoTransporte = "";
        formState.compartirVehiculo = "";
        formState.combustion = "No Aplica";
        formState.diasEspecificos = [] as string[];
        formState.tiempoTrabajo = "";
        formState.origen = "";
        formState.origenLat = null;
        formState.origenLng = null;
        formState.destino = "";
        formState.destinoLat = null;
        formState.destinoLng = null;
        formState.errors = {
          email: "", empresa: "", tipoTransporte: "", combustion: "",
          diasEspecificos: "", tiempoTrabajo: "", origen: "", destino: "",
          compartirVehiculo: "",
        };
        globalAlert.message = "";
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Error desconocido al enviar." }));
        globalAlert.message = `Error al guardar datos: ${errorData.detail[0].msg || response.statusText}`;
        globalAlert.type = "danger";
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Submit error", error);
      formState.isLoading = false;
      if (error.name === 'AbortError') {
        globalAlert.message = "La solicitud ha tardado demasiado y ha sido cancelada. Por favor, inténtelo de nuevo.";
      } else {
        globalAlert.message = "No se pudo conectar con el servidor. Por favor, verifique su conexión a internet e inténtelo de nuevo.";
      }
      globalAlert.type = "danger";
    } finally {
      if (formState.isLoading) {
        formState.isLoading = false;
      }
    }
  });

  return (
    <div class="container form-container">
      <SurveyHeader config={config} />
      <FlashAlert globalAlert={globalAlert} onClose$={() => globalAlert.message = ""} />
      <SuccessModal showModal={showSuccessModal} onClose$={() => showSuccessModal.value = false} />

      <form class="needs-validation" noValidate preventdefault:submit onSubmit$={handleSubmit}>
        <PersonalInfoSection formState={formState} />
        <OriginDestSection formState={formState} apiKey={apiKey} />
        <TransportTypeSection formState={formState} />
        {formState.tipoTransporte === 'vehiculo' && (
          <CombustionSection formState={formState} />
        )}
        <WorkDaysSection formState={formState} />
        <TravelTimeSection formState={formState} />
        <SubmitButton formState={formState} />
      </form>
    </div>
  );
});
