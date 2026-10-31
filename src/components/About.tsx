import { useEffect, useState } from 'react';
import { config, services, team } from '../data';
import { useInView } from '../hooks/useInView';
import Reveal from './Reveal';
import { ChipIcon, CodeIcon, MonitorIcon } from './icons';

/** Counts from 0 up to `value` once visible (instantly if the user prefers reduced motion). */
function CountUp({ value }: { value: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

const iconProps = { size: 26, strokeWidth: 1.8 };

const focusAreas = [
  {
    title: 'AI-powered solutions',
    text: 'Smart systems that automate work, learn from data and surface patterns people miss.',
    icon: <ChipIcon {...iconProps} />,
  },
  {
    title: 'Web & mobile apps',
    text: 'Fast, accessible and polished interfaces that feel right on every screen.',
    icon: <MonitorIcon {...iconProps} />,
  },
  {
    title: 'Intelligent software',
    text: 'Scalable, maintainable systems engineered to solve real-world challenges.',
    icon: <CodeIcon {...iconProps} />,
  },
];

export default function About() {
  const stats = [
    { label: 'Founded', value: config.company.founded, count: false },
    { label: 'Team members', value: team.length, count: true },
    { label: 'Core services', value: services.length, count: true },
  ];

  return (
    <section id="about" className="section about">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-eyebrow">// about</p>
          <h2>About Us</h2>
        </Reveal>

        <div className="about-layout">
          <Reveal className="about-text">
            <p className="about-lead">
              We think first. <span className="about-lead-accent">Then we build.</span>
            </p>
            <p>
              <strong>{config.company.name}</strong> is a software engineering company that turns
              ideas into reliable, well-crafted digital products. From AI-powered solutions to web
              and mobile applications and intelligent software systems, we approach every project
              the same way: understand the problem deeply, design with intent, and engineer the
              solution to last.
            </p>
            <p>
              The name says it all. <strong>&ldquo;Denk&rdquo;</strong> is German for
              &ldquo;think&rdquo;; <strong>&ldquo;Byte&rdquo;</strong> is the building block of
              everything digital. Together they describe how we work: clear thinking first, clean
              engineering second. And because our team spans AI, data, backend, frontend and
              deployment, an idea can travel from first sketch to production under one roof.
            </p>

            <dl className="about-stats">
              {stats.map((stat) => (
                <div className="about-stat" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.count ? <CountUp value={stat.value} /> : stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* The name, "decoded" as code */}
          <Reveal className="about-code-wrap" delay={150}>
            <div className="code-card" aria-hidden="true">
              <div className="terminal-bar">
                <span className="terminal-dot terminal-dot--red" />
                <span className="terminal-dot terminal-dot--yellow" />
                <span className="terminal-dot terminal-dot--green" />
                <span className="terminal-title">name.ts</span>
              </div>
              <pre className="code-body">
                <code>
                  <span className="code-line">
                    <span className="c-comment">// the name, decoded</span>
                  </span>
                  <span className="code-line">
                    <span className="c-kw">const</span> <span className="c-var">{config.company.name}</span> = {'{'}
                  </span>
                  <span className="code-line">
                    {'  '}denk: <span className="c-str">&quot;think&quot;</span>,{'      '}
                    <span className="c-comment">// German</span>
                  </span>
                  <span className="code-line">
                    {'  '}byte: <span className="c-str">&quot;technology&quot;</span>,{'  '}
                    <span className="c-comment">// digital</span>
                  </span>
                  <span className="code-line">
                    {'  '}approach: <span className="c-str">&quot;think → design → build&quot;</span>,
                  </span>
                  <span className="code-line">
                    {'  '}engineers: <span className="c-num">{team.length}</span>,
                  </span>
                  <span className="code-line">
                    {'  '}goal: <span className="c-str">&quot;ideas → impact&quot;</span>,
                  </span>
                  <span className="code-line">{'};'}</span>
                  <span className="code-line">&nbsp;</span>
                  <span className="code-line">
                    <span className="c-kw">export default</span> <span className="c-var">{config.company.name}</span>;
                  </span>
                </code>
              </pre>
            </div>
          </Reveal>
        </div>

        <h3 className="about-focus-title">What we specialize in</h3>
        <div className="focus-grid">
          {focusAreas.map((area, i) => (
            <Reveal key={area.title} delay={i * 120}>
              <article className="focus-card">
                <span className="focus-index">0{i + 1}</span>
                <div className="focus-icon">{area.icon}</div>
                <h4>{area.title}</h4>
                <p>{area.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
