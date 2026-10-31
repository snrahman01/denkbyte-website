import { useState } from 'react';

const links = [
  { href: '#about', label: 'About Us' },
  { href: '#vision', label: 'Vision & Mission' },
  { href: '#services', label: 'Services' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="logo">
            <img src="/logo.png" alt="DenkByte logo" className="logo-img" />
          </div>
          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
          <ul className={`nav-menu${open ? ' active' : ''}`} id="nav-menu">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
