import { config } from '../data';

export default function Hero() {
  return (
    <header className="hero">
      <div className="container">
        <h1>Welcome to {config.company.name}</h1>
        <p>{config.company.tagline}</p>
        <a href="#contact" className="btn btn-primary">
          Get Started
        </a>
      </div>
    </header>
  );
}
