import type { ReactNode } from 'react';
import Reveal from './Reveal';
import {
  BulbIcon,
  EyeIcon,
  ShieldCheckIcon,
  StarIcon,
  TargetIcon,
  TrendUpIcon,
} from './icons';

const iconProps = { size: 28, strokeWidth: 1.7 };

const pillars: {
  id: string;
  index: string;
  title: string;
  statement: string;
  text: string;
  tags: string[];
  icon: ReactNode;
}[] = [
  {
    id: 'mission',
    index: '01',
    title: 'Our Mission',
    statement: 'Empower businesses through intelligent technology and data-driven insights.',
    text: 'We transform complex challenges into elegant solutions, combining creative thinking with technological excellence to drive sustainable growth and measurable impact.',
    tags: ['Intelligent technology', 'Data-driven insights', 'Sustainable growth'],
    icon: <TargetIcon {...iconProps} />,
  },
  {
    id: 'vision',
    index: '02',
    title: 'Our Vision',
    statement: 'To be the trusted partner in digital transformation globally.',
    text: 'We envision a future where organizations leverage AI, analytics, and innovative technologies to make smarter decisions, optimize operations, and unlock new opportunities for growth and innovation.',
    tags: ['AI', 'Analytics', 'Innovation'],
    icon: <EyeIcon {...iconProps} />,
  },
];

const values: { name: string; text: string; icon: ReactNode }[] = [
  {
    name: 'Innovation',
    text: 'constantly pushing boundaries',
    icon: <BulbIcon {...iconProps} />,
  },
  {
    name: 'Integrity',
    text: 'honest, transparent partnerships',
    icon: <ShieldCheckIcon {...iconProps} />,
  },
  {
    name: 'Excellence',
    text: 'delivering superior quality',
    icon: <StarIcon {...iconProps} />,
  },
  {
    name: 'Impact',
    text: 'creating measurable value',
    icon: <TrendUpIcon {...iconProps} />,
  },
];

export default function Vision() {
  return (
    <section id="vision" className="section alternate vision">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-eyebrow">// why we build</p>
          <h2>Vision &amp; Mission</h2>
        </Reveal>

        <div className="pillar-grid">
          {pillars.map((p, i) => (
            <Reveal key={p.id} delay={i * 150}>
              <article className="pillar-card">
                <span className="pillar-index" aria-hidden="true" data-index={p.index} />
                <div className="pillar-top">
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                </div>
                <p className="pillar-statement">{p.statement}</p>
                <p className="pillar-text">{p.text}</p>
                <ul className="pillar-tags" aria-label={`${p.title} keywords`}>
                  {p.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="values-band">
            <h3 className="values-title">Our Core Values</h3>
            <ul className="values-grid">
              {values.map((v, i) => (
                <li className="value-item" key={v.name}>
                  <span className="value-index" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="value-icon">{v.icon}</div>
                  <strong>{v.name}</strong>
                  <span className="value-text">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
