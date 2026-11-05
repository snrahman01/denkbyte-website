import Hero from '../components/Hero';
import PageTitle from '../components/PageTitle';
import CallToAction from '../components/sections/CallToAction';
import FocusAreas from '../components/sections/FocusAreas';
import ServiceGrid from '../components/sections/Services';
import { ArrowRightIcon } from '../components/icons';
import Backdrop from '../components/ui/Backdrop';
import Button from '../components/ui/Button';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

export default function HomePage() {
  return (
    <>
      <PageTitle />
      <Hero />

      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" />
        <FocusAreas />
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
        <CallToAction />
      </Section>
    </>
  );
}
