import { config, services, team } from '../data';
import type { Theme } from '../hooks/useTheme';
import { bareUrl } from './url';

/**
 * The brains of the hero terminal. This is a *simulated* shell: nothing the visitor types is ever
 * evaluated or sent anywhere, it is only matched against the command table below.
 *
 * All answers are built from src/data/*.json, so editing services/team/contact there updates the
 * terminal automatically.
 */

/* ---------- Output model ---------- */

export type Tone = 'dim' | 'ok' | 'accent' | 'err' | 'head';

/** A styled piece of text; give it `href` to render a link. */
interface Seg {
  text: string;
  tone?: Tone;
  href?: string;
}

/** One output line. An empty array renders as a blank spacer line. */
export type Line = Seg[];

/** Things a command wants to happen *outside* the terminal (the component performs them). */
type Action = { type: 'clear' } | { type: 'goto'; path: string } | { type: 'theme'; value: Theme | 'toggle' };

export interface Result {
  lines: Line[];
  action?: Action;
}

export interface Context {
  theme: Theme;
  /** Commands entered so far (oldest first, includes the current one). */
  history: string[];
  /** When the page loaded, for the `neofetch` uptime. */
  startedAt: number;
}

interface Command {
  name: string;
  usage: string;
  desc: string;
  /** Hidden commands work but aren't listed in `help` (easter eggs and shell basics). */
  hidden?: boolean;
  run: (args: string[], ctx: Context) => Result;
}

/* ---------- Small helpers ---------- */

const seg = (text: string, tone?: Tone): Seg => ({ text, tone });
const text = (value: string, tone?: Tone): Line => [seg(value, tone)];
const blank: Line = [];
const out = (...lines: Line[]): Result => ({ lines });
const error = (message: string): Result => out(text(message, 'err'));
const pad = (value: string, width: number) => value.padEnd(width, ' ');
const two = (n: number) => String(n + 1).padStart(2, '0');
/** Pages `goto` can open ("home" = the homepage) */
const SECTIONS = ['home', 'about', 'vision', 'services', 'team', 'patch-notes', 'contact'] as const;
const THEMES = ['dark', 'light'] as const;
const unique = <T>(items: T[]) => [...new Set(items)];

/**
 * Looks a key up in a plain object, own keys only. Visitors type the keys, so `FILES['constructor']`
 * or `FILES['__proto__']` must not resolve to something inherited from Object.prototype.
 */
const own = <T>(table: Record<string, T>, key: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;

/* ---------- Commands ---------- */

const about = (): Result => {
  const { name, tagline, founded } = config.company;
  const { city, country } = config.contact.address;
  return out(
    text(`${name} — ${tagline}`, 'head'),
    text(`A software engineering team from ${city}, ${country}, founded in ${founded}.`),
    text('We build AI-powered solutions, web & mobile apps and intelligent software systems.'),
    text('We think first. Then we build.', 'accent'),
    blank,
    text(`${team.length} engineers · ${services.length} core services`, 'dim'),
  );
};

const listServices = (args: string[]): Result => {
  if (args[0] === undefined) {
    return out(
      ...services.map((s, i): Line => [seg(`${two(i)} `, 'dim'), seg('✓ ', 'ok'), seg(s.title)]),
      blank,
      text('Tip: "services 2" for details', 'dim'),
    );
  }

  const index = Number(args[0]) - 1;
  const service = Number.isInteger(index) ? services[index] : undefined;
  if (!service) return error(`services: no service "${args[0]}" (try 1-${services.length})`);

  return out(
    text(service.title, 'head'),
    text(service.description),
    blank,
    (service.tags ?? []).flatMap((tag, i): Seg[] => [...(i ? [seg(' ')] : []), seg(`[${tag}]`, 'accent')]),
  );
};

const listTeam = (args: string[]): Result => {
  // "team member 3" and the shorter "team 3" both open one person.
  const query = args[0]?.toLowerCase() === 'member' ? args[1] : args[0];

  if (query === undefined) {
    return out(
      ...team.map((m, i): Line => [seg(`${two(i)} `, 'dim'), seg(m.name), seg(` · ${m.role}`, 'dim')]),
      blank,
      text('Tip: "team member 3" for a closer look', 'dim'),
    );
  }

  const index = Number(query) - 1;
  const member = Number.isInteger(index) ? team[index] : undefined;
  if (!member) return error(`team: no member "${query}" (try 1-${team.length})`);

  const links = [
    { label: 'github   ', url: member.github },
    { label: 'gitlab   ', url: member.gitlab },
    { label: 'linkedin ', url: member.linkedin },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url));

  return out(
    [seg(member.name, 'head')],
    text(member.role, 'accent'),
    ...(member.bio ? [text(member.bio)] : []),
    blank,
    ...links.map((l): Line => [seg(l.label, 'dim'), { text: bareUrl(l.url), href: l.url, tone: 'accent' }]),
  );
};

