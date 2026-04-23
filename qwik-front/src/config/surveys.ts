export interface SurveyConfig {
  id: string;
  title: string;
  metaDescription: string;
  apiBaseUrl: string;
  logoSrc: string;
  logoAlt: string;
  headline?: string;
}

export const avanzaConfig: SurveyConfig = {
  id: "avanza",
  title: "Encuesta de Movilidad — Avanza",
  metaDescription: "Encuesta de movilidad para colaboradores Avanza",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  logoSrc: "/images/logo-v21.png",
  logoAlt: "Logo Avanza",
};

export const movilidadConfig: SurveyConfig = {
  id: "movilidad",
  title: "Encuesta de Movilidad — Te Llevo App",
  metaDescription: "Encuesta de movilidad para Te Llevo App",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
  logoSrc: "/images/logo-v21.png",
  logoAlt: "Logo TeLlevo",
};
