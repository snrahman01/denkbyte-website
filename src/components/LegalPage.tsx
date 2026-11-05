import type { ReactNode } from 'react';
import PageTitle from './PageTitle';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

/** Layout for text pages (Impressum, Privacy): readable column, styled headings / lists / links. */
export default function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageTitle title={title} />
      <Section className="bg-page">
        <div className="max-w-3xl">
          <SectionHeader as="h1" eyebrow={eyebrow} title={title} />
          <div className="rounded-xl border border-line bg-surface p-6 leading-[1.8] text-muted shadow-sm sm:p-10 [&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-heading [&_h2:first-child]:mt-0 [&_li]:mb-1 [&_p]:mb-4 [&_strong]:text-heading [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </Section>
    </>
  );
}
