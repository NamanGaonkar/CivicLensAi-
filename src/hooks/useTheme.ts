import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'civiclens_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return 'light';
  });

  const applyTheme = useCallback((_t: Theme) => {
    const doc = document.documentElement;
    doc.classList.remove('dark');
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'light');
    } catch {}
    applyTheme('light');
  }, [theme, applyTheme]);

  const setTheme = (_t: Theme) => setThemeState('light');
  const toggle = () => setThemeState('light');

  const isDark = false;

  return { theme, setTheme, toggle, isDark };
}
