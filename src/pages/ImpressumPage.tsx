import LegalPage from '../components/LegalPage';
import { config } from '../data';

export default function ImpressumPage() {
  const { name } = config.company;
  const { contact_person: person, disclaimer } = config.legal;
  const { address } = config.contact;

  return (
    <LegalPage title="Impressum / Legal Notice" eyebrow="// legal">
      <h2>Information according to § 5 DDG</h2>
      <p>
        <strong>{name}</strong> (Planspiel Web Engineering project, not a registered company)
        <br />
        {address.street}
        <br />
        {address.postal_code} {address.city}
        <br />
        {address.country}
      </p>

      <h2>Contact person</h2>
      <p>
        {person.name} ({person.role})
        <br />
        Email: <a href={`mailto:${person.email}`}>{person.email}</a>
      </p>

      <h2>Responsible for the content according to § 18 (2) MStV</h2>
      <p>
        {person.name}
        <br />
        {address.street}, {address.postal_code} {address.city}
      </p>

      <h2>Disclaimer</h2>
      <p>
        <strong>{disclaimer}</strong>
      </p>

      <h2>Liability for content</h2>
      <p>
        The contents of this website have been compiled with care. However, we do not assume any liability for
        the topicality, correctness, completeness or quality of the information provided.
      </p>

      <h2>Liability for links</h2>
      <p>
        This website contains links to external websites. We have no influence on their content and are
        responsible for it only to the extent that we have knowledge of illegal content and it would be
        technically possible and reasonable to prevent the use of such websites.
      </p>

      <h2>Copyright</h2>
      <p>
        The layout, graphics and all other elements contained on this website are protected by copyright.
        Reproduction in any form requires the written permission of the rights holder.
      </p>
    </LegalPage>
  );
}
