import configJson from './site.config.json';
import servicesJson from './services.json';
import teamJson from './team.json';
import updatesJson from './updates.json';
import type { Service, SiteConfig, TeamMember, Update } from '../types';

// All site content lives in the JSON files next to this module.
// Edit them, push, and Netlify rebuilds the site.
export const config: SiteConfig = configJson;
export const services: Service[] = servicesJson;
export const team: TeamMember[] = teamJson;
/** Status updates, newest first (sorted here, so the order in updates.json doesn't matter) */
export const updates: Update[] = [...updatesJson].sort((a, b) => b.date.localeCompare(a.date));
