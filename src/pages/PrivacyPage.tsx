import LegalPage from '../components/LegalPage';
import { config } from '../data';

export default function PrivacyPage() {
  const { email } = config.contact;

  return (
    <LegalPage title="Privacy Policy & GDPR" eyebrow="// privacy">
      <h2>Data Protection &amp; GDPR Compliance</h2>
      <p>
        This website is compliant with the General Data Protection Regulation (GDPR) and German data
        protection laws.
      </p>

      <h2>Personal Data Collection</h2>
      <p>
        This website does not collect personal data from visitors. There are no forms, accounts or tracking
        tools. If you choose to contact us by email, we process the data you send us (such as your name, email
        address and message) solely to respond to your inquiry.
      </p>

      <h2>Hosting</h2>
      <p>
        This website is hosted by Netlify, Inc. When you visit the site, the hosting provider may process
        technical data such as your IP address and request details in server logs in order to deliver the site
        and keep it secure.
      </p>

      <h2>Data Storage</h2>
      <p>
        Emails you send us are stored securely and deleted after the inquiry has been resolved, typically
        within 30 days.
      </p>

      <h2>Your Rights</h2>
      <p>According to GDPR, you have the following rights:</p>
      <ul>
        <li>Right of access to your personal data</li>
        <li>Right to rectification of inaccurate data</li>
        <li>Right to deletion of your data</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
      </ul>

      <h2>Contact for Data Protection</h2>
      <p>For questions regarding data protection, please contact us at {email}</p>

      <h2>Cookies</h2>
      <p>
        This website does not use cookies or tracking technologies. No personal data is collected for
        analytics purposes.
      </p>

      <h2>External Links</h2>
      <p>
        This website may contain links to external websites. We are not responsible for the privacy practices
        of external websites. Please review their privacy policies before providing personal information.
      </p>

      <h2>Educational Disclaimer</h2>
      <p>
        This website is a fictional company created for the Planspiel course at TU Chemnitz. While GDPR and
        data protection principles are demonstrated here, this is an educational project and not a real
        commercial operation.
      </p>
    </LegalPage>
  );
}
