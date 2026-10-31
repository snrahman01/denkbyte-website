import type { ReactNode } from 'react';
import { services } from '../data';
import Reveal from './Reveal';
import {
  BoltIcon,
  ChartIcon,
  ChipIcon,
  CloudIcon,
  CodeIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
} from './icons';

const iconProps = { size: 28, strokeWidth: 1.7 };

// Icon names used in services.json -> icons
const icons: Record<string, ReactNode> = {
  ai: <ChipIcon {...iconProps} />,
  code: <CodeIcon {...iconProps} />,
  chart: <ChartIcon {...iconProps} />,
  cloud: <CloudIcon {...iconProps} />,
  speed: <BoltIcon {...iconProps} />,
  shield: <ShieldCheckIcon {...iconProps} />,
  default: <PlusCircleIcon {...iconProps} />,
};
export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-eyebrow">// what we do</p>
          <h2>Services &amp; Expertise</h2>
        </Reveal>

        <div className="services-grid">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 120}>
              <article className="service-card">
                <span className="service-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="service-icon">{icons[service.icon ?? ''] ?? icons.default}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>

                {service.tags && service.tags.length > 0 && (
                  <ul className="service-tags" aria-label={`${service.title} topics`}>
                    {service.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
