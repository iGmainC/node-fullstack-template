import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "zh",
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 10080,
      cookieDomain: globalThis ? globalThis.location.hostname : undefined,
    },
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      backends: [
        LocalStorageBackend, // 先读 localStorage
        HttpBackend          // 再走网络
      ],
      backendOptions: [
        {
          prefix: 'i18next_res_',
          expirationTime: 7 * 24 * 60 * 60 * 1000,
        },
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json'
        }
      ]
    },
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('loaded', (loaded) => {
  console.log('i18n loaded namespaces:', loaded);
});
i18n.on('failedLoading', (lng, ns, err) => {
  console.warn('i18n failedLoading', lng, ns, err);
});
export default i18n;
