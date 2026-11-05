/**
 * Every page link on the site, in one place. The navbar, footer and hero terminal read from here,
 * so adding a page = add its route in src/router.tsx + one line below.
 */
export interface NavItem {
  to: string;
  label: string;
}

/** Navbar links (the "Contact us" button is added separately) */
export const mainNav: NavItem[] = [
  { to: '/about', label: 'About' },
  { to: '/vision', label: 'Vision & Mission' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/updates', label: 'Updates' },
];

export const contactNav: NavItem = { to: '/contact', label: 'Contact' };

export const legalNav: NavItem[] = [
  { to: '/impressum', label: 'Impressum' },
  { to: '/privacy', label: 'Privacy Policy' },
];
