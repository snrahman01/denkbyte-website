/* =========================================================
   DenkByte — site script
   1. Setup & smooth scroll (Lenis + ScrollTrigger)
   2. Intro preloader (GSAP timeline, exactly 5.0s)
   3. "They Say" pinned scroll story
   4. Micro-interactions (cursor, magnetic, tilt, clock)
   5. Content from /data (config, services, team)
   6. Nav, anchors, modals, contact form
   ========================================================= */

const DATA_BASE = 'data';
const INTRO_KEY = 'denkbyte:intro-seen';
const LOGO_RATIO = 700 / 196;         // logo.png width / height

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGSAP = typeof window.gsap !== 'undefined';
const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
let lenis = null;

if (hasST) gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------
   1. Smooth scroll
   --------------------------------------------------------- */
function initSmoothScroll() {
    if (reduceMotion || !hasGSAP || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasST) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (root.classList.contains('is-locked')) lenis.stop();
}

/* ---------------------------------------------------------
   2. Intro preloader
   --------------------------------------------------------- */
let introDone = false;

function finishIntro() {
    if (introDone) return;
    introDone = true;
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* ignore */ }
    const intro = document.getElementById('intro');
    if (intro) intro.remove();
    root.classList.remove('intro-play', 'is-locked');
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    if (lenis) lenis.start();
    if (hasST) ScrollTrigger.refresh();
    document.dispatchEvent(new CustomEvent('intro:done'));
}

