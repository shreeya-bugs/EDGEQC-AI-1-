import React, { createContext, useContext, useState } from 'react';
import type { SupportedLanguage } from '../types';
import type { TranslationDict } from '../data/translations';
import { translations } from '../data/translations';


interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('edgeqc_lang') as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    localStorage.setItem('edgeqc_lang', lang);
    setLanguageState(lang);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
