// YouTube Data API v3 reader. Server only: it reads YOUTUBE_API_KEY from the environment.
// Public numbers only, found by handle, so there is no sign-in and no app review.
// YouTube does not share watch time without the owner's sign-in, so `time` is always null.
import { AccountError, type AccountRead } from './account-error';

const API = 'https://www.googleapis.com/youtube/v3';
const TIMEOUT_MS = 15000;
const DAY = 86400000;
/** A channel with fewer uploads than this gets starter ideas instead of trends. */
const FEW_VIDEOS = 10;

export function youtubeConfigured() {
  return !!process.env.YOUTUBE_API_KEY;
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new AccountError('not_configured', 'YOUTUBE_API_KEY is not set.');
  const url = `${API}/${path}?${new URLSearchParams({ ...params, key })}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new AccountError('timeout', `YouTube did not answer in ${TIMEOUT_MS} ms.`);
    throw new AccountError('upstream', 'Could not reach YouTube.');
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Only the reason code: the URL holds the key, so never log or return it.
    const reason = data?.error?.errors?.[0]?.reason || data?.error?.status || 'unknown';
    if (res.status === 404 && path === 'playlistItems') return { items: [] } as T;
    throw new AccountError('upstream', `YouTube returned ${res.status} (${reason}).`, res.status);
  }
  return data as T;
}

/** "@name", "name" or a channel link → the handle without "@". Null when it is not a handle. */
export function youtubeHandle(input: string): string | null {
  let s = input.trim();
  const link = s.match(/youtube\.com\/(@[^/?#\s]+)/i);
  if (link) s = link[1];
  s = s.replace(/^@/, '');
  return /^[\w.-]{3,100}$/.test(s) ? s : null;
}

type Channel = {
  id: string;
  snippet: { title: string; customUrl?: string };
  statistics: { videoCount?: string };
  contentDetails: { relatedPlaylists: { uploads: string } };
};

/** Read a channel by its id (`ref`, after the first read) or by its handle. */
export async function readYoutube({ handle, ref }: { handle?: string; ref?: string }): Promise<AccountRead> {
  const by: Record<string, string> = ref ? { id: ref } : { forHandle: '@' + (handle || '') };
  const ch = await get<{ items?: Channel[] }>('channels', { part: 'snippet,statistics,contentDetails', ...by });
  const c = ch.items?.[0];
  if (!c) throw new AccountError('not_found', 'No YouTube channel has that handle.');

  // Uploads are newest first. 50 covers two weeks for all but the busiest channels.
  const now = Date.now();
  const pl = await get<{ items?: { contentDetails: { videoId: string; videoPublishedAt?: string } }[] }>('playlistItems', {
    part: 'contentDetails', playlistId: c.contentDetails.relatedPlaylists.uploads, maxResults: '50',
  });
  const recent = (pl.items || [])
    .map((i) => ({ id: i.contentDetails.videoId, at: Date.parse(i.contentDetails.videoPublishedAt || '') }))
    .filter((v) => v.at > now - 14 * DAY);

  const stats = new Map<string, { viewCount?: string; likeCount?: string; commentCount?: string }>();
  if (recent.length) {
    const vids = await get<{ items?: { id: string; statistics: { viewCount?: string; likeCount?: string; commentCount?: string } }[] }>('videos', {
      part: 'statistics', id: recent.map((v) => v.id).join(','),
    });
    for (const v of vids.items || []) stats.set(v.id, v.statistics);
  }

  // [this week, last week] as rolling 7-day windows. YouTube's public numbers are lifetime totals
  // per video, so "views" here is the views of the videos posted in that week.
  const week = (from: number, to: number) => {
    const vs = recent.filter((v) => v.at > from && v.at <= to).map((v) => stats.get(v.id) || {});
    const views = vs.reduce((n, s) => n + Number(s.viewCount || 0), 0);
    const acts = vs.reduce((n, s) => n + Number(s.likeCount || 0) + Number(s.commentCount || 0), 0);
    return { posts: vs.length, views, eng: views ? Math.round((acts / views) * 1000) / 10 : 0 };
  };
  const a = week(now - 7 * DAY, now);
  const b = week(now - 14 * DAY, now - 7 * DAY);

  return {
    handle: c.snippet.customUrl ? (c.snippet.customUrl.startsWith('@') ? c.snippet.customUrl : '@' + c.snippet.customUrl) : '@' + (handle || c.snippet.title),
    ref: c.id,
    stats: { posts: [a.posts, b.posts], views: [a.views, b.views], eng: [a.eng, b.eng], time: null },
    few: Number(c.statistics.videoCount || 0) < FEW_VIDEOS,
  };
}
