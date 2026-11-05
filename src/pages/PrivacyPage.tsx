import LegalPage from '../components/LegalPage';
import { config } from '../data';

export default function PrivacyPage() {
  const { name } = config.company;
  const { contact_person: person, disclaimer } = config.legal;
  const { address } = config.contact;

  return (
    <LegalPage title="Privacy Policy" eyebrow="// privacy">
      <p>
        This privacy policy explains which personal data is processed when you visit this website, why, and
        what rights you have under the EU General Data Protection Regulation (GDPR).{' '}
        <strong>{disclaimer}</strong>
      </p>

      <h2>1. Controller</h2>
      <p>
        {person.name} ({person.role}, {name} team)
        <br />
        {address.street}, {address.postal_code} {address.city}, {address.country}
        <br />
        Email: <a href={`mailto:${person.email}`}>{person.email}</a>
      </p>

      <h2>2. Overview</h2>
      <ul>
        <li>No user accounts, contact forms, newsletters or comments.</li>
        <li>No analytics, tracking, advertising or social media plugins.</li>
        <li>No cookies.</li>
        <li>No content, fonts or scripts are loaded from other servers while you browse the site.</li>
      </ul>

      <h2>3. Hosting (Netlify)</h2>
      <p>
        This website is hosted by Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA. When you open
        the site, your browser sends technical data to Netlify&rsquo;s servers, which Netlify processes in
        server logs: your IP address, date and time of the request, the page or file requested, the referring
        page, and your browser and operating system. This is necessary to deliver the website and keep it
        secure and stable.
      </p>
      <p>
        <strong>Legal basis:</strong> Art. 6(1)(f) GDPR (our legitimate interest in a reliable and secure
        website). <strong>Transfer to the USA:</strong> Netlify, Inc. is certified under the EU-U.S. Data
        Privacy Framework, so data is transferred on the basis of the European Commission&rsquo;s adequacy
        decision (Art. 45 GDPR). <strong>Storage:</strong> Netlify keeps log data only as long as needed for
        these purposes or as required by law. Details:{' '}
        <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">
          Netlify Privacy Policy
        </a>
        .
      </p>

      <h2>4. Contact by email</h2>
      <p>
        If you email us, we process your email address, your name (if given) and the content of your message
        to answer your inquiry. <strong>Legal basis:</strong> Art. 6(1)(b) GDPR if your inquiry concerns a
        contract, otherwise Art. 6(1)(f) GDPR (our interest in answering messages). Our mailbox is provided by
        Google (Gmail; for users in the EU: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
        Ireland), so Google processes the emails; data may also be transferred to Google LLC in the USA, which
        is certified under the EU-U.S. Data Privacy Framework. We delete your emails once your inquiry has
        been resolved, typically within 30 days.
      </p>

      <h2>5. Data stored in your browser</h2>
      <p>
        If you switch between light and dark mode, your choice is saved in your browser&rsquo;s local storage
        (key <code>denkbyte-theme</code>, value <code>light</code> or <code>dark</code>) so the site remembers
        it next time. This value never leaves your device and is not sent to us or anyone else. You can delete
        it at any time by clearing your browser&rsquo;s site data. <strong>Legal basis:</strong> § 25(2) No. 2
        TDDDG (storage that is strictly necessary for a function you explicitly use).
      </p>

      <h2>6. JavaScript libraries and fonts</h2>
      <p>
        The website is built with the open-source libraries React, React Router, GSAP and Tailwind CSS. They
        are bundled into the website&rsquo;s own files and served from the same host (Netlify), not from
        third-party servers or CDNs. The site uses the fonts already installed on your device; no web fonts
        (such as Google Fonts) are loaded. No personal data is passed to the authors of these libraries.
      </p>

      <h2>7. Links to other websites</h2>
      <p>
        The site links to LinkedIn, Instagram, GitHub, the GitLab of TU Chemnitz and Google Maps. These are
        plain links: no data is sent to these services until you click one. After that, the privacy policy of
        the respective provider applies. The QR codes on the Contact page are images stored on our own server.
      </p>

      <h2>8. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>access the personal data we hold about you (Art. 15 GDPR)</li>
        <li>have inaccurate data corrected (Art. 16 GDPR)</li>
        <li>have your data deleted (Art. 17 GDPR)</li>
        <li>restrict processing (Art. 18 GDPR)</li>
        <li>data portability (Art. 20 GDPR)</li>
        <li>object to processing based on Art. 6(1)(f) GDPR (Art. 21 GDPR)</li>
      </ul>
      <p>
        To use these rights, email <a href={`mailto:${person.email}`}>{person.email}</a>. You also have the
        right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for example
        the authority responsible for us: Sächsische Datenschutz- und Transparenzbeauftragte, Postfach 11 01
        32, 01330 Dresden,{' '}
        <a href="https://www.datenschutz.sachsen.de" target="_blank" rel="noopener noreferrer">
          www.datenschutz.sachsen.de
        </a>
        .
      </p>

      <h2>9. Changes</h2>
      <p>We update this policy when the website changes. Last updated: November 2026.</p>
    </LegalPage>
  );
}
