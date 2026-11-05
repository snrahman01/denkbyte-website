import type { ReactNode } from 'react';
import Reveal from '../Reveal';
import Backdrop from '../ui/Backdrop';
import Card from '../ui/Card';
import Chip from '../ui/Chip';
import IconTile from '../ui/IconTile';
import Section from '../ui/Section';
import SectionHeader from '../ui/SectionHeader';
import { BulbIcon, EyeIcon, ShieldCheckIcon, StarIcon, TargetIcon, TrendUpIcon } from '../icons';

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
  { name: 'Innovation', text: 'Constantly pushing boundaries', icon: <BulbIcon {...iconProps} /> },
  { name: 'Integrity', text: 'Honest, transparent partnerships', icon: <ShieldCheckIcon {...iconProps} /> },
  { name: 'Excellence', text: 'Delivering superior quality', icon: <StarIcon {...iconProps} /> },
  { name: 'Impact', text: 'Creating measurable value', icon: <TrendUpIcon {...iconProps} /> },
];

export default function Vision() {
  return (
    <Section className="bg-page-alt">
      <SectionHeader as="h1" eyebrow="// why we build" title="Vision & Mission" />

      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {pillars.map((p, i) => (
          <Reveal key={p.id} delay={i * 150} className="flex">
            <Card barWidth="before:w-16" className="rounded-[20px] p-6 shadow-sm sm:p-10">
              {/* Oversized ghost number */}
              <span
                aria-hidden="true"
                data-index={p.index}
                className="pointer-events-none absolute top-1.5 right-6 font-mono text-[5.5rem] leading-none font-extrabold tracking-[-0.06em] text-ghost select-none before:content-[attr(data-index)]"
              />
              <div className="mb-6 flex items-center gap-4">
                <IconTile className="size-13">{p.icon}</IconTile>
                <h2 className="font-mono text-[0.95rem] font-bold tracking-wider text-accent-text uppercase">
                  {p.title}
                </h2>
              </div>
              <p className="mb-4 text-[clamp(1.3rem,2.4vw,1.65rem)] leading-tight font-extrabold tracking-tight text-heading">
                {p.statement}
              </p>
              <p className="mb-6 leading-[1.8] text-muted">{p.text}</p>
              <ul className="mt-auto flex flex-wrap gap-2" aria-label={`${p.title} keywords`}>
                {p.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Core values: dark band, echoes the hero */}
      <Reveal delay={100}>
        <div className="relative isolate mt-6 overflow-hidden rounded-[20px] bg-band p-6 text-white sm:p-10 dark:border dark:border-line">
          <Backdrop fade="top-right" className="[--grid-size:40px]" />
          <h2 className="mb-6 font-mono text-base font-bold">
            <span className="text-accent">&gt; </span>Our Core Values
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.name}
                className="relative flex flex-col gap-1.5 rounded-xl border border-white/12 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/9"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-6 font-mono text-xs font-bold text-white/30"
                >
                  0{i + 1}
                </span>
                <IconTile tone="dark" className="mb-4 size-13">
                  {v.icon}
                </IconTile>
                <strong className="text-lg">{v.name}</strong>
                <span className="text-sm leading-relaxed text-white/72">{v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