const contact = (): Result => {
  const { email, linkedin, instagram, address } = config.contact;
  return out(
    [seg('email     ', 'dim'), { text: email, href: `mailto:${email}`, tone: 'accent' }],
    ...(linkedin
      ? [[seg('linkedin  ', 'dim'), { text: bareUrl(linkedin), href: linkedin, tone: 'accent' }] as Line]
      : []),
    ...(instagram
      ? [[seg('instagram ', 'dim'), { text: bareUrl(instagram), href: instagram, tone: 'accent' }] as Line]
      : []),
    [
      seg('address   ', 'dim'),
      seg(`${address.street}, ${address.postal_code} ${address.city}, ${address.country}`),
    ],
    blank,
    text('Or open the contact page: type "goto contact".', 'dim'),
  );
};

const skills = (): Result => {
  const tags = unique(services.flatMap((s) => s.tags ?? []));
  return out(
    text('What we know our way around:', 'head'),
    tags.flatMap((tag, i): Seg[] => [...(i ? [seg(' · ', 'dim')] : []), seg(tag)]),
  );
};

const neofetch = (_args: string[], ctx: Context): Result => {
  const { name, founded } = config.company;
  const { city } = config.contact.address;
  const seconds = Math.max(1, Math.round((Date.now() - ctx.startedAt) / 1000));
  const rows: [string, string][] = [
    ['OS', 'Built with purpose'],
    ['Founded', String(founded)],
    ['Base', city],
    ['Team', `${team.length} engineers`],
    ['Services', String(services.length)],
    ['Theme', ctx.theme],
    ['Uptime', `${seconds}s (you just got here)`],
  ];
  const title = `visitor@${name.toLowerCase()}`;
  return out(
    [seg(title, 'accent')],
    text('-'.repeat(title.length), 'dim'),
    ...rows.map(([k, v]): Line => [seg(pad(k, 9), 'accent'), seg(v)]),
  );
};

/** Replays the intro animation: `think --digitally`. */
const think = (args: string[]): Result => {
  if (!args.includes('--digitally')) return error('think: missing flag "--digitally"');
  return out(
    text('loading services…', 'dim'),
    ...services.map((s): Line => [seg('✓ ', 'ok'), seg(s.title)]),
    text('ready.', 'ok'),
  );
};

