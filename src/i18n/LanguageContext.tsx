import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from './translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('sahi-lang') as Lang) || 'en';
    }
    return 'en';
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sahi-lang', newLang);
      document.documentElement.setAttribute('data-lang', newLang);
      window.dispatchEvent(new CustomEvent('lang-change', { detail: newLang }));
    }
  };

  useEffect(() => {
    // Listen for language changes from other sources (e.g., the Astro dialog)
    const handler = (e: Event) => {
      const lang = (e as CustomEvent).detail as Lang;
      setLangState(lang);
    };
    window.addEventListener('lang-change', handler);

    // Set initial data attribute
    document.documentElement.setAttribute('data-lang', lang);

    return () => window.removeEventListener('lang-change', handler);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
