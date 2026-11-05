import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 flex-none items-center justify-center rounded-xl border border-line-strong bg-surface text-heading',
        'transition duration-150 hover:-translate-y-px hover:border-secondary hover:text-accent-text dark:hover:shadow-[0_0_18px_rgb(245_166_35/0.28)]',
        className,
      )}
    >
      <span className="flex animate-theme-icon" key={theme} aria-hidden="true">
        {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </span>
    </button>
  );
}
