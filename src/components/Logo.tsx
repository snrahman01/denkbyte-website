import { config } from '../data';

// "DenkByte" -> ["Denk", "Byte"] so the wordmark can be two-tone.
const [brandFirst, brandSecond] = config.company.name.split(/(?=[A-Z])/);

/** Spelled the way the wordmark is displayed (WCAG 2.5.3 "Label in Name"). */
export const brandLabel = `${[brandFirst, brandSecond].filter(Boolean).join('·')} – think digitally`;

type LogoProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

/** Pixel-bulb mark + two-tone wordmark + "$ think --digitally" tagline. */
export default function Logo({ href, label, onClick }: LogoProps) {
  return (
    <a className="logo" href={href} aria-label={label} onClick={onClick}>
      <img src="/logo.svg" alt="" className="logo-mark logo-mark--light" width={44} height={44} />
      <img src="/logo-dark.svg" alt="" className="logo-mark logo-mark--dark" width={44} height={44} />
      <span className="logo-words" aria-hidden="true">
        <span className="logo-text">
          {brandFirst}
          {brandSecond && (
            <>
              <span className="logo-dot">·</span>
              <span className="logo-byte">{brandSecond}</span>
            </>
          )}
        </span>
        <span className="logo-tagline">
          <span className="logo-tagline-sign">$</span> think --digitally
          <span className="logo-tagline-cursor" />
        </span>
      </span>
    </a>
  );
}
