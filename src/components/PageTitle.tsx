import { config } from '../data';

/** Sets the browser tab title. React 19 moves this <title> into <head> automatically. */
export default function PageTitle({ title }: { title?: string }) {
  const name = config.company.name;
  return <title>{title ? `${title} | ${name}` : `${name} | Planspiel Course`}</title>;
}
