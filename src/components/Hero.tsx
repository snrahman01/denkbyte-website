import { config, services } from '../data';
import { ArrowRightIcon } from './icons';

const tags = ['AI-powered solutions', 'Web & mobile apps', 'Intelligent software'];

export default function Hero() {
  // "Built with purpose. Engineered for impact." -> two lines, second one highlighted.
  const [first, ...rest] = config.company.tagline.split(/(?<=[.!?])\s+/);
  const second = rest.join(' ');
  const { city, country } = config.contact.address;

  return (
    <header className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            {config.company.name} · Est. {config.company.founded} · {city}, {country}
          </p>

          <h1>
            {first}
            {second && (
              <>
                <br />
                <span className="hero-highlight">{second}</span>
              </>
            )}
          </h1>

          <p className="hero-lead">
            We turn ideas into impactful digital experiences &mdash; from AI-powered solutions to
            web and mobile applications, built by a team of technology enthusiasts.
          </p>

          <div className="hero-actions">
            <a href="#services" className="btn btn-accent btn-lg">
              Explore our services
              <ArrowRightIcon size={18} strokeWidth={2.5} />
            </a>
            <a href="#team" className="btn btn-ghost btn-lg">
              Meet the team
            </a>
          </div>

          <ul className="hero-tags" aria-label="What we do">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        {/* Decorative terminal, nods to the "$ think --digitally" brand line */}
        <div className="terminal" aria-hidden="true">
          <div className="terminal-bar">
            <span className="terminal-dot terminal-dot--red" />
            <span className="terminal-dot terminal-dot--yellow" />
            <span className="terminal-dot terminal-dot--green" />
            <span className="terminal-title">{config.company.name.toLowerCase()} — zsh</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-line" style={{ ['--i' as string]: 0 }}>
              <span className="t-prompt">$</span> think --digitally
            </p>
            <p className="terminal-line t-dim" style={{ ['--i' as string]: 1 }}>
              loading services&hellip;
            </p>
            {services.map((service, i) => (
              <p className="terminal-line" key={service.title} style={{ ['--i' as string]: i + 2 }}>
                <span className="t-ok">✓</span> {service.title}
              </p>
            ))}
            <p className="terminal-line" style={{ ['--i' as string]: services.length + 2 }}>
              <span className="t-prompt">$</span> <span className="terminal-cursor" />
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
