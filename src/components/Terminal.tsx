import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { config, services } from '../data';
import { useTheme } from '../hooks/useTheme';
import { scrollToSection } from '../utils/smoothScroll';
import { QUICK_COMMANDS, complete, execute } from '../utils/terminalCommands';
import type { Line } from '../utils/terminalCommands';

interface Entry {
  id: number;
  command: string;
  lines: Line[];
}

const MAX_ENTRIES = 60; // keep the DOM small if someone spams commands

/**
 * The hero terminal. It first plays the intro (`think --digitally`), then hands the prompt to the
 * visitor. Commands are *simulated* (see src/utils/terminalCommands.ts): nothing typed here is ever
 * executed or sent anywhere.
 */
export default function Terminal() {
  const { theme, toggle, setTheme } = useTheme();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // `clear` removes the intro too, like a real shell

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const nextId = useRef(0);
  const startedAt = useRef(Date.now());
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

    const result = execute(command, { theme, history: history.current, startedAt: startedAt.current });
    const { action } = result;

    if (action?.type === 'clear') {
      clearScreen();
      return;
    }

    setEntries((prev) =>
      [...prev, { id: nextId.current++, command, lines: result.lines }].slice(-MAX_ENTRIES),
    );

    if (action?.type === 'goto') {
      // Start after the current key event has finished bubbling: smoothScroll cancels its animation
      // on any `keydown`, which would otherwise kill this scroll the moment the Enter key reaches window.
      const { id } = action;
      window.setTimeout(() => scrollToSection(id), 0);
    }
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

  return (
    <div
      className="terminal"
      role="region"
      aria-label={`Interactive terminal. Type "help" to see the commands.`}
    >
      <div className="terminal-bar" aria-hidden="true">
        <span className="terminal-dot terminal-dot--red" />
        <span className="terminal-dot terminal-dot--yellow" />
        <span className="terminal-dot terminal-dot--green" />
        <span className="terminal-title">{config.company.name.toLowerCase()} — zsh</span>
      </div>

      {/* Mouse convenience only: keyboard users reach the prompt with Tab */}
      <div className="terminal-body" ref={bodyRef} onClick={onBodyClick}>
        {/* Intro: decorative echo of the services list, so it's hidden from screen readers */}
        {showIntro && (
          <div aria-hidden="true">
            <p className="terminal-line" style={{ ['--i' as string]: 0 } as CSSProperties}>
              <span className="t-prompt">$</span> think --digitally
            </p>
            <p className="terminal-line t-dim" style={{ ['--i' as string]: 1 } as CSSProperties}>
              loading services&hellip;
            </p>
            {services.map((service, i) => (
              <p
                className="terminal-line"
                key={service.title}
                style={{ ['--i' as string]: i + 2 } as CSSProperties}
              >
                <span className="t-ok">✓</span> {service.title}
              </p>
            ))}
          </div>
        )}

        {/* What the visitor typed and what came back */}
        <div role="log" aria-label="Terminal output">
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              <p className="terminal-out">
                <span className="t-prompt">$</span> {entry.command}
              </p>
              {entry.lines.map((line, i) => (
                <p className="terminal-out" key={i}>
                  {line.length === 0
                    ? '\u00a0'
                    : line.map((s, j) =>
                        s.href ? (
                          <a
                            key={j}
                            className="t-link"
                            href={s.href}
                            {...(s.href.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {s.text}
                          </a>
                        ) : (
                          <span key={j} className={s.tone ? `t-${s.tone}` : undefined}>
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
          className="terminal-line terminal-input-row"
          style={{ ['--i' as string]: services.length + 2 } as CSSProperties}
          onSubmit={onSubmit}
        >
          <label htmlFor={inputId} className="sr-only">
            Terminal command
          </label>
          <span className="t-prompt" aria-hidden="true">
            $
          </span>
          <span className="terminal-input-wrap">
            <input
              id={inputId}
              ref={inputRef}
              className="terminal-input"
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
            />
            {showFakeCursor && <span className="terminal-cursor" aria-hidden="true" />}
          </span>
        </form>
      </div>

      {/* Quick-start chips: for touch devices and anyone who doesn't know what to type */}
      <div className="terminal-hints">
        <span aria-hidden="true">try:</span>
        {QUICK_COMMANDS.map((command) => (
          <button key={command} type="button" onClick={() => run(command)}>
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
