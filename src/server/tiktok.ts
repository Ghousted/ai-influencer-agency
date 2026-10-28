// TikTok Login Kit and Display API. Server only: it reads TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET.
// In Sandbox only the app's target users (up to 10) can connect. Students need TikTok's app review.
// Docs: https://developers.tiktok.com/doc/login-kit-web and https://developers.tiktok.com/doc/display-api-get-started
import { ABOUT_POSTS, AccountError, topPosts, type AccountAbout, type AccountRead } from './account-error';
import { cryptoConfigured } from './crypto';
import { platformFetch, redirectUri } from './login-common';
import { supabaseConfigured } from './supabase';
import { loadToken, saveToken } from './tokens';

const API = 'https://open.tiktokapis.com/v2';
const DAY = 86400000;
/** Read the profile, numbers and videos only; the app never posts. */
const SCOPES = ['user.info.basic', 'user.info.profile', 'user.info.stats', 'video.list'];
/** An account with fewer videos than this gets starter ideas instead of trends. */
const FEW_VIDEOS = 10;
const VIDEO_FIELDS = 'id,title,video_description,create_time,view_count,like_count,comment_count,share_count,share_url';

export function tiktokConfigured() {
  return !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET) && cryptoConfigured() && supabaseConfigured();
}

const tiktokRedirectUri = () => redirectUri('tiktok');

/** The TikTok login page. TikTok sends the student back to the callback with `code` and `state`. */
export function tiktokAuthorizeUrl(state: string) {
  const q = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    redirect_uri: tiktokRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
    // Always show the login screen, so a student with several AI talents picks the right account each time.
    disable_auto_auth: '1',
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${q}`;
}

/** The Display API answers { data, error: { code } }. A code other than "ok" is an error, also with HTTP 200. */
async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await platformFetch<{ data?: T; error?: { code?: string } }>('TikTok', url, init);
  const code = r.error?.code;
  if (code && code !== 'ok') {
    if (code === 'access_token_invalid' || code === 'scope_not_authorized') throw new AccountError('reconnect', 'TikTok stopped the access to this account.');
    throw new AccountError('upstream', `TikTok returned an error (${code}).`);
  }
  return (r.data ?? {}) as T;
}

type TokenAnswer = { access_token?: string; expires_in?: number; refresh_token?: string; open_id?: string; error?: string };

/** The token endpoint answers 200 with { error } when the code or the refresh token is wrong. */
async function token(body: Record<string, string>): Promise<Required<Pick<TokenAnswer, 'access_token' | 'expires_in' | 'refresh_token' | 'open_id'>>> {
  const r = await platformFetch<TokenAnswer>('TikTok', `${API}/oauth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_key: process.env.TIKTOK_CLIENT_KEY!, client_secret: process.env.TIKTOK_CLIENT_SECRET!, ...body }),
  });
  if (r.error === 'invalid_grant') throw new AccountError('reconnect', 'TikTok stopped the access to this account.');
  if (!r.access_token || !r.refresh_token || !r.open_id) throw new AccountError('upstream', `TikTok returned no token (${r.error || 'unknown'}).`);
  return { access_token: r.access_token, expires_in: r.expires_in || DAY / 1000, refresh_token: r.refresh_token, open_id: r.open_id };
}

const save = (userId: string, t: Awaited<ReturnType<typeof token>>) =>
  saveToken(userId, 'TikTok', t.open_id, { token: t.access_token, refreshToken: t.refresh_token, expiresAt: Date.now() + t.expires_in * 1000, owner: t.open_id });

/**
 * Turn the code from the callback into tokens, and save them for the student. The access token lasts
 * 24 hours and the refresh token a year. Returns the account's open_id (the `ref`).
 */
export async function connectTiktok(userId: string, code: string): Promise<string[]> {
  const t = await token({ code, grant_type: 'authorization_code', redirect_uri: tiktokRedirectUri() });
  await save(userId, t);
  return [t.open_id];
}

/** The access token lasts 24 hours. Refresh it when it has less than 10 minutes left. */
async function freshToken(userId: string, ref: string): Promise<string> {
  const t = await loadToken(userId, 'TikTok', ref);
  if (!t) throw new AccountError('reconnect', 'This TikTok account has no saved access. Connect it again.');
  if (t.expiresAt && t.expiresAt - Date.now() > 10 * 60000) return t.token;
  if (!t.refreshToken) throw new AccountError('reconnect', 'The TikTok access expired. Connect it again.');
  const r = await token({ grant_type: 'refresh_token', refresh_token: t.refreshToken });
  await save(userId, r);
  return r.access_token;
}

