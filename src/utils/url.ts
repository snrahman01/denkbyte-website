/** "https://www.instagram.com/denkbyte/" -> "instagram.com/denkbyte" (short, readable form of a link) */
export const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
