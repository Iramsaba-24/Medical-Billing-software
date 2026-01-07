import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '@/translations/en.json';
import knTranslations from '@/translations/kn.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: enTranslations
      },
      kn: {
        translation: knTranslations
      }
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;