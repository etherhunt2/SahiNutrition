import { useState, useEffect, useSyncExternalStore } from 'react';
import type { Lang } from './translations';
import { t, tArray } from './translations';

/**
 * Hook that subscribes to language changes from both React and Astro contexts.
 * Uses useSyncExternalStore for tear-free reads of the global language state.
 */
function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener('lang-change', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('lang-change', handler);
    window.removeEventListener('storage', handler);
  };
}

function getSnapshot(): Lang {
  return (localStorage.getItem('sahi-lang') as Lang) || 'en';
}

function getServerSnapshot(): Lang {
  return 'en';
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useT(section: string) {
  const lang = useLang();
  return {
    lang,
    t: (key: string) => t(section, key, lang),
    tArr: (key: string) => tArray(section, key, lang),
  };
}
