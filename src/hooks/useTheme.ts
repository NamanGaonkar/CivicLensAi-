import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'civiclens_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return (stored as Theme) || 'system';
    } catch {
      return 'system';
    }
  });

  const applyTheme = useCallback((t: Theme) => {
    const doc = document.documentElement;
    if (t === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      doc.classList.toggle('dark', prefersDark);
    } else {
      doc.classList.toggle('dark', t === 'dark');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    // If system preference changes and theme is 'system', update
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [theme, applyTheme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return { theme, setTheme, toggle, isDark };
}
