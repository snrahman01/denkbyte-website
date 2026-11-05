import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import VisionPage from './pages/VisionPage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import PatchNotesPage from './pages/PatchNotesPage';
import ImpressumPage from './pages/ImpressumPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * All routes of the site. Pages live in src/pages/, the shared navbar + footer in RootLayout.
 * New page? Add it here, link it in src/data/navigation.ts, and add its path to netlify.toml.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'vision', element: <VisionPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'patch-notes', element: <PatchNotesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'impressum', element: <ImpressumPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
  // Anything else: the stand-alone 404 page
  { path: '*', element: <NotFoundPage /> },
]);
