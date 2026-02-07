import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme, toggle, isDark } = useTheme();

  return (
    <div className="flex items-center">
      <button
        onClick={toggle}
        title={`Toggle color theme (current: ${theme})`}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        {isDark ? <Moon className="w-5 h-5 text-gray-200" /> : <Sun className="w-5 h-5 text-yellow-500" />}
      </button>
    </div>
  );
}
