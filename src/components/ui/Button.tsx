import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn';

type Variant = 'accent' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2.5 font-bold whitespace-nowrap no-underline transition duration-300';

const variants: Record<Variant, string> = {
  // Orange gradient: the main call to action
  accent:
    'bg-brand text-dark shadow-[0_6px_18px_rgb(232_115_12/0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgb(232_115_12/0.45)]',
  // Glassy white outline, for dark backgrounds
  ghost: 'border border-white/30 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/15',
  outline: 'border-[1.5px] border-white/40 bg-transparent text-white',
};

const sizes: Record<Size, string> = {
  sm: 'rounded-lg px-4 py-2.5 text-sm',
  md: 'rounded-lg px-5 py-3 text-sm',
  lg: 'rounded-xl px-7 py-4 text-base',
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Internal route ("/team") -> React Router link */
  to?: string;
  /** External URL / mailto -> plain link (external http links open in a new tab) */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  'aria-haspopup'?: 'dialog';
  onPointerEnter?: () => void;
  onFocus?: () => void;
}

/** Button or link with the site's button look. Pass `to` for routes, `href` for external links. */
export default function Button({
  children,
  variant = 'accent',
  size = 'md',
  className,
  to,
  href,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        onClick={rest.onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
