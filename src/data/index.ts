import configJson from './site.config.json';
import servicesJson from './services.json';
import teamJson from './team.json';
import patchNotesJson from './patch-notes.json';
import type { PatchNote, Service, SiteConfig, TeamMember } from '../types';

// All site content lives in the JSON files next to this module.
// Edit them, push, and Netlify rebuilds the site.
export const config: SiteConfig = configJson;
export const services: Service[] = servicesJson;
export const team: TeamMember[] = teamJson;
/** Patch notes (status updates), newest first: sorted here, so the order in patch-notes.json doesn't matter */
export const patchNotes: PatchNote[] = [...patchNotesJson].sort((a, b) => b.date.localeCompare(a.date));
