/* =========================================================
   DenkByte — team avatars
   Original 3D-cartoon style, drawn as inline SVG.
   One config ("component") per member, all rendered by the same
   painter so the style stays consistent. Colors = logo palette.
   ========================================================= */
(function () {
    const C = {
        navy: '#16213E', navyLight: '#2B3A63',
        orange: '#E8730C', orangeLight: '#F3923A',
        amber: '#F5A623', amberLight: '#F8BE58',
        white: '#FFFFFF',
        tintNavy: '#E4E8F2', tintOrange: '#FBE3CE', tintAmber: '#FDEFD2',
        hairBlack: '#1E1714', hairDark: '#2E1F18',
    };

    /* ---------- colour helpers ---------- */
    const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
    const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
    const shade = (h, f) => { const [r, g, b] = hex(h); return f < 0 ? toHex(r * (1 + f), g * (1 + f), b * (1 + f)) : toHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f); };

    /* ---------- one config per member (keyed by data/team.json → "avatar") ---------- */
    const MEMBERS = {
        ayush: {      // boy · spectacles · short neat hair · smaller frame
            gender: 'm', skin: '#EDC09A', hair: 'neat', hairColor: C.hairDark, face: 'oval',
            headRx: 19.5, headRy: 22.5, headY: 52, shoulders: 31, neck: 6.5,
            glasses: true, outfit: 'shirt', top: C.navy, bg: C.tintOrange,
        },
        nishtha: {    // girl · no glasses / accessories · long hair
            gender: 'f', skin: '#E3AE85', hair: 'long', hairColor: C.hairBlack, face: 'soft',
            headRx: 19, headRy: 22.5, shoulders: 31, neck: 6,
            outfit: 'kurti', top: C.orange, trim: C.amber, bg: C.tintNavy,
        },
        kashish: {    // girl · round cheerful face · fuller build · no glasses
            gender: 'f', skin: '#EDC09A', hair: 'wavy', hairColor: '#3A2418', face: 'round',
            headRx: 22.5, headRy: 22.5, shoulders: 40, neck: 7.5, cheeks: true,
            outfit: 'tee', top: C.amber, bg: C.tintNavy,
        },
        meeta: {      // girl · Gujarati · slim build · long hair
            gender: 'f', skin: '#E3AE85', hair: 'long', hairColor: C.hairBlack, face: 'slim',
            headRx: 18, headRy: 23, shoulders: 27, neck: 5.5,
            outfit: 'kurti', top: C.navy, trim: C.orange, bg: C.tintAmber,
        },
        rohini: {     // girl · Marathi · braid
            gender: 'f', skin: '#E3AE85', hair: 'braid', hairColor: C.hairBlack, face: 'soft',
            headRx: 19, headRy: 22.5, shoulders: 31, neck: 6,
            outfit: 'kurti', top: C.amber, trim: C.navy, bg: C.tintNavy,
        },
        pranav: {     // boy · heavier build · defined sharp jawline 
            gender: 'm', skin: '#EDC09A', hair: 'full', hairColor: C.hairBlack, face: 'sharp',
            headRx: 21.5, headRy: 23, shoulders: 42, neck: 9,
            outfit: 'hoodie', top: C.navy, bg: C.tintOrange,
        },
        abhishek: {   // boy · heavier build · light beard 
            gender: 'm', skin: '#E3AE85', hair: 'neat', hairColor: C.hairBlack, face: 'full',
            headRx: 22.5, headRy: 23, shoulders: 42, neck: 9, beard: true,
            outfit: 'shirt', top: C.orange, bg: C.tintAmber,
        },
        yashwanth: {  // boy · young · Telangana · youthful face · short hair
            gender: 'm', skin: '#EDC09A', hair: 'crop', hairColor: C.hairBlack, face: 'oval',
            headRx: 19.5, headRy: 21.5, shoulders: 34, neck: 7, bigEyes: true,
            outfit: 'tee', top: C.orange, bg: C.tintNavy,
        },
        syeda: {      // girl · Bangladesh · long dark hair · friendly smile
            gender: 'f', skin: '#E3AE85', hair: 'long', hairColor: C.hairBlack, face: 'soft',
            headRx: 19, headRy: 22.5, shoulders: 31, neck: 6,
            outfit: 'kurti', top: C.navy, trim: C.amber, bg: C.tintOrange,
        },
    };

    /* ---------- painter ---------- */
    function paint(cfg, uid) {
        const cx = 60;
        const cy = cfg.headY || 50;
        const rx = cfg.headRx, ry = cfg.headRy;
        const skin = cfg.skin, skinShade = shade(skin, -0.16), skinLight = shade(skin, 0.14);
        const hairC = cfg.hairColor, hairHi = shade(hairC, 0.22);
        const id = (n) => `${uid}-${n}`;
        const f = (n) => n.toFixed(1);
        const parts = [];

        /* defs: soft 3D shading */
        parts.push(`<defs>
            <radialGradient id="${id('face')}" cx="42%" cy="36%" r="70%">
                <stop offset="0" stop-color="${skinLight}"/><stop offset="0.65" stop-color="${skin}"/><stop offset="1" stop-color="${skinShade}"/>
            </radialGradient>
            <linearGradient id="${id('top')}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${shade(cfg.top, 0.12)}"/><stop offset="1" stop-color="${shade(cfg.top, -0.12)}"/>
            </linearGradient>
            <linearGradient id="${id('hair')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="${hairHi}"/><stop offset="1" stop-color="${hairC}"/>
            </linearGradient>
            <clipPath id="${id('clip')}"><circle cx="60" cy="60" r="60"/></clipPath>
        </defs>`);
        parts.push(`<g clip-path="url(#${id('clip')})">`);
        parts.push(`<circle cx="60" cy="60" r="60" fill="${cfg.bg}"/>`);
        parts.push(`<circle cx="44" cy="36" r="34" fill="#FFFFFF" opacity="0.35"/>`);
        parts.push(`<g transform="translate(60 67) scale(1.16) translate(-60 -60)">`);

        /* back hair (behind head + shoulders) */
        if (cfg.hair === 'long') {
            parts.push(`<path d="M${f(cx - rx - 3)} ${f(cy - 6)} C${f(cx - rx - 7)} ${f(cy + 22)} ${f(cx - rx - 11)} ${f(cy + 44)} ${f(cx - rx - 7)} ${f(cy + 62)} L${f(cx + rx + 7)} ${f(cy + 62)} C${f(cx + rx + 11)} ${f(cy + 44)} ${f(cx + rx + 7)} ${f(cy + 22)} ${f(cx + rx + 3)} ${f(cy - 6)} Z" fill="url(#${id('hair')})"/>`);
        } else if (cfg.hair === 'wavy') {
            parts.push(`<path d="M${f(cx - rx - 3)} ${f(cy - 6)} C${f(cx - rx - 9)} ${f(cy + 14)} ${f(cx - rx - 4)} ${f(cy + 26)} ${f(cx - rx - 8)} ${f(cy + 38)} Q${f(cx)} ${f(cy + 46)} ${f(cx + rx + 8)} ${f(cy + 38)} C${f(cx + rx + 4)} ${f(cy + 26)} ${f(cx + rx + 9)} ${f(cy + 14)} ${f(cx + rx + 3)} ${f(cy - 6)} Z" fill="url(#${id('hair')})"/>`);
        } else if (cfg.hair === 'braid') {
            parts.push(`<path d="M${f(cx - rx - 2)} ${f(cy - 4)} C${f(cx - rx - 4)} ${f(cy + 12)} ${f(cx - rx)} ${f(cy + 22)} ${f(cx)} ${f(cy + 24)} C${f(cx + rx)} ${f(cy + 22)} ${f(cx + rx + 4)} ${f(cy + 12)} ${f(cx + rx + 2)} ${f(cy - 4)} Z" fill="url(#${id('hair')})"/>`);
        }

        /* neck + torso */
        const nw = cfg.neck, sw = cfg.shoulders, ny = cy + ry * 0.62, sy = cy + ry + 11;
        parts.push(`<rect x="${f(cx - nw)}" y="${f(ny)}" width="${f(nw * 2)}" height="${f(sy - ny + 6)}" rx="${f(nw * 0.6)}" fill="${skinShade}"/>`);
        const torso = `M${f(cx - sw)} 124 C${f(cx - sw)} ${f(sy + 14)} ${f(cx - sw * 0.82)} ${f(sy + 2)} ${f(cx - nw - 4)} ${f(sy)} L${f(cx + nw + 4)} ${f(sy)} C${f(cx + sw * 0.82)} ${f(sy + 2)} ${f(cx + sw)} ${f(sy + 14)} ${f(cx + sw)} 124 Z`;
        if (cfg.outfit === 'hoodie') {
            parts.push(`<path d="M${f(cx - nw - 9)} ${f(sy + 2)} Q${f(cx)} ${f(sy - 9)} ${f(cx + nw + 9)} ${f(sy + 2)} L${f(cx + nw + 6)} ${f(sy + 8)} L${f(cx - nw - 6)} ${f(sy + 8)} Z" fill="${shade(cfg.top, -0.25)}"/>`);
        }
        parts.push(`<path d="${torso}" fill="url(#${id('top')})"/>`);

        if (cfg.outfit === 'tee') {
            parts.push(`<path d="M${f(cx - nw - 2)} ${f(sy - 1)} Q${f(cx)} ${f(sy + 9)} ${f(cx + nw + 2)} ${f(sy - 1)}" fill="${skinShade}" stroke="${shade(cfg.top, -0.25)}" stroke-width="2.4"/>`);
        } else if (cfg.outfit === 'shirt') {
            parts.push(`<path d="M${f(cx - nw - 1)} ${f(sy - 1)} L${f(cx)} ${f(sy + 10)} L${f(cx + nw + 1)} ${f(sy - 1)} Z" fill="${skinShade}"/>`);
            parts.push(`<path d="M${f(cx - nw - 3)} ${f(sy - 3)} L${f(cx - 1)} ${f(sy + 10)} L${f(cx - nw - 9)} ${f(sy + 8)} Z" fill="${C.white}"/>`);
            parts.push(`<path d="M${f(cx + nw + 3)} ${f(sy - 3)} L${f(cx + 1)} ${f(sy + 10)} L${f(cx + nw + 9)} ${f(sy + 8)} Z" fill="${C.white}"/>`);
            parts.push(`<line x1="${cx}" y1="${f(sy + 10)}" x2="${cx}" y2="124" stroke="${shade(cfg.top, -0.3)}" stroke-width="1.2"/>`);
            [16, 24].forEach((d) => parts.push(`<circle cx="${cx + 2.2}" cy="${f(sy + d)}" r="1.1" fill="${C.white}"/>`));
        } else if (cfg.outfit === 'kurti') {
            parts.push(`<path d="M${f(cx - nw - 2)} ${f(sy - 1)} L${f(cx)} ${f(sy + 12)} L${f(cx + nw + 2)} ${f(sy - 1)} Z" fill="${skinShade}"/>`);
            parts.push(`<path d="M${f(cx - nw - 3)} ${f(sy - 1)} L${f(cx)} ${f(sy + 13)} L${f(cx + nw + 3)} ${f(sy - 1)}" fill="none" stroke="${cfg.trim}" stroke-width="2.2" stroke-linejoin="round"/>`);
            [[-14, 18], [13, 20], [-9, 27], [8, 28], [-18, 26], [18, 27]].forEach(([dx, dy]) =>
                parts.push(`<circle cx="${f(cx + dx)}" cy="${f(sy + dy)}" r="1.3" fill="${cfg.trim}" opacity="0.85"/>`));
        } else if (cfg.outfit === 'hoodie') {
            parts.push(`<path d="M${f(cx - nw - 2)} ${f(sy - 1)} Q${f(cx)} ${f(sy + 8)} ${f(cx + nw + 2)} ${f(sy - 1)}" fill="${skinShade}"/>`);
            parts.push(`<path d="M${f(cx - nw - 6)} ${f(sy + 1)} Q${f(cx)} ${f(sy + 14)} ${f(cx + nw + 6)} ${f(sy + 1)}" fill="none" stroke="${shade(cfg.top, -0.3)}" stroke-width="3"/>`);
            parts.push(`<path d="M${f(cx - 4)} ${f(sy + 8)} l-1 12 M${f(cx + 4)} ${f(sy + 8)} l1 12" stroke="${C.white}" stroke-width="1.6" stroke-linecap="round"/>`);
        }

        /* braid over the shoulder */
        if (cfg.hair === 'braid') {
            for (let i = 0; i < 6; i++) {
                const bx = cx - rx + 1 + i * 0.9, by = cy + 18 + i * 7.5;
                parts.push(`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="4.6" ry="4.6" fill="url(#${id('hair')})" stroke="${shade(hairC, -0.3)}" stroke-width="0.6"/>`);
            }
            parts.push(`<circle cx="${f(cx - rx + 6.2)}" cy="${f(cy + 62)}" r="2" fill="${C.orange}"/>`);
        }

        /* ears */
        parts.push(`<ellipse cx="${f(cx - rx + 0.5)}" cy="${f(cy + 4)}" rx="3.6" ry="5.2" fill="${skinShade}"/>`);
        parts.push(`<ellipse cx="${f(cx + rx - 0.5)}" cy="${f(cy + 4)}" rx="3.6" ry="5.2" fill="${skinShade}"/>`);

        /* head */
        const top = `M${f(cx - rx)} ${f(cy)} C${f(cx - rx)} ${f(cy - ry * 1.33)} ${f(cx + rx)} ${f(cy - ry * 1.33)} ${f(cx + rx)} ${f(cy)}`;
        let jaw;
        switch (cfg.face) {
            case 'sharp':
                jaw = `L${f(cx + rx * 0.97)} ${f(cy + ry * 0.42)} L${f(cx + rx * 0.58)} ${f(cy + ry * 0.9)} Q${f(cx)} ${f(cy + ry * 1.1)} ${f(cx - rx * 0.58)} ${f(cy + ry * 0.9)} L${f(cx - rx * 0.97)} ${f(cy + ry * 0.42)} Z`;
                break;
            case 'round':
                jaw = `C${f(cx + rx * 1.02)} ${f(cy + ry * 1.25)} ${f(cx - rx * 1.02)} ${f(cy + ry * 1.25)} ${f(cx - rx)} ${f(cy)} Z`;
                break;
            case 'full':
                jaw = `C${f(cx + rx)} ${f(cy + ry * 0.9)} ${f(cx + rx * 0.55)} ${f(cy + ry * 1.08)} ${f(cx)} ${f(cy + ry * 1.08)} C${f(cx - rx * 0.55)} ${f(cy + ry * 1.08)} ${f(cx - rx)} ${f(cy + ry * 0.9)} ${f(cx - rx)} ${f(cy)} Z`;
                break;
            case 'soft':
            case 'slim':
                jaw = `C${f(cx + rx)} ${f(cy + ry * 0.82)} ${f(cx + rx * 0.42)} ${f(cy + ry * 1.08)} ${f(cx)} ${f(cy + ry * 1.08)} C${f(cx - rx * 0.42)} ${f(cy + ry * 1.08)} ${f(cx - rx)} ${f(cy + ry * 0.82)} ${f(cx - rx)} ${f(cy)} Z`;
                break;
            default: // oval
                jaw = `C${f(cx + rx)} ${f(cy + ry * 1.3)} ${f(cx - rx)} ${f(cy + ry * 1.3)} ${f(cx - rx)} ${f(cy)} Z`;
        }
        parts.push(`<path d="${top} ${jaw}" fill="url(#${id('face')})"/>`);

        /* light beard */
        if (cfg.beard) {
            parts.push(`<path d="M${f(cx - rx + 1)} ${f(cy + 4)} C${f(cx - rx + 2)} ${f(cy + ry * 0.95)} ${f(cx - 8)} ${f(cy + ry * 1.1)} ${f(cx)} ${f(cy + ry * 1.1)} C${f(cx + 8)} ${f(cy + ry * 1.1)} ${f(cx + rx - 2)} ${f(cy + ry * 0.95)} ${f(cx + rx - 1)} ${f(cy + 4)} C${f(cx + rx - 4)} ${f(cy + 14)} ${f(cx + 9)} ${f(cy + 14)} ${f(cx + 7)} ${f(cy + 19)} Q${f(cx)} ${f(cy + 23)} ${f(cx - 7)} ${f(cy + 19)} C${f(cx - 9)} ${f(cy + 14)} ${f(cx - rx + 4)} ${f(cy + 14)} ${f(cx - rx + 1)} ${f(cy + 4)} Z" fill="${hairC}" opacity="0.32"/>`);
            parts.push(`<path d="M${f(cx - 7)} ${f(cy + 13.5)} Q${f(cx)} ${f(cy + 11)} ${f(cx + 7)} ${f(cy + 13.5)}" stroke="${hairC}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.45"/>`);
        }

        /* cheeks */
        const blushOp = cfg.cheeks ? 0.32 : 0.2;
        const ex = rx * 0.42, ey = cy + 3;
        parts.push(`<ellipse cx="${f(cx - ex - 4)}" cy="${f(ey + 9)}" rx="${cfg.cheeks ? 5 : 4}" ry="2.6" fill="#FF7A6B" opacity="${blushOp}"/>`);
        parts.push(`<ellipse cx="${f(cx + ex + 4)}" cy="${f(ey + 9)}" rx="${cfg.cheeks ? 5 : 4}" ry="2.6" fill="#FF7A6B" opacity="${blushOp}"/>`);

        /* eyes — big & expressive */
        const er = cfg.bigEyes ? 1.1 : 1;
        [-1, 1].forEach((s) => {
            const x = cx + s * ex;
            parts.push(`<ellipse cx="${f(x)}" cy="${f(ey)}" rx="${f(4.6 * er)}" ry="${f(5.4 * er)}" fill="#FFFFFF"/>`);
            parts.push(`<circle cx="${f(x + 0.4)}" cy="${f(ey + 0.6)}" r="${f(3.4 * er)}" fill="#3B2417"/>`);
            parts.push(`<circle cx="${f(x + 0.4)}" cy="${f(ey + 0.8)}" r="${f(1.8 * er)}" fill="#120B07"/>`);
            parts.push(`<circle cx="${f(x + 1.6)}" cy="${f(ey - 1)}" r="1.2" fill="#FFFFFF"/>`);
            parts.push(`<path d="M${f(x - 4.8 * er)} ${f(ey - 1.5)} Q${f(x)} ${f(ey - 7 * er)} ${f(x + 4.8 * er)} ${f(ey - 1.5)}" fill="none" stroke="#1E1410" stroke-width="1.5" stroke-linecap="round"/>`);
            if (cfg.gender === 'f') {
                const ox = x + s * 4.6 * er;
                parts.push(`<path d="M${f(ox)} ${f(ey - 2.4)} l${f(s * 2.2)} -1.8" stroke="#1E1410" stroke-width="1.2" stroke-linecap="round"/>`);
            }
            // eyebrow
            parts.push(`<path d="M${f(x - 4.5)} ${f(ey - 8.5)} Q${f(x)} ${f(ey - 11)} ${f(x + 4.5)} ${f(ey - 8.8)}" fill="none" stroke="${hairC}" stroke-width="${cfg.gender === 'f' ? 1.6 : 2.2}" stroke-linecap="round"/>`);
        });

        /* nose + smile */
        parts.push(`<path d="M${f(cx - 1.8)} ${f(cy + 10)} Q${f(cx)} ${f(cy + 12)} ${f(cx + 1.8)} ${f(cy + 10)}" fill="none" stroke="${shade(skin, -0.32)}" stroke-width="1.3" stroke-linecap="round"/>`);
        const my = cy + 15;
        parts.push(`<path d="M${f(cx - 6.5)} ${f(my)} Q${f(cx)} ${f(my + 1.2)} ${f(cx + 6.5)} ${f(my)} Q${f(cx)} ${f(my + 8.5)} ${f(cx - 6.5)} ${f(my)} Z" fill="#7E2D2B"/>`);
        parts.push(`<path d="M${f(cx - 5.4)} ${f(my + 0.5)} Q${f(cx)} ${f(my + 1.6)} ${f(cx + 5.4)} ${f(my + 0.5)} L${f(cx + 4.6)} ${f(my + 2.4)} Q${f(cx)} ${f(my + 3.4)} ${f(cx - 4.6)} ${f(my + 2.4)} Z" fill="#FFFFFF"/>`);
        parts.push(`<path d="M${f(cx - 3)} ${f(my + 5)} Q${f(cx)} ${f(my + 3.6)} ${f(cx + 3)} ${f(my + 5)} Q${f(cx)} ${f(my + 6.3)} ${f(cx - 3)} ${f(my + 5)} Z" fill="#E0736B"/>`);

        /* glasses */
        if (cfg.glasses) {
            [-1, 1].forEach((s) => {
                const x = cx + s * ex;
                parts.push(`<rect x="${f(x - 7)}" y="${f(ey - 6)}" width="14" height="12" rx="4" fill="#FFFFFF" fill-opacity="0.18" stroke="#1F2533" stroke-width="1.7"/>`);
            });
            parts.push(`<path d="M${f(cx - ex + 7)} ${f(ey - 1)} Q${f(cx)} ${f(ey - 3.5)} ${f(cx + ex - 7)} ${f(ey - 1)}" fill="none" stroke="#1F2533" stroke-width="1.6"/>`);
            parts.push(`<path d="M${f(cx - ex - 7)} ${f(ey - 1)} L${f(cx - rx + 0.5)} ${f(ey - 2)} M${f(cx + ex + 7)} ${f(ey - 1)} L${f(cx + rx - 0.5)} ${f(ey - 2)}" stroke="#1F2533" stroke-width="1.6"/>`);
        }

        /* front hair */
        const H = `fill="url(#${id('hair')})"`;
        if (cfg.gender === 'm') {
            if (cfg.hair === 'crop') {
                parts.push(`<path d="M${f(cx - rx - 0.5)} ${f(cy + 1)} C${f(cx - rx - 1)} ${f(cy - ry * 1.42)} ${f(cx + rx + 1)} ${f(cy - ry * 1.42)} ${f(cx + rx + 0.5)} ${f(cy + 1)} L${f(cx + rx - 1.5)} ${f(cy - 5)} Q${f(cx + rx * 0.5)} ${f(cy - ry * 0.62)} ${f(cx)} ${f(cy - ry * 0.64)} Q${f(cx - rx * 0.5)} ${f(cy - ry * 0.62)} ${f(cx - rx + 1.5)} ${f(cy - 5)} Z" ${H}/>`);
            } else if (cfg.hair === 'full') {
                parts.push(`<path d="M${f(cx - rx - 1.5)} ${f(cy + 2)} C${f(cx - rx - 3)} ${f(cy - ry * 1.62)} ${f(cx + rx + 3)} ${f(cy - ry * 1.62)} ${f(cx + rx + 1.5)} ${f(cy + 2)} L${f(cx + rx - 1)} ${f(cy - 5)} Q${f(cx + rx * 0.4)} ${f(cy - ry * 0.48)} ${f(cx - rx * 0.1)} ${f(cy - ry * 0.62)} Q${f(cx - rx * 0.7)} ${f(cy - ry * 0.48)} ${f(cx - rx + 1)} ${f(cy - 4)} Z" ${H}/>`);
                parts.push(`<path d="M${f(cx - rx * 0.4)} ${f(cy - ry * 1.05)} Q${f(cx + rx * 0.2)} ${f(cy - ry * 1.2)} ${f(cx + rx * 0.6)} ${f(cy - ry * 0.9)}" fill="none" stroke="${hairHi}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>`);
            } else { // neat side-swept
                parts.push(`<path d="M${f(cx - rx - 1)} ${f(cy + 2)} C${f(cx - rx - 2)} ${f(cy - ry * 1.48)} ${f(cx + rx + 2)} ${f(cy - ry * 1.48)} ${f(cx + rx + 1)} ${f(cy + 2)} L${f(cx + rx - 1)} ${f(cy - 5)} Q${f(cx + rx * 0.2)} ${f(cy - ry * 0.36)} ${f(cx - rx * 0.4)} ${f(cy - ry * 0.52)} Q${f(cx - rx * 0.85)} ${f(cy - ry * 0.46)} ${f(cx - rx + 0.5)} ${f(cy - 2)} Z" ${H}/>`);
                parts.push(`<path d="M${f(cx - rx * 0.6)} ${f(cy - ry * 0.95)} Q${f(cx + rx * 0.1)} ${f(cy - ry * 1.12)} ${f(cx + rx * 0.7)} ${f(cy - ry * 0.75)}" fill="none" stroke="${hairHi}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>`);
            }
        } else {
            // side-parted fringe cap
            parts.push(`<path d="M${f(cx - rx - 1.5)} ${f(cy + 7)} C${f(cx - rx - 3)} ${f(cy - ry * 1.5)} ${f(cx + rx + 3)} ${f(cy - ry * 1.5)} ${f(cx + rx + 1.5)} ${f(cy + 7)} L${f(cx + rx - 1)} ${f(cy + 2)} C${f(cx + rx * 0.75)} ${f(cy - ry * 0.5)} ${f(cx + rx * 0.15)} ${f(cy - ry * 0.7)} ${f(cx - rx * 0.2)} ${f(cy - ry * 0.8)} C${f(cx - rx * 0.55)} ${f(cy - ry * 0.55)} ${f(cx - rx * 0.95)} ${f(cy - ry * 0.35)} ${f(cx - rx + 1)} ${f(cy + 5)} Z" ${H}/>`);
            parts.push(`<path d="M${f(cx - rx * 0.2)} ${f(cy - ry * 0.85)} Q${f(cx + rx * 0.5)} ${f(cy - ry * 1.1)} ${f(cx + rx * 0.85)} ${f(cy - ry * 0.4)}" fill="none" stroke="${hairHi}" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>`);
            if (cfg.hair === 'long') {
                // locks falling over the shoulders
                parts.push(`<path d="M${f(cx - rx - 1)} ${f(cy + 4)} C${f(cx - rx - 4)} ${f(cy + 22)} ${f(cx - rx - 3)} ${f(cy + 40)} ${f(cx - rx + 3)} ${f(cy + 54)} L${f(cx - rx + 9)} ${f(cy + 52)} C${f(cx - rx + 4)} ${f(cy + 38)} ${f(cx - rx + 2)} ${f(cy + 20)} ${f(cx - rx + 2.5)} ${f(cy + 6)} Z" ${H}/>`);
                parts.push(`<path d="M${f(cx + rx + 1)} ${f(cy + 4)} C${f(cx + rx + 4)} ${f(cy + 22)} ${f(cx + rx + 3)} ${f(cy + 40)} ${f(cx + rx - 3)} ${f(cy + 54)} L${f(cx + rx - 9)} ${f(cy + 52)} C${f(cx + rx - 4)} ${f(cy + 38)} ${f(cx + rx - 2)} ${f(cy + 20)} ${f(cx + rx - 2.5)} ${f(cy + 6)} Z" ${H}/>`);
            } else if (cfg.hair === 'wavy') {
                parts.push(`<path d="M${f(cx - rx - 1)} ${f(cy + 4)} C${f(cx - rx - 5)} ${f(cy + 16)} ${f(cx - rx)} ${f(cy + 24)} ${f(cx - rx - 3)} ${f(cy + 34)} L${f(cx - rx + 4)} ${f(cy + 32)} C${f(cx - rx + 5)} ${f(cy + 22)} ${f(cx - rx + 1)} ${f(cy + 16)} ${f(cx - rx + 2.5)} ${f(cy + 6)} Z" ${H}/>`);
                parts.push(`<path d="M${f(cx + rx + 1)} ${f(cy + 4)} C${f(cx + rx + 5)} ${f(cy + 16)} ${f(cx + rx)} ${f(cy + 24)} ${f(cx + rx + 3)} ${f(cy + 34)} L${f(cx + rx - 4)} ${f(cy + 32)} C${f(cx + rx - 5)} ${f(cy + 22)} ${f(cx + rx - 1)} ${f(cy + 16)} ${f(cx + rx - 2.5)} ${f(cy + 6)} Z" ${H}/>`);
            }
        }

        parts.push('</g></g>');
        return parts.join('');
    }

    let counter = 0;
    window.DenkAvatars = {
        has: (key) => Object.prototype.hasOwnProperty.call(MEMBERS, key),
        render(key, label) {
            const cfg = MEMBERS[key];
            if (!cfg) return '';
            const uid = `av-${key}-${++counter}`;
            return `<svg class="avatar-svg" viewBox="0 0 120 120" role="img" aria-label="${label || ''}" xmlns="http://www.w3.org/2000/svg">${paint(cfg, uid)}</svg>`;
        },
    };
})();
