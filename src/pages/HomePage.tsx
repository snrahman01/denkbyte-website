import { Link } from 'react-router';
import Hero from '../components/Hero';
import PageTitle from '../components/PageTitle';
import Reveal from '../components/Reveal';
import AboutStats from '../components/sections/AboutStats';
import CallToAction from '../components/sections/CallToAction';
import FocusAreas from '../components/sections/FocusAreas';
import ServiceGrid from '../components/sections/Services';
import UpdateList from '../components/sections/UpdateList';
import { ArrowRightIcon } from '../components/icons';
import Backdrop from '../components/ui/Backdrop';
import Button from '../components/ui/Button';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';
import { config } from '../data';

export default function HomePage() {
  return (
    <>
      <PageTitle />
      <Hero />

      {/* About in short: statement, stats, focus areas */}
      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" />
        <SectionHeader eyebrow="// about" title="About Us" />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal className="min-w-0 space-y-5">
            <p className="text-[clamp(1.6rem,3.4vw,2.35rem)] leading-tight font-extrabold tracking-tight text-heading">
              We think first. <span className="text-gradient">Then we build.</span>
            </p>
            <p className="text-lg leading-[1.8]">
              {config.company.name} is a software engineering company that turns ideas into reliable,
              well-crafted digital products, from AI-powered solutions to web and mobile applications.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-bold text-accent-text no-underline hover:underline hover:underline-offset-4"
            >
              More about us <ArrowRightIcon size={16} strokeWidth={2.5} />
            </Link>
          </Reveal>
          <Reveal delay={150} className="min-w-0">
            <AboutStats />
          </Reveal>
        </div>
        <div className="mt-16">
          <FocusAreas />
        </div>
      </Section>

      <Section className="bg-page-alt">
        <SectionHeader eyebrow="// what we do" title="Services & Expertise" />
        <ServiceGrid limit={3} />
        <div className="mt-10 flex justify-center">
          <Button to="/services" size="lg">
            All services <ArrowRightIcon size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </Section>

      <Section className="bg-page">
        <SectionHeader eyebrow="// changelog" title="Latest Updates" />
        <UpdateList limit={2} />
        <Link
          to="/updates"
          className="mt-8 inline-flex items-center gap-2 font-bold text-accent-text no-underline hover:underline hover:underline-offset-4"
        >
          All updates <ArrowRightIcon size={16} strokeWidth={2.5} />
        </Link>
      </Section>

      <Section className="bg-page-alt">
        <CallToAction />
      </Section>
    </>
  );
}
