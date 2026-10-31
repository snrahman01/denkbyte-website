import { config } from '../data';

interface FooterProps {
  onOpenImpressum: () => void;
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenImpressum, onOpenPrivacy }: FooterProps) {
  const name = config.company.name;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Company</h4>
            <p>{name}</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#vision">Vision &amp; Mission</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a
                  href="#impressum"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenImpressum();
                  }}
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="#gdpr"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenPrivacy();
                  }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className="disclaimer">{config.legal.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
