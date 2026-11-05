import { useLocation } from 'react-router';
import { ArrowRightIcon } from '../components/icons';
import Logo from '../components/Logo';
import PageTitle from '../components/PageTitle';
import ThemeToggle from '../components/ThemeToggle';
import Backdrop, { Glow } from '../components/ui/Backdrop';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import { config } from '../data';

/** Any unknown URL. Netlify also sends a real 404 status for these (see netlify.toml). */
export default function NotFoundPage() {
  const { pathname } = useLocation();
  // Keep the terminal line short on very long or odd URLs.
  const path = pathname.length > 32 ? `${pathname.slice(0, 31)}…` : pathname;

  return (
    <div className="flex min-h-dvh flex-col">
      <PageTitle title="404 · Page not found" />
      {/* Search engines shouldn't index the error page (React 19 moves this into <head>) */}
      <meta name="robots" content="noindex" />

      <header className="border-b border-line bg-nav backdrop-blur-md">
        <Container className="flex h-18 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </Container>
      </header>

      <main
        id="main"
        className="relative isolate flex flex-1 items-center overflow-hidden bg-band py-14 text-center text-white sm:py-20"
      >
        <Backdrop fade="center" />
        <Glow className="top-1/2 left-1/2 size-160 -translate-x-1/2 -translate-y-3/5 opacity-90" />

        <Container className="flex flex-col items-center">
          <div
            aria-hidden="true"
            className="mb-8 flex animate-fade-up items-center justify-center gap-1 font-mono text-[clamp(5rem,18vw,10rem)] leading-none font-extrabold tracking-[-0.05em] sm:gap-3"
          >
            <span className="bg-linear-to-b from-white to-white/55 bg-clip-text text-transparent">4</span>
            <span className="inline-block animate-float text-[0.82em] drop-shadow-[0_12px_28px_rgb(245_166_35/0.35)]">
              👻
            </span>
            <span className="bg-linear-to-b from-white to-white/55 bg-clip-text text-transparent">4</span>
          </div>

          <h1 className="mb-4 animate-fade-up text-[clamp(1.9rem,4.6vw,3.1rem)] leading-tight font-extrabold tracking-tight [animation-delay:0.1s]">
            This page <span className="text-gradient">ghosted you</span>&nbsp;👻
          </h1>

          <p className="mb-8 max-w-lg animate-fade-up text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7] text-white/78 [animation-delay:0.2s]">
            It&rsquo;s not you, it&rsquo;s us. Let&rsquo;s get you back home.
          </p>

          <p
            aria-hidden="true"
            className="mb-12 max-w-full animate-fade-up rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-left font-mono text-sm leading-[1.7] wrap-anywhere text-white/85 [animation-delay:0.3s]"
          >
            <span className="font-bold text-secondary">$</span> cd {path}
            <br />
            <span className="text-[#ff8a7a]">error 404: no such page or directory</span>
          </p>

          <Button to="/" size="lg" className="animate-fade-up [animation-delay:0.4s]">
            Take me home
            <ArrowRightIcon size={18} strokeWidth={2.5} />
          </Button>
        </Container>
      </main>

      <footer className="bg-footer px-4 py-5 text-center text-sm text-white/60">
        <p className="mx-auto mb-1 max-w-2xl font-semibold text-white/85">{config.legal.disclaimer}</p>
        &copy; {new Date().getFullYear()} {config.company.name}
      </footer>
    </div>
  );
}
