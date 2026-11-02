import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-icon" key={theme} aria-hidden="true">
        {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </span>
    </button>
  );
}
