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

const word = (text: string, cls = '') =>
  `<span class="intro-wm"><span class="intro-w${cls ? ` ${cls}` : ''}">${text}</span></span>`;
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
        `<span class="intro-word${cls ? ` ${cls}` : ''}">${[...w].map((c) => `<span class="intro-c">${c}</span>`).join('')}</span>`,
    )
    .join(' ');

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
  el.className = 'intro';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Introduction');
  el.innerHTML = `
    <div class="intro-glow" aria-hidden="true"></div>
    <div class="intro-top" aria-hidden="true">
      <span class="intro-brand">Denk<b>·Byte</b></span>
      <span>Est. ${founded} · ${city}</span>
    </div>
    <div class="intro-stage" aria-live="polite">
      <span class="intro-prompt" aria-hidden="true"><b>$</b><i></i></span>
      <p class="intro-scene intro-scene--say">${words('They say,')}</p>
      <p class="intro-scene intro-scene--stat">
        <span class="intro-lead">${words('People judge a webpage in')}</span>
        <span class="intro-hl-wrap">${word('<span class="intro-num">0.05</span> <span class="intro-unit">seconds.</span>', 'intro-hl')}<span class="intro-underline"></span></span>
      </p>
      <p class="intro-scene intro-scene--built">
        <span class="intro-row">${letters('We built it')}</span>
        <span class="intro-row">${letters('for')} ${letters('that moment.', 'intro-accent')}</span>
      </p>
    </div>
    <div class="intro-bottom">
      <span class="intro-count" aria-hidden="true"><span class="intro-count-now">00</span> / 0${SCENES}</span>
      <span class="intro-cue" aria-hidden="true"><span class="intro-cue-icon"><i></i></span><span class="intro-cue-label">${cue}</span></span>
      <button type="button" class="intro-skip">Skip intro</button>
    </div>
    <div class="intro-progress" aria-hidden="true"><i></i></div>`;
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
