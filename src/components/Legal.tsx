import { config } from '../data';

export function Impressum() {
  const { impressum } = config.legal;
  const { email, address } = config.contact;

  return (
    <>
      <h3>Operator</h3>
      <p>{impressum.owner}</p>

      <h3>Contact</h3>
      <p>
        Email: <a href={`mailto:${email}`}>{email}</a>
        <br />
        Address: {address.street}
        <br />
        {address.postal_code} {address.city}
        <br />
        {address.country}
      </p>

      <h3>Disclaimer</h3>
      <p>
        <strong>Academic Purpose:</strong> This website represents a fictional company created for
        educational purposes as part of the Planspiel course at Technische Universität Chemnitz (WS
        2026/27). All content is fictional and for demonstration purposes only.
      </p>

      <h3>Liability for Content</h3>
      <p>
        The contents of this website have been compiled with meticulous care. However, the operator
        does not assume any liability for the topicality, correctness, completeness or quality of
        the information provided.
      </p>

      <h3>Liability for Links</h3>
      <p>
        The operator is responsible for the content of external websites only to the extent that
        they have knowledge of illegal content and it would be technically possible and reasonable
        to prevent the use of such websites.
      </p>

      <h3>Copyright</h3>
      <p>
        The layout, graphics and all other elements contained on this website are protected by
        copyright. Reproduction in any form requires the written permission of the rights holder.
      </p>
    </>
  );
}

export function PrivacyPolicy() {
  const { email } = config.contact;

  return (
    <>
      <h3>Data Protection &amp; GDPR Compliance</h3>
      <p>
        This website is compliant with the General Data Protection Regulation (GDPR) and German data
        protection laws.
      </p>

      <h3>Personal Data Collection</h3>
      <p>
        This website does not collect personal data from visitors. There are no forms, accounts or
        tracking tools. If you choose to contact us by email, we process the data you send us (such
        as your name, email address and message) solely to respond to your inquiry.
      </p>

      <h3>Hosting</h3>
      <p>
        This website is hosted by Netlify, Inc. When you visit the site, the hosting provider may
        process technical data such as your IP address and request details in server logs in order
        to deliver the site and keep it secure.
      </p>

      <h3>Data Storage</h3>
      <p>
        Emails you send us are stored securely and deleted after the inquiry has been resolved,
        typically within 30 days.
      </p>

      <h3>Your Rights</h3>
      <p>According to GDPR, you have the following rights:</p>
      <ul style={{ marginLeft: 20, marginBottom: 16 }}>
        <li>Right of access to your personal data</li>
        <li>Right to rectification of inaccurate data</li>
        <li>Right to deletion of your data</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
      </ul>

      <h3>Contact for Data Protection</h3>
      <p>For questions regarding data protection, please contact us at {email}</p>

      <h3>Cookies</h3>
      <p>
        This website does not use cookies or tracking technologies. No personal data is collected
        for analytics purposes.
      </p>

      <h3>External Links</h3>
      <p>
        This website may contain links to external websites. We are not responsible for the privacy
        practices of external websites. Please review their privacy policies before providing
        personal information.
      </p>

      <h3>Educational Disclaimer</h3>
      <p>
        This website is a fictional company created for the Planspiel course at TU Chemnitz. While
        GDPR and data protection principles are demonstrated here, this is an educational project
        and not a real commercial operation.
      </p>
    </>
  );
}
