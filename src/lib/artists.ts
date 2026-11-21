import rawProfiles from '../data/artist-profiles.json';
import type { CalendarEvent } from './types';
import { publicData } from './data';

// Perfis revisados para a página individual de artista (/artistas/<slug>/).
// Nome e release vêm de public-source.json; aqui ficam só slug, rótulos e a foto aprovada.
export interface ArtistProfile {
  artistId: number;
  slug: string;
  kind: string;
  genres: string;
  photo?: { src: string; small: string; width: number; height: number; alt: string; position: string };
}

export const artistProfiles = rawProfiles as ArtistProfile[];

for (const profile of artistProfiles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug)) throw new Error(`Slug de artista inválido: ${profile.slug}`);
  if (!publicData.artists.some(a => a.artist_id === profile.artistId)) throw new Error(`Artista ${profile.artistId} não existe em public-source.json.`);
}
if (new Set(artistProfiles.map(p => p.slug)).size !== artistProfiles.length) throw new Error('Slug de artista duplicado.');

export function artistPath(artistId: number) {
  const profile = artistProfiles.find(p => p.artistId === artistId);
  return profile ? `/artistas/${profile.slug}/` : null;
}

/** Apresentações do artista na unidade Savassi (1) a partir do dia informado (AAAAMMDD), em ordem. */
export function upcomingEvents(artistId: number, fromDay: string, unit = 1): CalendarEvent[] {
  return publicData.events
    .filter(e => e.calendar_artist === artistId && e.calendar_unity === unit && e.calendar_date >= fromDay)
    .sort((a, b) => (a.calendar_date + a.calendar_time).localeCompare(b.calendar_date + b.calendar_time));
}

/** "2000" → "20h"; "1830" → "18h30". */
export function shortTime(value: string) {
  if (!/^\d{4}$/.test(value)) return value;
  const minutes = value.slice(2, 4);
  return `${Number(value.slice(0, 2))}h${minutes === '00' ? '' : minutes}`;
}
