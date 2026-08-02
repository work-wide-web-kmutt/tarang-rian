import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enJSON from "@/locales/en/translation.json";
import thJSON from "@/locales/th/translation.json";

// oxlint-disable-next-line import/no-named-as-default-member -- use i18next singleton to initialize application translations
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      // React already escapes interpolated values.
      escapeValue: false,
    },
    resources: {
      en: { ...enJSON },
      th: { ...thJSON },
    },
  });
