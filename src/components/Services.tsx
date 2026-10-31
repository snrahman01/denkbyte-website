import { services } from '../data';

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <h2>Services &amp; Expertise</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <div className="icon">{service.icon || '⭐'}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