function playIntro() {
    const intro = document.getElementById('intro');
    if (!root.classList.contains('intro-play')) {
        if (intro) intro.remove();
        return;
    }
    if (!hasGSAP) { finishIntro(); return; }   // library failed to load: never trap the visitor

    window.scrollTo(0, 0);

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.getElementById('intro-svg');
    const bg = intro.querySelector('.intro-bg');
    const rays = intro.querySelectorAll('.intro-ray');
    const plane = intro.querySelector('.intro-plane');
    const black = intro.querySelector('.intro-black');

    const W = window.innerWidth;
    const H = window.innerHeight;
    const u = Math.min(W, H) / 800;                 // one design unit
    svg.setAttribute('viewBox', `${-W / 2} ${-H / 2} ${W} ${H}`);   // (0,0) = screen centre, 1 unit = 1px

    const mk = (tag, attrs, parent = svg) => {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        parent.appendChild(el);
        return el;
    };

    /* -- the thin vertical line, drawn from the centre outward (two halves) -- */
    const half = Math.min(250 * u, H * 0.4);
    const lineAttrs = { x1: 0, y1: 0, x2: 0, 'stroke-width': 2, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 };
    const lineUp = mk('line', { ...lineAttrs, y2: -half });
    const lineDown = mk('line', { ...lineAttrs, y2: half });

    /* -- our logo: centred; the strokes trace a frame around it, then it fills in -- */
    const logoImg = document.getElementById('intro-logo');
    const logoW = Math.min(W * 0.8, 620, 600 * u);
    const logoH = logoW / LOGO_RATIO;
    gsap.set(logoImg, { width: logoW, xPercent: -50, yPercent: -50, clipPath: 'inset(0% 100% 0% 0%)' });

    const seg = (x1, y1, x2, y2) => ({
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
        len: Math.hypot(x2 - x1, y2 - y1),
        rot: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    });
    const pad = 18 * u;
    const L = -logoW / 2 - pad, Rt = logoW / 2 + pad, T = -logoH / 2 - pad, B = logoH / 2 + pad;
    const finals = [seg(L, T, Rt, T), seg(L, T, L, B), seg(Rt, B, L, B)];   // top edge, left edge, bottom edge

    // Strokes live in a group that rotates 40°; children target "final minus 40°" so the
    // composed result lands exactly on the frame while the whole thing visibly turns.
    const GROUP_ROT = 40;
    const rad = (-GROUP_ROT * Math.PI) / 180;
    const markGroup = mk('g', {});
    const strokes = finals.map(() => mk('line', { x1: -0.5, y1: 0, x2: 0.5, y2: 0, 'stroke-width': 2 }, markGroup));
    gsap.set(markGroup, { svgOrigin: '0 0', rotation: 0 });
    gsap.set(strokes, { svgOrigin: '0 0', x: 0, y: 0, rotation: 90, scaleX: half * 2, scaleY: 1, opacity: 0 });

    /* -- light rays -- */
    gsap.set(rays, { rotation: (i) => [16, 29, 40, 52][i], opacity: 0, transformOrigin: '50% 50%' });

    /* -- hero elements revealed at the end -- */
    const heroLines = document.querySelectorAll('.hero-line > span');
    const heroLine1 = document.querySelector('.hero-line--1 > span');
    const chromeFade = document.querySelectorAll('.navbar, .hero-corner');
    const chromeRise = document.querySelectorAll('.hero-cta, .scroll-ind');

    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    // 0.0–0.4  plain #fafafa (nothing happens)

    // 0.4–1.3  line draws from centre outward + light rays drift behind it
    tl.to([lineUp, lineDown], { attr: { 'stroke-dashoffset': 0 }, duration: 0.9, ease: 'power3.inOut' }, 0.4);
    tl.to(rays, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.07 }, 0.4);
    tl.to(rays, { rotation: '+=7', duration: 1.9, ease: 'sine.inOut' }, 0.4);

    // 1.3–2.3  line rotates ~40° and splits into 3 strokes that trace the logo's frame; bg resolves into 2 planes
    tl.set([lineUp, lineDown], { opacity: 0 }, 1.3);
    tl.set(strokes, { opacity: 1 }, 1.3);
    tl.to(markGroup, { rotation: GROUP_ROT, duration: 1.0, ease: 'expo.inOut' }, 1.3);
    strokes.forEach((el, i) => {
        const f = finals[i];
        tl.to(el, {
            x: f.x * Math.cos(rad) - f.y * Math.sin(rad),
            y: f.x * Math.sin(rad) + f.y * Math.cos(rad),
            rotation: f.rot - GROUP_ROT,
            scaleX: f.len,
            scaleY: 1.5,
            duration: 0.9,
            ease: 'expo.inOut',
        }, 1.3 + i * 0.05);
    });
    tl.to(plane, { clipPath: 'polygon(0% 64%, 100% 40%, 100% 100%, 0% 100%)', duration: 1.0, ease: 'expo.inOut' }, 1.3);
    tl.to(rays, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 1.6);

    // 2.3–3.2  the logo fills in inside the traced frame, then the frame lines step back
    tl.to(logoImg, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power3.inOut' }, 2.3);
    tl.to(strokes, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 2.9);

    // 3.2–3.8  wipe from the centre into a soft logo-tinted gradient while the logo pushes forward
    tl.to(black, { clipPath: 'circle(75% at 50% 50%)', duration: 0.6, ease: 'power3.inOut' }, 3.2);
    tl.to([svg, logoImg], { scale: 2.6, duration: 0.6, ease: 'power3.in' }, 3.2);

    // 3.8–5.0  hand over to the real (same-gradient) hero underneath and reveal the headline
    tl.set([bg, svg, logoImg, black], { autoAlpha: 0 }, 3.8);
    tl.fromTo(heroLines, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15 }, 3.8);
    tl.fromTo(heroLine1, { letterSpacing: '0.6em' }, { letterSpacing: '0.3em', duration: 1.1, ease: 'expo.out' }, 3.8);
    tl.fromTo(chromeFade, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 4.7);
    tl.fromTo(chromeRise, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 4.7);

    tl.to('#intro-skip', { autoAlpha: 0, duration: 0.15 }, 4.55);   // clear the corner for the hero UI

    // 5.0  remove overlay, unlock scroll
    tl.call(finishIntro, null, 5.0);

    const skip = () => { tl.progress(1); finishIntro(); };
    document.getElementById('intro-skip').addEventListener('click', skip);
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape' && !introDone) skip();
        if (introDone) document.removeEventListener('keydown', onKey);
    });

    window.__introTimeline = tl;   // handy for debugging: __introTimeline.duration() === 5
}

/* ---------------------------------------------------------
   3. "They Say" pinned scroll story
   --------------------------------------------------------- */
