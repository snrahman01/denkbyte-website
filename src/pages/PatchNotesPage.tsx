import PageTitle from '../components/PageTitle';
import PatchNoteList from '../components/sections/PatchNoteList';
import Backdrop from '../components/ui/Backdrop';
import Section from '../components/ui/Section';
import SectionHeader from '../components/ui/SectionHeader';

/** Status updates as patch notes. Add an entry to src/data/patch-notes.json; it appears here and on the homepage. */
export default function PatchNotesPage() {
  return (
    <>
      <PageTitle title="Patch Notes" />
      <Section className="bg-page">
        <Backdrop pattern="dots" fade="top" className="mask-b-to-50%" />
        <SectionHeader
          as="h1"
          eyebrow="// changelog"
          title="Patch Notes"
          subtitle="Every step DenkByte has shipped so far, newest first."
        />
        <PatchNoteList />
      </Section>
    </>
  );
}
