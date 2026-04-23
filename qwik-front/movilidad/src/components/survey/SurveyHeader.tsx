import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="form-header mb-2">
      <h1 class="d-flex align-items-center justify-content-center gap-4">
        {/* Paths will be relative to the public folder */}
        <img src="/images/iconno.png" alt="Car Icon" style="height: 88px;" />
        <span class="text-center">Estudio Movilidad Te Llevo App</span>
        <img src="/images/logo-v21.png" alt="Logo TeLlevo" style="height: 80px;" />
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
