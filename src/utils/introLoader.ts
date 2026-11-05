import gsap from 'gsap';

/** The intro starts lifting this long after the page started loading (ms). */
const HOLD_MS = 2500;

/**
 * Animates the intro loader with GSAP. Its markup and first-paint styles are inline in index.html,
 * so it shows instantly, before this bundle has even downloaded. This takes over once the JS runs:
 * the wordmark rises letter by letter, "$ think --digitally" types out, the bar counts to 100%,
 * the bulb flashes "on", then the panel slides up and the page animations start.
 */
type LoaderOptions = {
  /** Keep the homepage paused and scroll-locked after the loader (the scroll intro takes over). */
  holdPage?: boolean;
  /** Called once the loader has completely finished and is removed. */
  onDone?: () => void;
};

export function runIntroLoader({ holdPage = false, onDone }: LoaderOptions = {}) {
  const root = document.documentElement;
  const el = document.getElementById('preloader');
  if (!el) {
    if (!holdPage) root.classList.remove('is-loading');
    onDone?.();
    return;
  }

  const q = gsap.utils.selector(el);
  const counter = el.querySelector<HTMLElement>('.preloader-count');

  // Split "think --digitally" into letters so it can be typed out.
  const type = el.querySelector<HTMLElement>('.preloader-type');
  const letters = [...(type?.textContent ?? '')].map((char) => {
    const span = document.createElement('span');
    span.className = 'preloader-ch';
    span.textContent = char;
    return span;
  });
  type?.replaceChildren(...letters);

  // Leave at 2.5 s after navigation start, but always give the intro at least 1.6 s to play.
  const exitAt = Math.max(1.6, (HOLD_MS - performance.now()) / 1000);
  const fill = exitAt - 0.6; // progress bar duration

  const progress = { value: 0 };
  const renderCount = () => {
    if (counter) counter.textContent = `${Math.round(progress.value)}`.padStart(3, '0');
  };
  const startPage = () => {
    if (holdPage) return;
    root.classList.remove('is-loading'); // un-pauses the hero animations + unlocks scrolling
    // Scrolling was locked while loading, so a shared "#team"-style link has to be followed now.
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && id !== 'top') document.getElementById(id)?.scrollIntoView();
  };
  const cleanUp = () => {
    el.remove();
    onDone?.();
  };

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // No movement: show everything, fill the bar, then fade out.
    gsap.set(q('.preloader-c'), { y: 0 });
    gsap.set(letters, { display: 'inline' });
    gsap.set(q('.preloader-meta'), { opacity: 1, y: 0 });
    tl.to(progress, { value: 100, duration: exitAt - 0.2, ease: 'none', onUpdate: renderCount }, 0)
      .to(q('.preloader-bar i'), { scaleX: 1, duration: exitAt - 0.2, ease: 'none' }, 0)
      .add(startPage, exitAt)
      .to(el, { autoAlpha: 0, duration: 0.3 }, exitAt)
      .add(cleanUp);
    return;
  }

  tl.to(q('.preloader-c'), { y: 0, duration: 0.6, stagger: 0.045 }, 0.05)
    .to(q('.preloader-meta'), { opacity: 1, y: 0, duration: 0.5 }, 0.2)
    .to(
      letters,
      { display: 'inline', duration: 0, stagger: Math.min(0.05, (fill - 0.5) / letters.length) },
      0.45,
    )
    // Progress: counter + bar, settling at 100.
    .to(progress, { value: 100, duration: fill, ease: 'power2.inOut', onUpdate: renderCount }, 0.25)
    .to(q('.preloader-bar i'), { scaleX: 1, duration: fill, ease: 'power2.inOut' }, 0.25)
    // "Lights on": the spinner ring lets go and the bulb flashes.
    .to(q('.preloader-ring'), { opacity: 0, scale: 1.3, duration: 0.35 }, fill + 0.15)
    .set(q('.preloader-glow'), { animation: 'none' }, fill + 0.15)
    .to(q('.preloader-glow'), { scale: 1.4, opacity: 1, duration: 0.3, ease: 'power2.out' }, fill + 0.15)
    .to(q('.preloader-mark img'), { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 }, fill + 0.15)
    // Exit: content lifts out, the page animations start, the panel slides up to reveal the site.
    .add(startPage, exitAt)
    .to(q('.preloader-box'), { y: -40, opacity: 0, duration: 0.45, ease: 'power2.in' }, exitAt)
    .to(el, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, exitAt + 0.15)
    .add(cleanUp);
}
