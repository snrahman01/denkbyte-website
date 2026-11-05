import PageTitle from '../components/PageTitle';
import ContactCards from '../components/sections/Contact';
import Backdrop from '../components/ui/Backdrop';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

export default function ContactPage() {
  return (
    <>
      <PageTitle title="Contact" />
      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" className="mask-b-to-65%" />
        <SectionHeader
          as="h1"
          eyebrow="// contact"
          title="We Were Expecting You!"
          subtitle={<>Have an idea or a challenge? Let&rsquo;s talk about it.</>}
        />
        <ContactCards />
      </Section>
    </>
  );
}
