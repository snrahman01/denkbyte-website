import { config } from '../data';
import Backdrop, { Glow } from './ui/Backdrop';
import Button from './ui/Button';
import Container from './ui/Container';
import { ArrowRightIcon } from './icons';
import Terminal from './Terminal';

const tags = ['AI-powered solutions', 'Web & mobile apps', 'Intelligent software'];

export default function Hero() {
  // "Built with purpose. Engineered for impact." -> two lines, second one highlighted.
  const [first, ...rest] = config.company.tagline.split(/(?<=[.!?])\s+/);
  const second = rest.join(' ');
  const { city, country } = config.contact.address;

  return (
    <header className="relative isolate overflow-hidden bg-band py-[clamp(3rem,8vw,6.5rem)] text-white dark:[background:radial-gradient(640px_420px_at_6%_105%,rgb(34_211_238/0.13),transparent_70%),var(--band)]">
      <Backdrop fade="hero" />
      <Glow className="-top-45 -right-35 size-155 opacity-100" />

      <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="min-w-0">
          <p className="mb-6 inline-flex max-w-full animate-fade-up items-center gap-2.5 rounded-full border border-white/16 bg-white/7 py-1.5 pr-4 pl-3 font-mono text-[0.72rem] text-white/85 sm:mb-8 sm:text-[0.78rem]">
            <span aria-hidden="true" className="size-2 flex-none animate-pulse-dot rounded-full bg-accent" />
            <span className="truncate">
              {config.company.name} · Est. {config.company.founded} · {city}, {country}
            </span>
          </p>

          <h1 className="mb-6 animate-fade-up text-[clamp(2.3rem,5.6vw,4.1rem)] leading-[1.07] font-extrabold tracking-[-0.03em] [animation-delay:0.1s] sm:mb-8">
            {first}
            {second && (
              <>
                <br />
                <span className="bg-linear-to-r from-accent to-secondary bg-clip-text text-transparent">
                  {second}
                </span>
              </>
            )}
          </h1>

          <p className="mb-8 max-w-[34rem] animate-fade-up text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7] text-white/78 [animation-delay:0.2s] sm:mb-12">
            We turn ideas into impactful digital experiences &mdash; from AI-powered solutions to web and
            mobile applications, built by a team of technology enthusiasts.
          </p>

          <div className="mb-8 flex animate-fade-up flex-col gap-3 [animation-delay:0.3s] sm:mb-12 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button to="/services" size="lg">
              Explore our services
              <ArrowRightIcon size={18} strokeWidth={2.5} />
            </Button>
            <Button to="/team" size="lg" variant="ghost">
              Meet the team
            </Button>
          </div>

          <ul
            aria-label="What we do"
            className="flex animate-fade-up flex-wrap gap-2.5 [animation-delay:0.4s]"
          >
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/14 px-3.5 py-1 text-[0.82rem] text-white/72"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive terminal: plays the "$ think --digitally" intro, then takes simulated commands */}
        <Terminal />
      </Container>
    </header>
  );
}
