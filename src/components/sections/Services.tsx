import type { ReactNode } from 'react';
import { services } from '../../data';
import Reveal from '../Reveal';
import Card from '../ui/Card';
import Chip from '../ui/Chip';
import IconTile from '../ui/IconTile';
import {
  BoltIcon,
  ChartIcon,
  ChipIcon,
  CloudIcon,
  CodeIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
} from '../icons';

const iconProps = { size: 28, strokeWidth: 1.7 };

// Icon names used in services.json -> icons
const icons: Record<string, ReactNode> = {
  ai: <ChipIcon {...iconProps} />,
  code: <CodeIcon {...iconProps} />,
  chart: <ChartIcon {...iconProps} />,
  cloud: <CloudIcon {...iconProps} />,
  speed: <BoltIcon {...iconProps} />,
  shield: <ShieldCheckIcon {...iconProps} />,
  default: <PlusCircleIcon {...iconProps} />,
};

/** Grid of service cards from services.json. `limit` shows only the first few (homepage preview). */
export default function ServiceGrid({ limit }: { limit?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {services.slice(0, limit).map((service, i) => (
        <Reveal key={service.title} delay={(i % 3) * 120} className="flex">
          <Card index={String(i + 1).padStart(2, '0')} className="px-6 pt-10 pb-7">
            <IconTile className="mb-6 transition duration-300 group-hover:-rotate-6 group-hover:bg-brand group-hover:text-dark dark:group-hover:shadow-[0_0_22px_rgb(245_166_35/0.4)]">
              {icons[service.icon ?? ''] ?? icons.default}
            </IconTile>
            <h3 className="mb-2 text-xl leading-snug font-bold tracking-tight text-heading">
              {service.title}
            </h3>
            <p className="mb-6 text-sm leading-[1.7] text-muted">{service.description}</p>

            {service.tags && service.tags.length > 0 && (
              <ul className="mt-auto flex flex-wrap gap-1.5" aria-label={`${service.title} topics`}>
                {service.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </ul>
            )}
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
