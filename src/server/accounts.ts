// Read a social account's numbers from its platform. Server only.
// Each platform turns its own numbers into the app's shape (AccountStats in src/agency/types.ts).
import type { Platform } from '@/agency/types';
import { AccountError, type AccountRead } from './account-error';
import { instagramConfigured, readInstagram } from './instagram';
import { readYoutube, youtubeConfigured, youtubeHandle } from './youtube';
export { AccountError, type AccountRead };

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'Facebook'];

/** Platforms the server can read now. The others fall back to the simulated connect. */
export function livePlatforms(): Platform[] {
  const live: Platform[] = [];
  if (instagramConfigured()) live.push('Instagram');
  if (youtubeConfigured()) live.push('YouTube');
  return live;
}

export type ReadRequest = { platform: Platform; handle?: string; ref?: string };

export function parseReadRequest(body: unknown): ReadRequest {
  const b = (body || {}) as Record<string, unknown>;
  if (!PLATFORMS.includes(b.platform as Platform)) throw new AccountError('bad_request', 'platform must be TikTok, Instagram, YouTube or Facebook.');
  const ref = typeof b.ref === 'string' && /^[\w-]{1,64}$/.test(b.ref) ? b.ref : undefined;
  const raw = typeof b.handle === 'string' ? b.handle : '';
  if (!ref && !raw.trim()) throw new AccountError('bad_request', 'Give a handle or a ref.');
  return { platform: b.platform as Platform, handle: raw, ref };
}

/** `userId` is the signed-in student; platforms with a sign-in (Instagram) read with that student's saved token. */
export async function readAccount(r: ReadRequest, userId: string | null): Promise<AccountRead> {
  if (r.platform === 'Instagram') {
    if (!instagramConfigured()) throw new AccountError('not_configured', 'INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET or TOKEN_ENCRYPTION_KEY is not set.');
    if (!userId) throw new AccountError('bad_request', 'Log in to read an Instagram account.');
    // Instagram is connected through its login page (POST /api/connect/instagram/start), never by handle.
    if (!r.ref) throw new AccountError('bad_request', 'Connect Instagram through its login page.');
    return readInstagram(userId, r.ref);
  }
  if (r.platform === 'YouTube') {
    if (!youtubeConfigured()) throw new AccountError('not_configured', 'YOUTUBE_API_KEY is not set.');
    const handle = r.handle ? youtubeHandle(r.handle) : null;
    if (!r.ref && !handle) throw new AccountError('bad_request', 'That is not a YouTube handle.');
    return readYoutube({ handle: handle || undefined, ref: r.ref });
  }
  throw new AccountError('not_configured', `${r.platform} is not connected to the server yet.`);
}
