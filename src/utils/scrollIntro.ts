import gsap from 'gsap';
import { config } from '../data';

/**
 * Cinematic, scroll-driven intro that plays between the loader and the homepage:
 *
 *   (cue) → "They say," → "People judge a webpage in 0.05 seconds." → "We built it for that moment." → site
 *
 * Every scroll gesture (wheel / trackpad, swipe, ↓ / PageDown / Space) moves exactly one step; ↑ goes back.
 * The homepage is already mounted underneath, but stays paused (html.is-loading) and inert until the reveal.
 */

const SCENES = 3;
/** A new gesture starts after this much wheel silence, so trackpad momentum can't skip several steps. */
const GESTURE_GAP_MS = 220;
const SWIPE_MIN_PX = 45;

/** A word that slides in from behind its own mask (padding keeps italics/descenders unclipped). */
const word = (text: string, cls = '') =>
  `<span class="-mx-[0.06em] -mt-[0.08em] -mb-[0.16em] inline-block overflow-hidden px-[0.06em] pt-[0.08em] pb-[0.16em] align-bottom"><span class="intro-w inline-block will-change-transform ${cls}">${text}</span></span>`;
const words = (text: string) =>
  text
    .split(' ')
    .map((t) => word(t))
    .join(' ');
/** Per-letter spans, grouped per word so lines only break between words. */
const letters = (text: string, cls = '') =>
  text
    .split(' ')
    .map(
      (w) =>
        `<span class="inline-block whitespace-nowrap ${cls}">${[...w].map((c) => `<span class="intro-c inline-block will-change-transform">${c}</span>`).join('')}</span>`,
    )
    .join(' ');

/** Shared look of the small monospace labels at the top and bottom */
const bar =
  'absolute inset-x-0 flex items-center justify-between px-5 py-[clamp(1.1rem,3.5vw,2.25rem)] font-mono text-[0.72rem] tracking-[0.18em] text-white/45 uppercase sm:px-[clamp(1.25rem,4vw,2.75rem)]';

/** Only on the homepage, and not when someone follows a link straight to a section (#team, ...). */
export function shouldPlayIntro() {
  const isHome = /^\/(index\.html)?$/.test(window.location.pathname);
  const deepLink = window.location.hash !== '' && window.location.hash !== '#top';
  return isHome && !deepLink;
}

/**
 * Builds the intro (hidden under the loader) and returns `start`, to call once the loader is gone.
 * `onRevealStart` fires when the homepage starts to appear.
 */