const goto = (args: string[]): Result => {
  const raw = args[0]?.replace(/^[#/]/, '').toLowerCase();
  const id = raw === 'top' ? 'home' : raw;
  if (!id || !(SECTIONS as readonly string[]).includes(id)) {
    return error(`usage: goto <${SECTIONS.join('|')}>`);
  }
  const path = id === 'home' ? '/' : `/${id}`;
  return {
    lines: [[seg('→ ', 'ok'), seg(path, 'accent')]],
    action: { type: 'goto', path },
  };
};

const theme = (args: string[], ctx: Context): Result => {
  const wanted = args[0]?.toLowerCase();
  if (wanted !== undefined && !(THEMES as readonly string[]).includes(wanted)) {
    return error('usage: theme [dark|light]');
  }
  const next: Theme = wanted ? (wanted as Theme) : ctx.theme === 'dark' ? 'light' : 'dark';
  return {
    lines: [[seg('theme → ', 'dim'), seg(next, 'accent')]],
    action: { type: 'theme', value: next },
  };
};

/** The "files" you can `cat`. Each one is just another view of a command. */
const FILES: Record<string, (ctx: Context) => Result> = {
  'about.md': about,
  'services.md': () => listServices([]),
  'team.md': () => listTeam([]),
  'contact.md': contact,
  'skills.md': skills,
};

const commands: Command[] = [
  { name: 'help', usage: 'help', desc: 'show this list', run: () => help() },
  { name: 'about', usage: 'about', desc: 'who we are', run: about },
  {
    name: 'services',
    usage: 'services [n]',
    desc: 'what we build',
    run: (a) => listServices(a),
  },
  {
    name: 'team',
    usage: 'team [member n]',
    desc: 'the people',
    run: (a) => listTeam(a),
  },
  { name: 'skills', usage: 'skills', desc: 'tools & topics', run: skills },
  { name: 'contact', usage: 'contact', desc: 'say hello', run: contact },
  {
    name: 'goto',
    usage: 'goto <page>',
    desc: 'open a page',
    run: (a) => goto(a),
  },
  {
    name: 'theme',
    usage: 'theme [mode]',
    desc: 'dark / light',
    run: (a, c) => theme(a, c),
  },
  { name: 'neofetch', usage: 'neofetch', desc: 'system info', run: neofetch },
  {
    name: 'clear',
    usage: 'clear',
    desc: 'clean the screen (Ctrl+L)',
    run: () => ({ lines: [], action: { type: 'clear' } }),
  },

  // Hidden: shell basics + easter eggs
  {
    name: 'think',
    usage: 'think --digitally',
    desc: '',
    hidden: true,
    run: (a) => think(a),
  },
  {
    name: 'ls',
    usage: 'ls',
    desc: '',
    hidden: true,
    run: () => out([seg(Object.keys(FILES).join('  '), 'accent')]),
  },
  {
    name: 'cat',
    usage: 'cat <file>',
    desc: '',
    hidden: true,
    run: (a, c) => {
      if (!a[0]) return error('cat: missing file operand (try "ls")');
      const file = own(FILES, a[0]);
      return file ? file(c) : error(`cat: ${a[0]}: No such file or directory`);
    },
  },
  {
    name: 'whoami',
    usage: 'whoami',
    desc: '',
    hidden: true,
    run: () => out(text('visitor')),
  },
  {
    name: 'pwd',
    usage: 'pwd',
    desc: '',
    hidden: true,
    run: () => out(text(`/home/visitor/${config.company.name.toLowerCase()}`)),
  },
  {
    name: 'date',
    usage: 'date',
    desc: '',
    hidden: true,
    run: () =>
      out(
        text(
          new Date().toLocaleString('en-GB', {
            dateStyle: 'full',
            timeStyle: 'medium',
          }),
        ),
      ),
  },
  {
    name: 'echo',
    usage: 'echo <text>',
    desc: '',
    hidden: true,
    run: (a) => out(text(a.join(' '))),
  },
  {
    name: 'history',
    usage: 'history',
    desc: '',
    hidden: true,
    run: (_a, c) =>
      out(...c.history.map((cmd, i): Line => [seg(`${String(i + 1).padStart(3)}  `, 'dim'), seg(cmd)])),
  },
  {
    name: 'sudo',
    usage: 'sudo <command>',
    desc: '',
    hidden: true,
    run: (a) =>
      a[0] === 'hire-us'
        ? {
            lines: [
              text('[sudo] password for visitor: ********', 'dim'),
              text('Access granted. Let’s build something together →', 'ok'),
            ],
            action: { type: 'goto', path: '/contact' },
          }
        : out(text('visitor is not in the sudoers file. This incident will be reported.', 'err')),
  },
  {
    name: 'rm',
    usage: 'rm',
    desc: '',
    hidden: true,
    run: () => error('rm: permission denied. Nice try.'),
  },
  {
    name: 'exit',
    usage: 'exit',
    desc: '',
    hidden: true,
    run: () => out(text('There is no escape. Try "goto home".', 'dim')),
  },
];

function help(): Result {
  const width = Math.max(...commands.filter((c) => !c.hidden).map((c) => c.usage.length)) + 2;
  return out(
    text('Available commands', 'head'),
    ...commands
      .filter((c) => !c.hidden)
      .map((c): Line => [seg(pad(c.usage, width), 'accent'), seg(c.desc, 'dim')]),
    blank,
    text('↑/↓ history · Tab completes · a few hidden ones too…', 'dim'),
  );
}

/* ---------- Execution ---------- */

/** Edit distance, for "did you mean …?" */
function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export function execute(input: string, ctx: Context): Result {
  const [rawName, ...args] = input.trim().split(/\s+/);
  const name = rawName.toLowerCase();
  const command = commands.find((c) => c.name === name);
  if (command) return command.run(args, ctx);

  const lines: Line[] = [text(`zsh: command not found: ${rawName.slice(0, 40)}`, 'err')];
  const guess = commands
    .filter((c) => !c.hidden)
    .map((c) => ({ name: c.name, d: distance(name, c.name) }))
    .sort((a, b) => a.d - b.d)[0];
  if (guess && guess.d <= 2) lines.push(text(`Did you mean "${guess.name}"?`, 'dim'));
  else lines.push(text('Type "help" to see what works.', 'dim'));
  return { lines };
}

/* ---------- Tab completion ---------- */

const ARG_CHOICES: Record<string, string[]> = {
  goto: [...SECTIONS],
  theme: [...THEMES],
  cat: Object.keys(FILES),
  sudo: ['hire-us'],
  team: ['member'],
};

function commonPrefix(items: string[]) {
  return items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === item[i]) i++;
    return prefix.slice(0, i);
  });
}

/** Returns the completed input, or null when there is nothing (new) to complete. */
export function complete(value: string): string | null {
  const parts = value.split(/\s+/);
  const last = parts[parts.length - 1].toLowerCase();
  if (!last) return null;

  const pool =
    parts.length === 1 ? commands.map((c) => c.name) : (own(ARG_CHOICES, parts[0].toLowerCase()) ?? []);
  const matches = pool.filter((item) => item.startsWith(last));
  if (!matches.length) return null;

  const done = matches.length === 1 ? `${matches[0]} ` : commonPrefix(matches);
  if (done.length <= last.length) return null;
  return [...parts.slice(0, -1), done].join(' ');
}

/** Short list shown as quick-start chips under the terminal. */
export const QUICK_COMMANDS = ['help', 'services', 'team', 'theme', 'neofetch'];
