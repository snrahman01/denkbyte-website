import PageTitle from '../components/PageTitle';
import ServiceGrid from '../components/sections/Services';
import Backdrop from '../components/ui/Backdrop';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

export default function ServicesPage() {
  return (
    <>
      <PageTitle title="Services" />
      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" className="mask-b-to-60%" />
        <SectionHeader as="h1" eyebrow="// what we do" title="Services & Expertise" />
        <ServiceGrid />
      </Section>
    </>
  );
}
