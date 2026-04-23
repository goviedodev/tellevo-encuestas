import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import SurveyPage from "~/components/survey/SurveyPage";
import { movilidadConfig } from "~/config/surveys";

export default component$(() => {
  return <SurveyPage config={movilidadConfig} />;
});

export const head: DocumentHead = {
  title: movilidadConfig.title,
  meta: [
    {
      name: "description",
      content: movilidadConfig.metaDescription,
    },
  ],
};
