import Reveal from '../Reveal';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { ChipIcon, CodeIcon, MonitorIcon } from '../icons';

const iconProps = { size: 26, strokeWidth: 1.8 };

const focusAreas = [
  {
    title: 'AI-powered solutions',
    text: 'Smart systems that automate work, learn from data and surface patterns people miss.',
    icon: <ChipIcon {...iconProps} />,
  },
  {
    title: 'Web & mobile apps',
    text: 'Fast, accessible and polished interfaces that feel right on every screen.',
    icon: <MonitorIcon {...iconProps} />,
  },
  {
    title: 'Intelligent software',
    text: 'Scalable, maintainable systems engineered to solve real-world challenges.',
    icon: <CodeIcon {...iconProps} />,
  },
];

/** "What we specialize in": three cards (About page + homepage). */
export default function FocusAreas() {
  return (
    <>
      <h2 className="mb-6 font-mono text-base font-bold text-heading">
        <span className="text-secondary">&gt; </span>What we specialize in
      </h2>
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {focusAreas.map((area, i) => (
          <Reveal key={area.title} delay={i * 120} className="flex">
            <Card index={`0${i + 1}`} className="px-6 pt-10 pb-7">
              <IconTile className="mb-6">{area.icon}</IconTile>
              <h3 className="mb-2 text-lg font-bold text-heading">{area.title}</h3>
              <p className="text-sm leading-[1.7] text-muted">{area.text}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </>
  );
}
