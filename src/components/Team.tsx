import type { ReactNode } from 'react';
import { team } from '../data';
import type { TeamMember } from '../types';
import Reveal from './Reveal';
import {
  BranchIcon,
  ChipIcon,
  CodeIcon,
  DatabaseIcon,
  GitHubIcon,
  GitLabIcon,
  LayoutIcon,
  LinkedInIcon,
  ServerIcon,
} from './icons';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Small badge on each avatar, chosen from the member's role
const badge = { size: 14, strokeWidth: 2 };

function roleIcon(role: string): ReactNode {
  const r = role.toLowerCase();
  if (/\b(ai|ml)\b/.test(r)) return <ChipIcon {...badge} />;
  if (/\b(frontend|ui)\b/.test(r)) return <LayoutIcon {...badge} />;
  if (r.includes('data')) return <DatabaseIcon {...badge} />;
  if (r.includes('devops') || r.includes('deploy') || r.includes('integration'))
    return <BranchIcon {...badge} />;
  if (r.includes('backend')) return <ServerIcon {...badge} />;
  return <CodeIcon {...badge} />;
}

/**
 * A role like "ML Engineer / Visual Lead" is shown as a main role plus extra "hats".
 * Only " / " with spaces splits, so "UI/UX Engineer" stays in one piece.
 */
function splitRole(role: string): { main: string; extras: string[] } {
  const [main, ...extras] = role.split(/\s+\/\s+/).map((part) => part.trim());
  return { main, extras };
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { main: mainRole, extras: extraRoles } = splitRole(member.role);
  const links = [
    { href: member.github, label: 'GitHub', icon: <GitHubIcon /> },
    { href: member.gitlab, label: 'GitLab', icon: <GitLabIcon /> },
    { href: member.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
  ].filter((l) => l.href);

  return (
    <article className="member-card">
      <span className="member-index" aria-hidden="true">
        #{String(index + 1).padStart(2, '0')}
      </span>

      <header className="member-head">
        <div className="member-avatar">
          {member.photo ? (
            <img src={member.photo} alt={`Portrait of ${member.name}`} />
          ) : (
            <span aria-hidden="true">{getInitials(member.name)}</span>
          )}
          <span className="member-badge" aria-hidden="true">
            {roleIcon(member.role)}
          </span>
        </div>
        <div>
          <h3>{member.name}</h3>
          <p className="member-role">{mainRole}</p>
        </div>
      </header>

      {extraRoles.length > 0 && (
        <ul className="member-tags" aria-label={`Also ${extraRoles.join(', ')}`}>
          {extraRoles.map((extra) => (
            <li key={extra}>{extra}</li>
          ))}
        </ul>
      )}

      {member.bio && <p className="member-bio">{member.bio}</p>}

      {links.length > 0 && (
        <ul className="member-links">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${l.label}`}
                title={l.label}
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Team() {
  return (
    <section id="team" className="section team">
      <div className="container">
        <Reveal className="section-head">
          <p className="section-eyebrow">// the team</p>
          <h2>The Minds Behind DenkByte</h2>
          <p className="team-subtitle">Different minds. One vision. Endless possibilities.</p>
        </Reveal>

        <div className="team-grid">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={(i % 3) * 120}>
              <MemberCard member={member} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
