import { Link } from 'react-router';
import { config } from '../data';

// "DenkByte" -> ["Denk", "Byte"] so the wordmark can be two-tone.
const [brandFirst, brandSecond] = config.company.name.split(/(?=[A-Z])/);

/** Spelled the way the wordmark is displayed (WCAG 2.5.3 "Label in Name"). */
export const brandLabel = `${[brandFirst, brandSecond].filter(Boolean).join('·')} – think digitally`;

/** Pixel-bulb mark + two-tone wordmark + "$ think --digitally" tagline. Links to the homepage. */
export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      aria-label={`${brandLabel} – home`}
      onClick={onClick}
      className="group inline-flex flex-none items-center gap-2.5 text-heading no-underline"
    >
      <img
        src="/logo.svg"
        alt=""
        width={44}
        height={44}
        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 sm:h-11 dark:hidden"
      />
      <img
        src="/logo-dark.svg"
        alt=""
        width={44}
        height={44}
        className="hidden h-10 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6 sm:h-11 dark:block"
      />
      <span aria-hidden="true" className="flex flex-col gap-1.5">
        <span className="font-mono text-[1.3rem] leading-none font-extrabold tracking-[-0.04em] sm:text-[1.45rem]">
          {brandFirst}
          {brandSecond && (
            <>
              <span className="-mx-[0.04em] text-secondary">·</span>
              <span className="text-secondary">{brandSecond}</span>
            </>
          )}
        </span>
        <span className="inline-flex items-center font-mono text-[0.68rem] leading-none whitespace-nowrap text-heading/70 max-[360px]:hidden">
          <span className="mr-[0.35em] font-bold text-secondary">$</span> think --digitally
          <span className="ml-[0.3em] inline-block h-[1em] w-[0.5em] animate-blink bg-secondary" />
        </span>
      </span>
    </Link>
  );
}
