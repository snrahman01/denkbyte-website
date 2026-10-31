import configJson from './site.config.json';
import servicesJson from './services.json';
import teamJson from './team.json';
import type { Service, SiteConfig, TeamMember } from '../types';

// All site content lives in the JSON files next to this module.
// Edit them, push, and Netlify rebuilds the site.
export const config: SiteConfig = configJson;
export const services: Service[] = servicesJson;
export const team: TeamMember[] = teamJson;
