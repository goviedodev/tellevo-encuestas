import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div class="text-center mb-5">
        <img src="/images/logo-v21.png" alt="Te Llevo" style="height: 100px;" class="mb-3" />
        <h1>Estudio de Movilidad</h1>
        <p class="lead">Selecciona la encuesta que corresponda a tu perfil</p>
      </div>

      <div class="row g-4 justify-content-center w-100" style="max-width: 800px;">
        <div class="col-md-6">
          <Link href="/avanza" class="text-decoration-none">
            <div class="card h-100 shadow-sm text-center p-4 hover-shadow">
              <div class="card-body">
                <h2 class="card-title text-primary mb-3">Avanza</h2>
                <p class="card-text text-muted">
                  Encuesta de movilidad para colaboradores y equipo Avanza.
                </p>
                <span class="btn btn-primary mt-2">Iniciar Encuesta →</span>
              </div>
            </div>
          </Link>
        </div>

        <div class="col-md-6">
          <Link href="/movilidad" class="text-decoration-none">
            <div class="card h-100 shadow-sm text-center p-4 hover-shadow">
              <div class="card-body">
                <h2 class="card-title text-success mb-3">Movilidad</h2>
                <p class="card-text text-muted">
                  Encuesta de movilidad general para Te Llevo App.
                </p>
                <span class="btn btn-success mt-2">Iniciar Encuesta →</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Te Llevo App — Estudio de Movilidad",
  meta: [
    {
      name: "description",
      content: "Selecciona tu encuesta de movilidad",
    },
  ],
};