export function createScrollIntro() {
  const html = document.documentElement;
  const site = document.getElementById('root');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;

  site?.setAttribute('inert', ''); // keyboard / screen readers stay in the intro until the reveal

  const { founded } = config.company;
  const { city } = config.contact.address;
  const cue = touch ? 'Swipe up' : 'Scroll';
  const cueLast = touch ? 'Swipe to enter' : 'Scroll to enter';

  const el = document.createElement('div');
  el.className =
    'intro fixed inset-0 z-999 isolate touch-none overflow-hidden overscroll-none bg-[#05070d] font-sans text-white select-none';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Introduction');
  el.innerHTML = `
    <div class="intro-glow pointer-events-none absolute -z-30 size-[75vmax] rounded-full bg-[radial-gradient(circle,rgb(232_115_12/0.32)_0%,rgb(232_115_12/0.08)_38%,transparent_65%)]" aria-hidden="true"></div>
    <div class="bg-grid pointer-events-none absolute inset-0 -z-20 [--grid-line:rgb(120_165_255/0.05)] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_50%,#000_10%,transparent_75%)]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.65)_100%)]" aria-hidden="true"></div>

    <div class="intro-top top-0 ${bar} max-sm:text-[0.62rem]" aria-hidden="true">
      <span class="font-extrabold tracking-[0.08em] text-white/85">Denk<b class="text-secondary">·Byte</b></span>
      <span>Est. ${founded} · ${city}</span>
    </div>

    <div class="intro-stage absolute inset-0 grid place-items-center px-[clamp(1.25rem,6vw,4rem)] text-center" aria-live="polite">
      <span class="intro-prompt col-start-1 row-start-1 inline-flex items-center gap-[0.5em] font-mono text-[clamp(1.1rem,2.6vw,1.5rem)] text-secondary" aria-hidden="true">
        <b>$</b><i class="h-[1.15em] w-[0.6em] animate-blink bg-secondary shadow-[0_0_18px_rgb(232_115_12/0.6)]"></i>
      </span>

      <p class="intro-scene invisible col-start-1 row-start-1 font-serif text-[clamp(2.8rem,9vw,7rem)] leading-[1.1] tracking-[-0.02em] text-white/90 italic">${words('They say,')}</p>

      <p class="intro-scene invisible col-start-1 row-start-1">
        <span class="intro-lead mb-[clamp(0.5rem,1.6vw,1.1rem)] block text-[clamp(1.3rem,3.6vw,2.6rem)] leading-[1.3] font-light tracking-[-0.01em] text-white/72">${words('People judge a webpage in')}</span>
        <span class="relative inline-block">${word(
          '<span class="font-mono tracking-[-0.07em] tabular-nums intro-num">0.05</span> seconds.',
          'intro-hl bg-[linear-gradient(100deg,#ffd08a_0%,var(--color-accent)_35%,var(--color-secondary)_100%)] bg-clip-text text-[clamp(2.6rem,12vw,9.5rem)] leading-none font-extrabold tracking-[-0.045em] whitespace-nowrap text-transparent drop-shadow-[0_0_40px_rgb(232_115_12/0.25)]',
        )}<span class="intro-underline absolute inset-x-[0.1em] -bottom-1.5 h-[3px] origin-left scale-x-0 rounded-sm bg-[linear-gradient(90deg,var(--color-secondary),var(--color-accent),transparent)]"></span></span>
      </p>

      <p class="intro-scene invisible col-start-1 row-start-1 text-[clamp(2.6rem,9.5vw,7.75rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">
        <span class="block">${letters('We built it')}</span>
        <span class="block">${letters('for')} ${letters('that moment.', 'text-accent [text-shadow:0_0_48px_rgb(232_115_12/0.45)]')}</span>
      </p>
    </div>

    <div class="intro-bottom bottom-0 ${bar}">
      <span aria-hidden="true"><span class="intro-count-now text-white">00</span> / 0${SCENES}</span>
      <span class="absolute bottom-[clamp(1.1rem,3.5vw,2.25rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.66rem] tracking-[0.28em] whitespace-nowrap max-sm:bottom-21" aria-hidden="true">
        <span class="relative h-[34px] w-[22px] rounded-xl border-[1.5px] border-white/35 pointer-coarse:h-[38px] pointer-coarse:w-0.5 pointer-coarse:rounded-sm pointer-coarse:border-0 pointer-coarse:bg-white/18">
          <i class="absolute top-[7px] left-1/2 -ml-[1.5px] h-[7px] w-[3px] animate-cue rounded-xs bg-secondary pointer-coarse:top-auto pointer-coarse:bottom-0 pointer-coarse:-ml-0.5 pointer-coarse:size-1 pointer-coarse:rounded-full"></i>
        </span>
        <span class="intro-cue-label">${cue}</span>
      </span>
      <button type="button" class="intro-skip min-h-10 rounded-full border border-white/18 px-4 py-2 text-[inherit] tracking-[inherit] text-white/65 uppercase transition-colors hover:border-secondary hover:text-white">Skip intro</button>
    </div>

    <div class="intro-progress absolute inset-x-0 bottom-0 h-0.5 bg-white/6" aria-hidden="true"><i class="block h-full origin-left scale-x-0 bg-brand"></i></div>`;
  document.body.appendChild(el);

  const q = gsap.utils.selector(el);
  const scenes = q('.intro-scene') as HTMLElement[];
  const glow = el.querySelector<HTMLElement>('.intro-glow')!;
  const stage = el.querySelector<HTMLElement>('.intro-stage')!;
  const chrome = q('.intro-top, .intro-bottom, .intro-progress');
  const countNow = el.querySelector<HTMLElement>('.intro-count-now')!;
  const cueLabel = el.querySelector<HTMLElement>('.intro-cue-label')!;
  const num = el.querySelector<HTMLElement>('.intro-num')!;
  const skip = el.querySelector<HTMLButtonElement>('.intro-skip')!;
  const pieces = (i: number) => gsap.utils.toArray<HTMLElement>('.intro-w, .intro-c', scenes[i]);

  // Where the warm light sits for each step (0 = cue only), drifting as the story builds.
  const light = [
    { left: '50%', top: '115%', scale: 0.6, opacity: 0.35 },
    { left: '32%', top: '70%', scale: 0.8, opacity: 0.4 },
    { left: '68%', top: '42%', scale: 1, opacity: 0.55 },
    { left: '50%', top: '50%', scale: 1.15, opacity: 0.8 },
  ];
  gsap.set(glow, { xPercent: -50, yPercent: -50, ...light[0] });
  gsap.set(chrome, { opacity: 0 });

  let step = 0; // 0 = cue only, 1..3 = scenes
  let busy = true; // ignores input until start() and during transitions
  let done = false;

  // ---------- scene transitions ----------

  function enter(i: number, tl: gsap.core.Timeline, at: number, dir: number) {
    const scene = scenes[i];
    tl.set(scene, { autoAlpha: 1 }, at);

    if (reduced) {
      tl.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, at);
      if (i === 1) tl.set(num, { textContent: '0.05' }, at);
      return;
    }

    const from = dir > 0 ? 110 : -110;
    if (i === 0) {
      tl.from(
        pieces(0),
        { yPercent: from, rotate: dir * 4, duration: 1.2, stagger: 0.12, ease: 'expo.out' },
        at,
      );
    } else if (i === 1) {
      const counter = { v: 0 };
      tl.from(q('.intro-lead .intro-w'), { yPercent: from, duration: 1, stagger: 0.05, ease: 'expo.out' }, at)
        .from(q('.intro-hl'), { yPercent: from, duration: 1.2, ease: 'expo.out' }, at + 0.3)
        .to(
          counter,
          {
            v: 0.05,
            duration: 0.9,
            ease: 'power2.out',
            onUpdate: () => {
              num.textContent = counter.v.toFixed(2);
            },
          },
          at + 0.35,
        )
        .fromTo(
          q('.intro-underline'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'expo.inOut' },
          at + 0.75,
        );
    } else {
      tl.from(
        pieces(2),
        {
          yPercent: dir * 55,
          opacity: 0,
          filter: 'blur(14px)',
          duration: 1.1,
          stagger: 0.03,
          ease: 'expo.out',
        },
        at,
      ).fromTo(
        glow,
        { opacity: 0.8 },
        { opacity: 1, scale: 1.35, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.out' },
        at + 0.6,
      );
    }
  }

  function exit(i: number, tl: gsap.core.Timeline, dir: number) {
    const scene = scenes[i];
    if (reduced) {
      tl.to(scene, { opacity: 0, duration: 0.4, ease: 'none' }, 0).set(scene, { autoAlpha: 0 });
      return;
    }
    const targets = [...pieces(i), ...q('.intro-underline')];
    tl.to(
      pieces(i),
      {
        yPercent: dir > 0 ? -100 : 100,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.55,
        stagger: i === 2 ? 0.01 : 0.03,
        ease: 'power3.in',
      },
      0,
    )
      .to(q('.intro-underline'), { scaleX: 0, transformOrigin: 'right center', duration: 0.4 }, 0)
      .set(scene, { autoAlpha: 0 })
      .set(targets, { clearProps: 'all' }); // ready to play again if the visitor scrolls back
  }

  function updateChrome(target: number, tl: gsap.core.Timeline) {
    countNow.textContent = `0${target}`;
    cueLabel.textContent = target === SCENES ? cueLast : cue;
    tl.to(q('.intro-progress i'), { scaleX: target / SCENES, duration: 0.9, ease: 'power3.inOut' }, 0).to(
      glow,
      { ...light[target], duration: reduced ? 0.01 : 1.6, ease: 'power2.inOut' },
      0,
    );
  }

  function go(target: number) {
    if (busy || done || target === step || target < 1) return;
    if (target > SCENES) return reveal();

    busy = true;
    const dir = target > step ? 1 : -1;
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    if (step > 0) exit(step - 1, tl, dir);
    enter(target - 1, tl, step > 0 ? 0.5 : 0, dir);
    updateChrome(target, tl);
    tl.to(q('.intro-prompt'), { autoAlpha: 0, duration: reduced ? 0.2 : 0.4 }, 0);
    // Accept the next gesture once the new line has landed, not after every letter has settled.
    tl.call(() => void (busy = false), [], (step > 0 ? 0.5 : 0) + (reduced ? 0.5 : 1.05));
    step = target;
  }

  // ---------- the reveal ----------

  function startSite() {
    html.classList.remove('is-loading'); // unlocks scrolling + plays the hero animations
    site?.removeAttribute('inert');
    window.scrollTo(0, 0);
  }

  function reveal() {
    if (done) return;
    done = true;
    busy = true;
    detach();

    const tl = gsap.timeline({ onComplete: () => el.remove() });
    if (reduced) {
      tl.call(startSite).to(el, { autoAlpha: 0, duration: 0.6, ease: 'none' });
      return;
    }

    tl.to(stage, { scale: 1.3, opacity: 0, filter: 'blur(12px)', duration: 0.9, ease: 'power2.in' }, 0)
      .to(chrome, { opacity: 0, duration: 0.5 }, 0)
      .to(glow, { scale: 2.6, opacity: 1, duration: 1, ease: 'power2.in' }, 0)
      .call(startSite, [], 0.7)
      // The homepage settles from slightly zoomed-in while the dark layer dissolves.
      .fromTo(
        site,
        { scale: 1.08, transformOrigin: `50% ${window.innerHeight / 2}px` },
        { scale: 1, duration: 1.5, ease: 'expo.out', clearProps: 'transform,transformOrigin' },
        0.7,
      )
      .to(el, { autoAlpha: 0, duration: 0.9, ease: 'power2.out' }, 0.7);
  }

  // ---------- input: wheel / trackpad, touch, keyboard ----------

  let lastWheel = 0;
  let armed = true;
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const now = performance.now();
    if (now - lastWheel > GESTURE_GAP_MS) armed = true; // a fresh gesture, not momentum
    lastWheel = now;
    if (!armed || busy || Math.abs(e.deltaY) < 4) return;
    armed = false;
    go(step + (e.deltaY > 0 ? 1 : -1));
  };

  let touchY: number | null = null;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (e.target !== skip) e.preventDefault(); // no rubber-banding / pull-to-refresh
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) >= SWIPE_MIN_PX) go(step + (dy > 0 ? 1 : -1));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.target === skip && (e.key === 'Enter' || e.key === ' ')) return; // the button handles itself
    if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      if (!e.repeat) go(step + 1);
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      if (!e.repeat) go(step - 1);
    }
  };

  const onSkip = () => reveal();

  function attach() {
    window.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKey);
    skip.addEventListener('click', onSkip);
  }

  function detach() {
    window.removeEventListener('wheel', onWheel);
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('keydown', onKey);
    skip.removeEventListener('click', onSkip);
  }

  /** Call once the loader has fully finished. */
  function start() {
    attach();
    gsap
      .timeline()
      .to(chrome, { opacity: 1, duration: reduced ? 0.3 : 1, stagger: 0.12, ease: 'power2.out' })
      .from(q('.intro-prompt'), { opacity: 0, duration: reduced ? 0.3 : 0.8, ease: 'power2.out' }, 0.2)
      .call(() => void (busy = false), [], 0.25);
  }

  return { start };
}
