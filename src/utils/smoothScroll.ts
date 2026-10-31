/**
 * Smooth, eased scrolling for in-page links (<a href="#section">), including "Back to top".
 *
 * Browsers' built-in `scroll-behavior: smooth` is short, un-tunable and feels abrupt on long jumps,
 * so this animates the scroll position itself. Visitors who prefer reduced motion get an instant jump.
 */

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Set by initSmoothScroll(); lets other code (e.g. the hero terminal) navigate like a link click. */
let goToHash: ((hash: string) => boolean) | null = null;

/** Smooth-scroll to a section by id ("team", "contact", "top"...). Returns false if it doesn't exist. */
export function scrollToSection(id: string): boolean {
  return goToHash ? goToHash(`#${id}`) : false;
}

export function initSmoothScroll() {
  let frame = 0;

  const cancel = () => {
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const scrollToY = (targetY: number) => {
    cancel();

    const startY = window.scrollY;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const endY = Math.max(0, Math.min(targetY, maxY));
    const distance = endY - startY;
    if (Math.abs(distance) < 2) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: endY, behavior: 'instant' });
      return;
    }

    // Longer trips take a bit longer, but never feel sluggish (500-1100 ms)
    const duration = Math.min(1100, 500 + Math.abs(distance) * 0.18);
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo({ top: startY + distance * easeInOutCubic(t), behavior: 'instant' });
      frame = t < 1 ? requestAnimationFrame(step) : 0;
    };
    frame = requestAnimationFrame(step);
  };

  // Let the visitor take over: any manual scroll input stops the animation.
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((type) =>
    window.addEventListener(type, cancel, { passive: true }),
  );

  /** Scrolls to "#id". Returns false when the page has no such section. */
  const goTo = (hash: string): boolean => {
    const id = decodeURIComponent(hash.slice(1));
    const isTop = id === '' || id === 'top';
    const target = isTop ? document.documentElement : document.getElementById(id);
    if (!target) return false; // not a section on this page (e.g. modal triggers handle themselves)

    // Land just below the sticky navbar (uses each section's CSS scroll-margin-top)
    const offset = isTop ? 0 : parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const y = isTop ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;

    scrollToY(y);

    // Keep the URL shareable and the Back button working
    const newHash = isTop ? '#top' : hash;
    if (window.location.hash !== newHash) history.pushState(null, '', newHash);

    // Move keyboard focus to the section for screen-reader / keyboard users
    if (!isTop) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    return true;
  };
  goToHash = goTo;

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    if (goTo(link.getAttribute('href') ?? '')) event.preventDefault();
  });
}
