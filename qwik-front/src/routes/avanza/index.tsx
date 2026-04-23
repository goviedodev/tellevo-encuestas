import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import SurveyPage from "~/components/survey/SurveyPage";
import { avanzaConfig } from "~/config/surveys";

export default component$(() => {
  return <SurveyPage config={avanzaConfig} />;
});

export const head: DocumentHead = {
  title: avanzaConfig.title,
  meta: [
    {
      name: "description",
      content: avanzaConfig.metaDescription,
    },
  ],
};
