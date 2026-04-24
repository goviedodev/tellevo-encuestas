import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { SurveyConfig } from '~/config/surveys';

interface Props {
  config: SurveyConfig;
}

export default component$<Props>(({ config }) => {
  const surveyCount = useSignal<number | null>(null);

  useVisibleTask$(({ cleanup }) => {
    const fetchCount = async () => {
      if (config.id === 'avanza') {
        try {
          const res = await fetch(`${config.apiBaseUrl}/api/v1/encuestas/avanza/count`);
          const data = await res.json();
          surveyCount.value = data.count;
        } catch (e) {
          console.error('Error fetching count:', e);
        }
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 120000); // 2 minutos

    cleanup(() => clearInterval(interval));
  });

  return (
    <div class="form-header mb-2">
      <h1 class="d-flex align-items-center justify-content-center gap-4">
        {/* Paths will be relative to the public folder */}
        <div class="text-center">
          <img src="/images/iconno.png" alt="Car Icon" style="height: 88px;" />
          {config.id === 'avanza' && surveyCount.value !== null && (
            <div class="mt-1">
              <span class="badge bg-success" style="font-size: 12px;">
                {surveyCount.value} OK
              </span>
            </div>
          )}
        </div>
        <span class="text-center">
          {config.id === 'avanza' ? (
            <>
              <div>Encuesta de Movilidad</div>
              <div style={{ fontWeight: 'bold' }}>Avanza Inclusión</div>
            </>
          ) : (
            config.title
          )}
        </span>
        <div class="text-center">
          <img src={config.logoSrc} alt={config.logoAlt} style="height: 80px;" />
          {config.id === 'avanza' && (
            <div
              class="mt-1"
              style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c5d2c' }}
              dangerouslySetInnerHTML="INCLUSION<br/>Avanzando hacia una sociedad más inclusiva"
            />
          )}
        </div>
      </h1>
      <div class="d-flex align-items-center justify-content-center">
        <svg width="auto" height="28" style="margin-right: 8px; vertical-align: middle;">
          <image href="https://static.vecteezy.com/system/resources/previews/000/552/191/large_2x/green-leaf-vector-icon.jpg" x="0" y="0" height="28" width="28" />
        </svg>
        <p class="lead mb-0 text-center" style="vertical-align: middle;">Completa esta información y descubre <i>cuánto CO₂</i> genera tu viaje diario al trabajo y cómo podrías reducirlo.</p>
        <svg width="auto" height="28" style="margin-left: 8px; vertical-align: middle; transform: scaleX(-1);">
          <image href="https://static.vecteezy.com/system/resources/previews/000/552/191/large_2x/green-leaf-vector-icon.jpg" x="0" y="0" height="28" width="28" />
        </svg>
      </div>
    </div>
  );
});
