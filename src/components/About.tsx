import { config, services, team } from '../data';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2>About Us</h2>
        <div className="section-content">
          <div>
            <p>
              <strong>{config.company.name}</strong> is an innovative technology company focused
              on developing smart, creative, and future-ready digital solutions. Our name combines{' '}
              <strong>&ldquo;Denk&rdquo;</strong> (German for &ldquo;think&rdquo;) and{' '}
              <strong>&ldquo;Byte&rdquo;</strong> (representing technology), reflecting our passion
              for turning ideas into impactful digital experiences.
            </p>
            <p>
              Driven by a collaborative team of technology enthusiasts, we specialize in AI-powered
              solutions, web and mobile application development, and intelligent software systems.
              At {config.company.name}, we combine creativity, modern technology, and teamwork to
              solve real-world challenges and bring innovative ideas to life.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <h3>Founded</h3>
              <p>{config.company.founded}</p>
            </div>
            <div className="about-card">
              <h3>Team Members</h3>
              <p>{team.length}</p>
            </div>
            <div className="about-card">
              <h3>Core Services</h3>
              <p>{services.length}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
