import { useState, useEffect } from 'react';
import type { Language, Translations } from '../types';
import enTranslations from './en.json';
import esTranslations from './es.json';

const translations: Record<Language, Translations> = {
  en: enTranslations as unknown as Translations,
  es: esTranslations as unknown as Translations,
};

const STORAGE_KEY = 'sim-language';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'en' || stored === 'es') ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = translations[language];

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'es' : 'en');

  return { t, language, setLanguage, toggleLanguage };
}
