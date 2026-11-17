import configJson from './site.config.json';
import servicesJson from './services.json';
import teamJson from './team.json';
import patchNotesJson from './patch-notes.json';
import { sortPatchNotes } from '../lib/patchNotes';
import type { PatchNote, Service, SiteConfig, TeamMember } from '../types';

// All site content lives in the JSON files next to this module.
// Edit them, push, and Netlify rebuilds the site.
export const config: SiteConfig = configJson;
export const services: Service[] = servicesJson;
export const team: TeamMember[] = teamJson;
/**
 * Patch notes that ship with the site, newest first. The live list comes from the patch notes API
 * (managed on /admin); these are shown instantly and used as fallback if the API is unreachable.
 */
export const patchNotes: PatchNote[] = sortPatchNotes(patchNotesJson);