type User = { open_id: string; username?: string; display_name?: string; bio_description?: string; video_count?: number };
type Video = {
  id: string; title?: string; video_description?: string; create_time: number; share_url?: string;
  view_count?: number; like_count?: number; comment_count?: number; share_count?: number;
};

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

function user(token: string, fields: string) {
  return call<{ user: User }>(`${API}/user/info/?${new URLSearchParams({ fields })}`, { headers: auth(token) }).then((d) => d.user);
}

/** The newest videos, newest first: pages of 20 until a video is older than `since`, or `max` videos. */
async function videos(token: string, since: number, max: number): Promise<Video[]> {
  const out: Video[] = [];
  let cursor: number | undefined;
  for (let page = 0; page < 5; page++) {
    const d = await call<{ videos?: Video[]; cursor?: number; has_more?: boolean }>(`${API}/video/list/?${new URLSearchParams({ fields: VIDEO_FIELDS })}`, {
      method: 'POST',
      headers: { ...auth(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ max_count: 20, ...(cursor ? { cursor } : {}) }),
    });
    out.push(...(d.videos || []));
    const oldest = out[out.length - 1];
    if (!d.has_more || !d.cursor || out.length >= max || (oldest && oldest.create_time * 1000 < since)) break;
    cursor = d.cursor;
  }
  return out.slice(0, max);
}

const handleOf = (u: User) => (u.username ? '@' + u.username : u.display_name || 'TikTok account');

/** Posts, views and engagement for this week and last week (rolling 7-day windows). TikTok shares no watch time. */
export async function readTiktok(userId: string, ref: string): Promise<AccountRead> {
  const token = await freshToken(userId, ref);
  const now = Date.now();
  const [u, vs] = await Promise.all([user(token, 'open_id,username,display_name,video_count'), videos(token, now - 14 * DAY, 100)]);
  const recent = vs.map((v) => ({ ...v, at: v.create_time * 1000 })).filter((v) => v.at > now - 14 * DAY);

  const week = (from: number, to: number) => {
    const ws = recent.filter((v) => v.at > from && v.at <= to);
    const views = ws.reduce((n, v) => n + (v.view_count || 0), 0);
    const acts = ws.reduce((n, v) => n + (v.like_count || 0) + (v.comment_count || 0) + (v.share_count || 0), 0);
    return { posts: ws.length, views, eng: views ? Math.round((acts / views) * 1000) / 10 : 0 };
  };
  const a = week(now - 7 * DAY, now);
  const b = week(now - 14 * DAY, now - 7 * DAY);

  return {
    handle: handleOf(u),
    ref,
    stats: { posts: [a.posts, b.posts], views: [a.views, b.views], eng: [a.eng, b.eng], time: null },
    few: (u.video_count ?? 0) < FEW_VIDEOS,
    top: topPosts(recent.filter((v) => v.at > now - 7 * DAY).map((v) => ({
      text: v.title || v.video_description,
      format: 'Short video',
      views: v.view_count || 0,
      acts: (v.like_count || 0) + (v.comment_count || 0) + (v.share_count || 0),
      url: v.share_url,
    }))),
    // TikTok shares no saves.
    recent: recent.map((v) => ({
      at: v.at, views: v.view_count || 0, likes: v.like_count || 0, comments: v.comment_count || 0, shares: v.share_count || 0, saves: 0,
    })),
  };
}

/** The bio and the newest video captions, for the Profile agent. */
export async function aboutTiktok(userId: string, ref: string): Promise<AccountAbout> {
  const token = await freshToken(userId, ref);
  const [u, vs] = await Promise.all([user(token, 'open_id,username,display_name,bio_description'), videos(token, 0, ABOUT_POSTS)]);
  return {
    platform: 'TikTok',
    handle: handleOf(u),
    bio: [u.display_name, u.bio_description].filter(Boolean).join(' — '),
    posts: vs.map((v) => v.title || v.video_description || '').filter(Boolean),
  };
}
