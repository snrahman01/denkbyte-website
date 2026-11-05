import PageTitle from '../components/PageTitle';
import UpdateList from '../components/sections/UpdateList';
import Backdrop from '../components/ui/Backdrop';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

/** Status updates. Add a new entry to src/data/updates.json; it appears here and on the homepage. */
export default function UpdatesPage() {
  return (
    <>
      <PageTitle title="Updates" />
      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" className="mask-b-to-50%" />
        <SectionHeader
          as="h1"
          eyebrow="// changelog"
          title="Updates"
          subtitle="What we've been working on: milestones and news from the DenkByte team."
        />
        <UpdateList />
      </Section>
    </>
  );
}
