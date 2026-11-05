import PageTitle from '../components/PageTitle';
import TeamGrid from '../components/sections/Team';
import Backdrop, { Glow } from '../components/ui/Backdrop';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';
import { config } from '../data';

export default function TeamPage() {
  return (
    <>
      <PageTitle title="Team" />
      <Section className="overflow-hidden bg-band text-white dark:[background:radial-gradient(620px_420px_at_100%_100%,rgb(34_211_238/0.11),transparent_70%),var(--band)]">
        <Backdrop className="[mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,#000_20%,transparent_80%)]" />
        <Glow className="-bottom-55 -left-45 size-140 opacity-80" />
        <SectionHeader
          as="h1"
          onDark
          eyebrow="// the team"
          title={`The Minds Behind ${config.company.name}`}
          subtitle="Different minds. One vision. Endless possibilities."
        />
        <TeamGrid />
      </Section>
    </>
  );
}
