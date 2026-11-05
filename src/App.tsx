import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Vision from './components/Vision';
import Services from './components/Services';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';
import { Impressum, PrivacyPolicy } from './components/Legal';
import NotFound from './components/NotFound';

type LegalModal = 'impressum' | 'privacy' | null;

// One-page site: anything other than "/" (or "/index.html") is a 404.
const isHome = /^\/(index\.html)?$/.test(window.location.pathname);

export default function App() {
  if (!isHome) return <NotFound />;
  return <Home />;
}

function Home() {
  const [openModal, setOpenModal] = useState<LegalModal>(null);
  const close = () => setOpenModal(null);

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Vision />
        <Services />
        <Team />
        <Contact />
      </main>
      <Footer
        onOpenImpressum={() => setOpenModal('impressum')}
        onOpenPrivacy={() => setOpenModal('privacy')}
      />

      <Modal open={openModal === 'impressum'} title="Impressum / Legal Notice" onClose={close}>
        <Impressum />
      </Modal>
      <Modal open={openModal === 'privacy'} title="Privacy Policy & GDPR Compliance" onClose={close}>
        <PrivacyPolicy />
      </Modal>
    </>
  );
}
