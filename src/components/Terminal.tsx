import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { config, services } from '../data';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import WindowBar from './ui/WindowBar';
import { QUICK_COMMANDS, complete, execute } from '../utils/terminalCommands';
import type { Line, Tone } from '../utils/terminalCommands';

interface Entry {
  id: number;
  command: string;
  lines: Line[];
}

const MAX_ENTRIES = 60; // keep the DOM small if someone spams commands

const toneClass: Record<Tone, string> = {
  dim: 'text-white/50',
  ok: 'text-ok',
  accent: 'text-accent',
  err: 'text-err',
  head: 'font-bold text-white',
};

/**
 * The hero terminal. It first plays the intro (`think --digitally`), then hands the prompt to the
 * visitor. Commands are *simulated* (see src/utils/terminalCommands.ts): nothing typed here is ever
 * executed or sent anywhere.
 */
export default function Terminal() {
  const { theme, toggle, setTheme } = useTheme();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // `clear` removes the intro too, like a real shell

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const nextId = useRef(0);
  const [startedAt] = useState(() => Date.now());
  const history = useRef<string[]>([]); // submitted commands, oldest first
  const cursor = useRef(-1); // position while browsing history with ↑/↓ (-1 = not browsing)
  const draft = useRef(''); // what was typed before the visitor pressed ↑

  // Keep the newest output in view (scrolls the terminal itself, never the page).
  // Short output: stick to the bottom like a real shell. Output taller than the window (e.g. `help`):
  // start at its first line so nothing is read from the middle.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const last = body.querySelector<HTMLElement>('.terminal-entry:last-child');
    const maxScroll = body.scrollHeight - body.clientHeight;
    if (!last) {
      body.scrollTop = maxScroll;
      return;
    }

    const lastTop = last.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
    body.scrollTop = Math.min(maxScroll, lastTop - 4);
  }, [entries]);

  const clearScreen = () => {
    setShowIntro(false);
    setEntries([]);
  };

  const run = (raw: string) => {
    const command = raw.trim();
    cursor.current = -1;
    draft.current = '';

    if (!command) {
      setEntries((prev) => [...prev, { id: nextId.current++, command: '', lines: [] }].slice(-MAX_ENTRIES));
      return;
    }

    if (history.current[history.current.length - 1] !== command) history.current.push(command);

    const result = execute(command, { theme, history: history.current, startedAt });
    const { action } = result;

    if (action?.type === 'clear') {
      clearScreen();
      return;
    }

    setEntries((prev) =>
      [...prev, { id: nextId.current++, command, lines: result.lines }].slice(-MAX_ENTRIES),
    );

    if (action?.type === 'goto') navigate(action.path);
    if (action?.type === 'theme') {
      if (action.value === 'toggle') toggle();
      else setTheme(action.value);
    }
  };

  const submit = () => {
    run(value);
    setValue('');
  };

  // Backup for the form's own submit (e.g. a mobile keyboard's "send" key).
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const list = history.current;

    if (event.key === 'Enter') {
      if (event.nativeEvent.isComposing) return; // let an IME finish its composition first
      event.preventDefault(); // we submit here, so the form doesn't submit a second time
      submit();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!list.length) return;
      if (cursor.current === -1) {
        draft.current = value;
        cursor.current = list.length - 1;
      } else if (cursor.current > 0) {
        cursor.current -= 1;
      }
      setValue(list[cursor.current]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (cursor.current === -1) return;
      if (cursor.current < list.length - 1) {
        cursor.current += 1;
        setValue(list[cursor.current]);
      } else {
        cursor.current = -1;
        setValue(draft.current);
      }
    } else if (event.key === 'Tab' && !event.shiftKey) {
      // Only take Tab when there is something to complete, so keyboard users can still tab away.
      const completed = complete(value);
      if (completed !== null) {
        event.preventDefault();
        setValue(completed);
      }
    } else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      clearScreen();
    } else if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      // Like a real shell: abandon the current line (but keep Ctrl+C = copy when text is selected).
      const input = event.currentTarget;
      if (input.selectionStart !== input.selectionEnd) return;
      event.preventDefault();
      setEntries((prev) =>
        [...prev, { id: nextId.current++, command: `${value}^C`, lines: [] }].slice(-MAX_ENTRIES),
      );
      setValue('');
    }
  };

  // Clicking anywhere on the terminal focuses the prompt (unless the visitor is selecting text).
  const onBodyClick = (event: MouseEvent) => {
    if ((event.target as Element).closest('a')) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const showFakeCursor = !focused && value === '';
  // Intro lines appear one after another (paused behind the loader / scroll intro, see index.html)
  const introLine = (i: number) => ({ animationDelay: `${0.6 + i * 0.28}s` });

  return (
    <div
      role="region"
      aria-label={`Interactive terminal. Type "help" to see the commands.`}
      className={cn(
        'w-full min-w-0 animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-ink/82 font-mono backdrop-blur-sm [animation-delay:0.3s] max-lg:max-w-130',
        'shadow-[0_30px_60px_rgb(0_0_0/0.4),0_0_0_1px_rgb(232_115_12/0.15)] focus-within:border-accent/50 focus-within:shadow-[0_30px_60px_rgb(0_0_0/0.4),0_0_0_1px_rgb(245_166_35/0.45)]',
        'dark:border-cyan/20 dark:bg-[#050810]/86 dark:shadow-[0_30px_60px_rgb(0_0_0/0.6),0_0_0_1px_rgb(232_115_12/0.14),0_0_70px_rgb(34_211_238/0.1)]',
      )}
    >
      <WindowBar title={`${config.company.name.toLowerCase()} — zsh`} />

      {/* Mouse convenience only: keyboard users reach the prompt with Tab */}
      <div
        ref={bodyRef}
        onClick={onBodyClick}
        className="h-80 cursor-text [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.22)_transparent] overflow-y-auto px-5 pt-5 pb-6 text-[clamp(0.78rem,1.5vw,0.92rem)] leading-loose text-white/90 sm:h-86 sm:px-6"
      >
        {/* Intro: decorative echo of the services list, so it's hidden from screen readers */}
        {showIntro && (
          <div aria-hidden="true">
            <p className="animate-fade-up truncate" style={introLine(0)}>
              <span className="font-bold text-accent">$</span> think --digitally
            </p>
            <p className="animate-fade-up truncate text-white/50" style={introLine(1)}>
              loading services&hellip;
            </p>
            {services.map((service, i) => (
              <p className="animate-fade-up truncate" key={service.title} style={introLine(i + 2)}>
                <span className="text-ok">✓</span> {service.title}
              </p>
            ))}
          </div>
        )}

        {/* What the visitor typed and what came back */}
        <div role="log" aria-label="Terminal output">
          {entries.map((entry) => (
            <div className="terminal-entry mt-1.5" key={entry.id}>
              <p className="leading-[1.7] wrap-anywhere whitespace-pre-wrap">
                <span className="font-bold text-accent">$</span> {entry.command}
              </p>
              {entry.lines.map((line, i) => (
                <p className="leading-[1.7] wrap-anywhere whitespace-pre-wrap" key={i}>
                  {line.length === 0
                    ? ' '
                    : line.map((s, j) =>
                        s.href ? (
                          <a
                            key={j}
                            href={s.href}
                            className="text-accent underline decoration-accent/40 underline-offset-3 hover:decoration-accent"
                            {...(s.href.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {s.text}
                          </a>
                        ) : (
                          <span key={j} className={s.tone ? toneClass[s.tone] : undefined}>
                            {s.text}
                          </span>
                        ),
                      )}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Prompt */}
        <form
          className="flex animate-fade-up items-center gap-[0.6ch]"
          style={introLine(services.length + 2)}
          onSubmit={onSubmit}
        >
          <label htmlFor={inputId} className="sr-only">
            Terminal command
          </label>
          <span className="font-bold text-accent" aria-hidden="true">
            $
          </span>
          <span className="relative min-w-0 flex-1">
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder='type "help"'
              maxLength={120}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              enterKeyHint="send"
              // 16px on touch screens stops iOS from zooming in on focus
              className="block w-full border-0 bg-transparent p-0 leading-[inherit] text-white caret-accent outline-none placeholder:text-white/55 placeholder-shown:indent-[1.1ch] focus-visible:outline-none pointer-coarse:text-base"
            />
            {showFakeCursor && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 -mt-[0.55em] inline-block h-[1.1em] w-[0.6em] animate-blink bg-secondary"
              />
            )}
          </span>
        </form>
      </div>

      {/* Quick-start chips: for touch devices and anyone who doesn't know what to type */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/7 bg-white/3 px-4 py-3 text-[0.76rem] text-white/60 sm:px-5">
        <span aria-hidden="true">try:</span>
        {QUICK_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => run(command)}
            className="min-h-8 rounded-md border border-white/16 bg-white/6 px-2.5 py-1 text-white/88 transition-colors duration-150 hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
