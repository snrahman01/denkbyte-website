const values = [
  { name: 'Innovation', text: 'constantly pushing boundaries' },
  { name: 'Integrity', text: 'honest, transparent partnerships' },
  { name: 'Excellence', text: 'delivering superior quality' },
  { name: 'Impact', text: 'creating measurable value' },
];

export default function Vision() {
  return (
    <section id="vision" className="section alternate">
      <div className="container">
        <h2>Vision &amp; Mission</h2>
        <div className="vision-grid">
          <div className="vision-card">
            <div className="vision-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              Empower businesses through intelligent technology and data-driven insights. We
              transform complex challenges into elegant solutions, combining creative thinking with
              technological excellence to drive sustainable growth and measurable impact.
            </p>
          </div>
          <div className="vision-card">
            <div className="vision-icon">🚀</div>
            <h3>Our Vision</h3>
            <p>
              To be the trusted partner in digital transformation globally. We envision a future
              where organizations leverage AI, analytics, and innovative technologies to make
              smarter decisions, optimize operations, and unlock new opportunities for growth and
              innovation.
            </p>
          </div>
          <div className="vision-card">
            <div className="vision-icon">💎</div>
            <h3>Our Core Values</h3>
            <ul className="values-list">
              {values.map((v) => (
                <li key={v.name}>
                  <strong>{v.name}</strong> — {v.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
