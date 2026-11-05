import type { ReactNode } from 'react';
import { team } from '../../data';
import type { TeamMember } from '../../types';
import Reveal from '../Reveal';
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
} from '../icons';

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
    <article className="relative flex flex-1 flex-col gap-4 rounded-xl border border-white/12 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-accent/55 hover:bg-white/9 hover:shadow-[0_18px_40px_rgb(0_0_0/0.35)] dark:hover:shadow-[0_18px_40px_rgb(0_0_0/0.5),0_0_0_1px_rgb(245_166_35/0.3),0_14px_44px_rgb(245_166_35/0.12)]">
      <span aria-hidden="true" className="absolute top-4 right-6 font-mono text-xs font-bold text-white/30">
        #{String(index + 1).padStart(2, '0')}
      </span>

      <header className="flex items-center gap-4 pr-9">
        <div className="relative flex size-16 flex-none items-center justify-center rounded-[18px] bg-brand font-mono text-[1.35rem] font-extrabold tracking-[-0.04em] text-dark">
          {member.photo ? (
            <img
              src={member.photo}
              alt={`Portrait of ${member.name}`}
              className="size-full rounded-[inherit] object-cover"
            />
          ) : (
            <span aria-hidden="true">{getInitials(member.name)}</span>
          )}
          <span
            aria-hidden="true"
            className="absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-[9px] border-2 border-dark bg-primary text-accent"
          >
            {roleIcon(member.role)}
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg leading-tight font-bold tracking-tight">{member.name}</h3>
          <p className="mt-0.5 font-mono text-[0.78rem] leading-snug text-accent">{mainRole}</p>
        </div>
      </header>

      {extraRoles.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Also ${extraRoles.join(', ')}`}>
          {extraRoles.map((extra) => (
            <li
              key={extra}
              className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-0.5 font-mono text-[0.72rem] leading-snug text-white/90"
            >
              {extra}
            </li>
          ))}
        </ul>
      )}

      {member.bio && <p className="text-sm leading-[1.7] text-white/75">{member.bio}</p>}

      {links.length > 0 && (
        <ul className="mt-auto flex gap-2 border-t border-white/8 pt-4">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${l.label}`}
                title={l.label}
                className="flex size-10 items-center justify-center rounded-[10px] border border-white/16 text-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-secondary hover:bg-secondary hover:text-dark"
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

/** Grid of member cards from team.json (sits on a dark band). */
export default function TeamGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {team.map((member, i) => (
        <Reveal key={member.id} delay={(i % 3) * 120} className="flex">
          <MemberCard member={member} index={i} />
        </Reveal>
      ))}
    </div>
  );
}
