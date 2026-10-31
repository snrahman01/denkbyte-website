import { team } from '../data';
import type { TeamMember } from '../types';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="team-member">
      <div className="team-member-avatar">{member.avatar || getInitials(member.name)}</div>
      {member.superhero && <div className="hero-badge">⚡ {member.superhero}</div>}
      <h3>{member.name}</h3>
      <div className="role">{member.role}</div>
      {member.superpower && <p className="superpower">{member.superpower}</p>}
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="section alternate">
      <div className="container">
        <h2>The Minds Behind DenkByte</h2>
        <p className="section-subtitle">Different minds. One vision. Endless possibilities.</p>
      </div>
      <div className="team-marquee">
        <div className="team-track">
          {team.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
          {/* Duplicate set so the horizontal scroll loops seamlessly */}
          {team.map((member) => (
            <div key={`dup-${member.id}`} aria-hidden="true" style={{ display: 'contents' }}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