function initTheySay() {
    const section = document.querySelector('.they-say');
    if (!section) return;
    if (!hasST || reduceMotion) { root.classList.add('ts-static'); return; }

    const say = section.querySelector('.ts-say');
    const lines = section.querySelectorAll('.ts-lines .mask > span');
    const five = section.querySelector('.ts-five');

    gsap.set(lines, { yPercent: 110 });
    gsap.set(five, { autoAlpha: 0, scale: 1.2, filter: 'blur(16px)' });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * 2.6),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
    });

    tl.to(say, {
        scale: () => (window.innerWidth < 760 ? 0.5 : 1 / 3),     // 12vw → ~4vw
        y: () => -window.innerHeight * 0.31,
        duration: 1,
        ease: 'power2.inOut',
    })
        .to(lines, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.25 }, '>-0.15')
        .to(five, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power4.out' }, '>+0.15')
        .to({}, { duration: 0.5 });   // short hold before unpinning
}

/* ---------------------------------------------------------
   4. Micro-interactions
   --------------------------------------------------------- */
function initCursor() {
    if (!hasGSAP || reduceMotion || !finePointer) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    root.classList.add('has-cursor');
    gsap.set(cursor, { x: -100, y: -100 });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });

    const SEL = 'a, button, .tilt, input, textarea';
    const sizeFor = (el) => (el.matches('input, textarea') ? 0.5 : el.matches('.tilt') ? 2.2 : 3.2);
    document.addEventListener('pointerover', (e) => {
        const t = e.target.closest(SEL);
        if (t) { const sc = sizeFor(t); gsap.to(cursor, { scale: sc, opacity: sc > 1 ? 0.22 : 0.9, duration: 0.35, ease: 'power3.out' }); }
    });
    document.addEventListener('pointerout', (e) => {
        const t = e.target.closest(SEL);
        if (!t) return;
        const next = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(SEL) : null;
        const sc = next ? sizeFor(next) : 1;
        gsap.to(cursor, { scale: sc, opacity: sc > 1 ? 0.22 : 0.9, duration: 0.35, ease: 'power3.out' });
    });
    document.documentElement.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
    document.documentElement.addEventListener('pointerenter', () => gsap.to(cursor, { opacity: 1, duration: 0.2 }));
}

function initMagnetic(scope = document) {
    if (!hasGSAP || reduceMotion || !finePointer) return;
    scope.querySelectorAll('.magnetic').forEach((el) => {
        if (el.dataset.magnetic) return;
        el.dataset.magnetic = '1';
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.35);
            yTo((e.clientY - r.top - r.height / 2) * 0.45);
        });
        el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
}

function initTilt(scope = document) {
    if (!hasGSAP || reduceMotion || !finePointer) return;
    scope.querySelectorAll('.tilt').forEach((el) => {
        if (el.dataset.tilt) return;
        el.dataset.tilt = '1';
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        });
        el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
}

function initClock() {
    const el = document.getElementById('corner-time');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
}

/* ---------------------------------------------------------
   5. Content
   --------------------------------------------------------- */
async function fetchJSON(name) {
    const res = await fetch(`${DATA_BASE}/${name}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${name}: ${res.status}`);
    return res.json();
}

