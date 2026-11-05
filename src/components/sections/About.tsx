import type { ReactNode } from 'react';
import { config, team } from '../../data';
import Reveal from '../Reveal';
import Backdrop from '../ui/Backdrop';
import Section from '../ui/Section';
import SectionHeader from '../ui/SectionHeader';
import WindowBar from '../ui/WindowBar';
import AboutStats from './AboutStats';
import FocusAreas from './FocusAreas';

/** Syntax colours of the little code window */
const c = {
  comment: 'text-white/55 italic dark:text-[#8593b3]',
  kw: 'text-[#c792ea] dark:text-[#ff79c6]',
  var: 'text-accent',
  str: 'text-ok dark:text-[#50fa7b]',
  num: 'text-[#7dd3fc] dark:text-[#8be9fd]',
};

/** One numbered line of the code window */
function CodeLine({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <span className="block whitespace-pre">
      <span
        data-n={n}
        className="inline-block w-10 pr-4 text-right text-white/28 select-none before:content-[attr(data-n)] sm:w-12"
      />
      {children}
    </span>
  );
}

export default function About() {
  const name = config.company.name;

  return (
    <Section className="bg-page">
      <Backdrop pattern="dots" fade="top" />
      <SectionHeader as="h1" eyebrow="// about" title="About Us" />

      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal className="min-w-0 space-y-6 text-lg leading-[1.8] [&_strong]:text-heading">
          <p className="text-[clamp(1.6rem,3.4vw,2.35rem)] leading-tight font-extrabold tracking-tight text-heading">
            We think first. <span className="text-gradient">Then we build.</span>
          </p>
          <p>
            <strong>{name}</strong> is a software engineering company that turns ideas into reliable,
            well-crafted digital products. From AI-powered solutions to web and mobile applications and
            intelligent software systems, we approach every project the same way: understand the problem
            deeply, design with intent, and engineer the solution to last.
          </p>
          <p>
            The name says it all. <strong>&ldquo;Denk&rdquo;</strong> is German for &ldquo;think&rdquo;;{' '}
            <strong>&ldquo;Byte&rdquo;</strong> is the building block of everything digital. Together they
            describe how we work: clear thinking first, clean engineering second. And because our team spans
            AI, data, backend, frontend and deployment, an idea can travel from first sketch to production
            under one roof.
          </p>

          <AboutStats className="pt-4" />
        </Reveal>

        {/* The name, "decoded" as code */}
        <Reveal className="min-w-0" delay={150}>
          <div
            aria-hidden="true"
            className="overflow-hidden rounded-2xl border border-white/8 bg-dark font-mono shadow-[0_24px_50px_rgb(15_24_41/0.28)] dark:border-cyan/20 dark:bg-[#070b14] dark:shadow-[0_24px_50px_rgb(0_0_0/0.55),0_0_60px_rgb(34_211_238/0.07)]"
          >
            <WindowBar title="name.ts" />
            <pre className="m-0 overflow-x-auto py-5 pr-5 text-[clamp(0.72rem,1.5vw,0.9rem)] leading-[1.9] text-white/88">
              <code className="font-mono">
                <CodeLine n={1}>
                  <span className={c.comment}>// the name, decoded</span>
                </CodeLine>
                <CodeLine n={2}>
                  <span className={c.kw}>const</span> <span className={c.var}>{name}</span> = {'{'}
                </CodeLine>
                <CodeLine n={3}>
                  {'  '}denk: <span className={c.str}>&quot;think&quot;</span>,{'      '}
                  <span className={c.comment}>// German</span>
                </CodeLine>
                <CodeLine n={4}>
                  {'  '}byte: <span className={c.str}>&quot;technology&quot;</span>,{'  '}
                  <span className={c.comment}>// digital</span>
                </CodeLine>
                <CodeLine n={5}>
                  {'  '}approach: <span className={c.str}>&quot;think → design → build&quot;</span>,
                </CodeLine>
                <CodeLine n={6}>
                  {'  '}engineers: <span className={c.num}>{team.length}</span>,
                </CodeLine>
                <CodeLine n={7}>
                  {'  '}goal: <span className={c.str}>&quot;ideas → impact&quot;</span>,
                </CodeLine>
                <CodeLine n={8}>{'};'}</CodeLine>
                <CodeLine n={9}> </CodeLine>
                <CodeLine n={10}>
                  <span className={c.kw}>export default</span> <span className={c.var}>{name}</span>;
                </CodeLine>
              </code>
            </pre>
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        <FocusAreas />
      </div>
    </Section>
  );
}
