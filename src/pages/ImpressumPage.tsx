import LegalPage from '../components/LegalPage';
import { config } from '../data';

export default function ImpressumPage() {
  const { impressum } = config.legal;
  const { email, address } = config.contact;

  return (
    <LegalPage title="Impressum / Legal Notice" eyebrow="// legal">
      <h2>Operator</h2>
      <p>{impressum.owner}</p>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${email}`}>{email}</a>
        <br />
        Address: {address.street}
        <br />
        {address.postal_code} {address.city}
        <br />
        {address.country}
      </p>

      <h2>Disclaimer</h2>
      <p>
        <strong>Academic Purpose:</strong> This website represents a fictional company created for educational
        purposes as part of the Planspiel course at Technische Universität Chemnitz (WS 2026/27). All content
        is fictional and for demonstration purposes only.
      </p>

      <h2>Liability for Content</h2>
      <p>
        The contents of this website have been compiled with meticulous care. However, the operator does not
        assume any liability for the topicality, correctness, completeness or quality of the information
        provided.
      </p>

      <h2>Liability for Links</h2>
      <p>
        The operator is responsible for the content of external websites only to the extent that they have
        knowledge of illegal content and it would be technically possible and reasonable to prevent the use of
        such websites.
      </p>

      <h2>Copyright</h2>
      <p>
        The layout, graphics and all other elements contained on this website are protected by copyright.
        Reproduction in any form requires the written permission of the rights holder.
      </p>
    </LegalPage>
  );
}