async function loadConfiguration() {
    try {
        applyConfiguration(await fetchJSON('config.json'));
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

function applyConfiguration(config) {
    const colors = config.branding && config.branding.colors;
    if (colors) {
        const map = { primary: '--color-primary', secondary: '--color-secondary', accent: '--color-accent', dark: '--color-dark', light: '--color-light', text: '--color-text', text_light: '--color-text-light' };
        Object.entries(map).forEach(([key, cssVar]) => { if (colors[key]) root.style.setProperty(cssVar, colors[key]); });
    }

    if (config.company) {
        const name = config.company.name;
        document.getElementById('footer-company-name').textContent = name;
        document.getElementById('footer-year-company').textContent = name;
        document.getElementById('founded-year').textContent = config.company.founded;
        document.title = `${name} | Planspiel Course`;
    }

    if (config.contact) {
        renderContactInfo(config.contact);
        renderSocialLinks(config.contact.social_media);
    }

    if (config.legal && config.legal.disclaimer) {
        document.getElementById('academic-disclaimer').textContent = config.legal.disclaimer;
    }

    renderLegalContent(config);
}

async function loadContent() {
    const [services, team] = await Promise.all([
        fetchJSON('services.json').catch((e) => { console.error(e); return []; }),
        fetchJSON('team.json').catch((e) => { console.error(e); return []; }),
    ]);
    renderServices(services);
    renderTeam(team);
    document.getElementById('team-count').textContent = team.length;
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderServices(services) {
    const container = document.getElementById('services-container');
    container.innerHTML = services.map((service, i) => `
        <article class="service-card tilt">
            <span class="num">${String(i + 1).padStart(2, '0')}</span>
            <div class="icon" aria-hidden="true">${service.icon || '⭐'}</div>
            <h3>${esc(service.title)}</h3>
            <p>${esc(service.description)}</p>
        </article>
    `).join('');
}

// Team cards: cartoon avatar + real name + role only
function renderTeam(members) {
    const container = document.getElementById('team-container');
    container.innerHTML = members.map((m) => {
        const avatar = window.DenkAvatars && window.DenkAvatars.has(m.avatar)
            ? window.DenkAvatars.render(m.avatar, `Cartoon avatar of ${esc(m.name)}`)
            : `<span class="team-initials" aria-hidden="true">${esc(getInitials(m.name))}</span>`;
        return `
        <article class="team-member tilt">
            <div class="team-avatar">${avatar}</div>
            <h3>${esc(m.name)}</h3>
            <p class="role">${esc(m.role)}</p>
        </article>`;
    }).join('');
}

function renderContactInfo(contact) {
    const container = document.getElementById('contact-details');
    let html = '';
    if (contact.email) {
        html += `
            <div class="contact-item">
                <div class="contact-item-icon" aria-hidden="true">💌</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">slide into our inbox</span>
                    <a href="mailto:${esc(contact.email)}" class="contact-item-value">${esc(contact.email)}</a>
                </div>
            </div>`;
    }
    if (contact.phone) {
        html += `
            <div class="contact-item">
                <div class="contact-item-icon" aria-hidden="true">📞</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">ring ring</span>
                    <a href="tel:${esc(contact.phone.replace(/[^+\d]/g, ''))}" class="contact-item-value">${esc(contact.phone)}</a>
                </div>
            </div>`;
    }
    if (contact.address) {
        const a = contact.address;
        html += `
            <div class="contact-item">
                <div class="contact-item-icon" aria-hidden="true">📍</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">come say hi irl</span>
                    <span class="contact-item-value">${esc(a.street)}<br>${esc(a.postal_code)} ${esc(a.city)}<br>${esc(a.country)}</span>
                </div>
            </div>`;
    }
    container.innerHTML = html;
}

const SOCIAL_ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h3.2v11H4zM5.6 3.5a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7zM9.6 9h3v1.5h.05c.42-.8 1.45-1.65 3-1.65 3.2 0 3.8 2.1 3.8 4.85V20h-3.15v-5.6c0-1.35-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.6z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
};

function renderSocialLinks(social) {
    const container = document.getElementById('social-links');
    if (!container || !social) return;
    container.innerHTML = Object.entries(social)
        .filter(([, url]) => url)
        .map(([platform, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="DenkByte on ${esc(platform)}">${SOCIAL_ICONS[platform] || '→'}</a>`)
        .join('');
}

function renderLegalContent(config) {
    const email = (config.contact && config.contact.email) || 'contact@example.com';
    const impressum = document.getElementById('impressum-content');
    if (config.legal && config.legal.impressum) {
        const owner = config.legal.impressum.owner || 'Company';
        const c = config.contact || {};
        impressum.innerHTML = `
            <h3>Operator</h3>
            <p>${esc(owner)}</p>

            <h3>Contact</h3>
            <p>
                Email: <a href="mailto:${esc(email)}">${esc(email)}</a><br>
                ${c.phone ? `Phone: ${esc(c.phone)}<br>` : ''}
                ${c.address ? `Address: ${esc(c.address.street)}<br>${esc(c.address.postal_code)} ${esc(c.address.city)}<br>${esc(c.address.country)}` : ''}
            </p>

            <h3>Disclaimer</h3>
            <p><strong>Academic Purpose:</strong> This website represents a fictional company created for educational purposes as part of the Planspiel course at Technische Universität Chemnitz (WS 2026/27). All content is fictional and for demonstration purposes only.</p>

            <h3>Liability for Content</h3>
            <p>The contents of this website have been compiled with meticulous care. However, the operator does not assume any liability for the topicality, correctness, completeness or quality of the information provided.</p>

            <h3>Liability for Links</h3>
            <p>The operator is responsible for the content of external websites only to the extent that they have knowledge of illegal content and it would be technically possible and reasonable to prevent the use of such websites.</p>

            <h3>Copyright</h3>
            <p>The layout, graphics and all other elements contained on this website are protected by copyright. Reproduction in any form requires the written permission of the rights holder.</p>
        `;
    }

    document.getElementById('privacy-content').innerHTML = `
        <h3>Data Protection &amp; GDPR Compliance</h3>
        <p>This website is compliant with the General Data Protection Regulation (GDPR) and German data protection laws.</p>

        <h3>Personal Data Collection</h3>
        <p>We only collect personal data that you voluntarily provide through our contact form. This includes:</p>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Name</li>
            <li>Email Address</li>
            <li>Message Content</li>
        </ul>

        <h3>Data Processing</h3>
        <p>Your data is processed solely for the purpose of responding to your inquiry. We do not share your data with third parties or use it for marketing purposes without your explicit consent.</p>

        <h3>Data Storage</h3>
        <p>Your personal data is stored securely and is deleted after the inquiry has been resolved, typically within 30 days.</p>

        <h3>Your Rights</h3>
        <p>According to GDPR, you have the following rights:</p>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to deletion of your data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
        </ul>

        <h3>Contact for Data Protection</h3>
        <p>For questions regarding data protection, please contact us at ${esc(email)}</p>

        <h3>Cookies &amp; Storage</h3>
        <p>This website does not use cookies or tracking technologies. It stores a single session flag in your browser (sessionStorage) so the intro animation only plays once per visit; it is deleted when you close the tab. Fonts are loaded from Google Fonts and Fontshare, which receive your IP address when the files are requested. Team avatars are drawn locally and load nothing from third parties.</p>

        <h3>External Links</h3>
        <p>This website may contain links to external websites. We are not responsible for the privacy practices of external websites. Please review their privacy policies before providing personal information.</p>

        <h3>Educational Disclaimer</h3>
        <p>This website is a fictional company created for the Planspiel course at TU Chemnitz. While GDPR and data protection principles are demonstrated here, this is an educational project and not a real commercial operation.</p>
    `;
}

/* ---------------------------------------------------------
   6. Nav, anchors, modals, form
   --------------------------------------------------------- */
function setupEventListeners() {
    // Mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const setMenu = (open) => {
        navMenu.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
        navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    }

    // Smooth anchor scrolling through Lenis
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href');
        if (id === '#' || id === '#impressum' || id === '#gdpr') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', id);
    });

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

    // Modals
    const openModal = (id) => {
        document.getElementById(id).classList.add('show');
        if (lenis) lenis.stop();
    };
    const closeModal = (modal) => {
        modal.classList.remove('show');
        if (lenis && !document.querySelector('.modal.show')) lenis.start();
    };
    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close')) closeModal(modal);
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.querySelectorAll('.modal.show').forEach(closeModal);
    });
    const impressumLink = document.querySelector('a[href="#impressum"]');
    const privacyLink = document.querySelector('a[href="#gdpr"]');
    if (impressumLink) impressumLink.addEventListener('click', (e) => { e.preventDefault(); openModal('impressum-modal'); });
    if (privacyLink) privacyLink.addEventListener('click', (e) => { e.preventDefault(); openModal('privacy-modal'); });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'sending… ✈️';

    try {
        // Netlify Forms: POST url-encoded data (including form-name) to the site root
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        status.textContent = "got it! we'll hit you back soon ✌️";
        status.className = 'form-status success';
        form.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        status.textContent = "oops, that didn't go through 😅 the form only works on the live netlify site, try again there?";
        status.className = 'form-status error';
    } finally {
        btn.disabled = false;
        btn.textContent = label;
    }

    setTimeout(() => { status.className = 'form-status'; }, 6000);
}

function getInitials(name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
initSmoothScroll();
playIntro();                 // starts immediately so the 5.0s timing is exact

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    setupEventListeners();
    initClock();
    initTheySay();
    initCursor();
    initMagnetic();
    initTilt();

    await loadConfiguration();
    await loadContent();

    initMagnetic();
    initTilt();
    if (hasST) ScrollTrigger.refresh();
});
