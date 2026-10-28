// Read a social account's numbers from its platform. Server only.
// Each platform turns its own numbers into the app's shape (AccountStats in src/agency/types.ts).
import type { Platform } from '@/agency/types';
import { AccountError, type AccountAbout, type AccountRead } from './account-error';
import { aboutFacebook, facebookConfigured, readFacebook } from './facebook';
import { aboutInstagram, instagramConfigured, readInstagram } from './instagram';
import { aboutYoutube, readYoutube, youtubeConfigured, youtubeHandle } from './youtube';
export { AccountError, type AccountAbout, type AccountRead };

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'Facebook'];

/** Platforms the server can read now. The others fall back to the simulated connect. */
export function livePlatforms(): Platform[] {
  const live: Platform[] = [];
  if (instagramConfigured()) live.push('Instagram');
  if (facebookConfigured()) live.push('Facebook');
  if (youtubeConfigured()) live.push('YouTube');
  return live;
}

export type ReadRequest = { platform: Platform; handle?: string; ref?: string };

export function parseReadRequest(body: unknown): ReadRequest {
  const b = (body || {}) as Record<string, unknown>;
  if (!PLATFORMS.includes(b.platform as Platform)) throw new AccountError('bad_request', 'platform must be TikTok, Instagram, YouTube or Facebook.');
  const ref = typeof b.ref === 'string' && /^[\w-]{1,64}$/.test(b.ref) ? b.ref : undefined;
  const raw = typeof b.handle === 'string' ? b.handle : '';
  // No handle or ref check here: each platform checks its own, so a platform the server cannot read
  // answers not_configured (and the app falls back to the simulated connect) even with an empty handle.
  return { platform: b.platform as Platform, handle: raw, ref };
}

/** `userId` is the signed-in student; platforms with a login page (Instagram, Facebook) read with that student's saved token. */
export function readAccount(r: ReadRequest, userId: string | null): Promise<AccountRead> {
  return byPlatform(r, userId, { Instagram: readInstagram, Facebook: readFacebook, YouTube: readYoutube });
}

/** The account's bio and newest post text, for the Profile agent. Same checks as readAccount. */
export function readAbout(r: ReadRequest, userId: string | null): Promise<AccountAbout> {
  return byPlatform(r, userId, { Instagram: aboutInstagram, Facebook: aboutFacebook, YouTube: aboutYoutube });
}

type Readers<T> = {
  Instagram: (userId: string, ref: string) => Promise<T>;
  Facebook: (userId: string, ref: string) => Promise<T>;
  YouTube: (by: { handle?: string; ref?: string }) => Promise<T>;
};

async function byPlatform<T>(r: ReadRequest, userId: string | null, read: Readers<T>): Promise<T> {
  if (r.platform === 'Instagram' || r.platform === 'Facebook') {
    const ig = r.platform === 'Instagram';
    if (!(ig ? instagramConfigured() : facebookConfigured())) throw new AccountError('not_configured', `${r.platform} is not set up on the server.`);
    if (!userId) throw new AccountError('bad_request', `Log in to read a ${r.platform} account.`);
    // These platforms connect through their login page (POST /api/connect/<platform>/start), never by handle.
    if (!r.ref) throw new AccountError('bad_request', `Connect ${r.platform} through its login page.`);
    return ig ? read.Instagram(userId, r.ref) : read.Facebook(userId, r.ref);
  }
  if (r.platform === 'YouTube') {
    if (!youtubeConfigured()) throw new AccountError('not_configured', 'YOUTUBE_API_KEY is not set.');
    const handle = r.handle ? youtubeHandle(r.handle) : null;
    if (!r.ref && !handle) throw new AccountError('bad_request', 'That is not a YouTube handle.');
    return read.YouTube({ handle: handle || undefined, ref: r.ref });
  }
  throw new AccountError('not_configured', `${r.platform} is not connected to the server yet.`);
}
