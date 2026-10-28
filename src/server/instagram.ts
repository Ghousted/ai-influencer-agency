// Instagram API with Instagram Login. Server only: it reads INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET.
// Works for Business and Creator accounts. In Development mode only Instagram Testers of the Meta app can connect.
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
import { createHmac, timingSafeEqual } from 'node:crypto';
import { AccountError, type AccountRead } from './account-error';
import { cryptoConfigured } from './crypto';
import { supabaseConfigured } from './supabase';
import { loadToken, saveToken } from './tokens';

const HOST = 'https://graph.instagram.com';
const GRAPH = `${HOST}/v26.0`;
const TIMEOUT_MS = 15000;
const DAY = 86400000;
/** Read the numbers only; the app never posts, comments or sends messages. */
const SCOPES = ['instagram_business_basic', 'instagram_business_manage_insights'];
/** An account with fewer posts than this gets starter ideas instead of trends. */
const FEW_POSTS = 10;

export function instagramConfigured() {
  return !!(process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET) && cryptoConfigured() && supabaseConfigured();
}

export function appUrl() {
  return (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/** Ties the login round trip to the browser that started it. */
export const NONCE_COOKIE = 'aia_ig_nonce';

export const instagramRedirectUri = () => `${appUrl()}/api/connect/instagram/callback`;

/** The Instagram login page. Instagram sends the student back to the callback with `code` and `state`. */
export function instagramAuthorizeUrl(state: string) {
  const q = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: instagramRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
  });
  return `https://www.instagram.com/oauth/authorize?${q}`;
}

/** fetch with a timeout. Errors carry only status and reason codes: URLs and bodies can hold tokens. */
async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: ctrl.signal, cache: 'no-store' });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new AccountError('timeout', `Instagram did not answer in ${TIMEOUT_MS} ms.`);
    throw new AccountError('upstream', 'Could not reach Instagram.');
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // graph.instagram.com nests the error; the token endpoint on api.instagram.com does not.
    const err = typeof data?.error === 'object' && data.error ? data.error : { code: data?.code, error_subcode: data?.error_type };
    // 190: the token expired or the owner removed the app. The student must connect again.
    if (err.code === 190 || res.status === 401) throw new AccountError('reconnect', 'Instagram stopped the access to this account.');
    throw new AccountError('upstream', `Instagram returned ${res.status} (${err.code ?? 'unknown'}/${err.error_subcode ?? '-'}).`, res.status);
  }
  return data as T;
}

/**
 * Turn the code from the callback into a long-lived token (60 days), and save it for the student.
 * Returns the account's Instagram user id (the `ref`).
 */
export async function connectInstagram(userId: string, code: string): Promise<string> {
  const short = await call<{ access_token?: string; user_id?: number | string; data?: { access_token: string; user_id: number | string }[] }>(
    'https://api.instagram.com/oauth/access_token',
    {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: instagramRedirectUri(),
        // Instagram sometimes adds "#_" to the code in the redirect. It is not part of the code.
        code: code.replace(/#_$/, ''),
      }),
    },
  );
  const first = short.data?.[0] || short;
  if (!first.access_token) throw new AccountError('upstream', 'Instagram returned no token.');

  const long = await call<{ access_token: string; expires_in: number }>(`${HOST}/access_token?${new URLSearchParams({
    grant_type: 'ig_exchange_token', client_secret: process.env.INSTAGRAM_APP_SECRET!, access_token: first.access_token,
  })}`);

  // The id from the token exchange can differ from the Graph API id, so ask the Graph API.
  const me = await call<{ user_id?: string; id: string }>(`${GRAPH}/me?${new URLSearchParams({ fields: 'user_id', access_token: long.access_token })}`);
  const ref = String(me.user_id || me.id);
  await saveToken(userId, 'Instagram', ref, { token: long.access_token, expiresAt: Date.now() + long.expires_in * 1000 });
  return ref;
}

/** A long-lived token lasts 60 days from its last refresh. Refresh it about once a week, while it still works. */
async function freshToken(userId: string, ref: string): Promise<string> {
  const t = await loadToken(userId, 'Instagram', ref);
  if (!t) throw new AccountError('reconnect', 'This Instagram account has no saved access. Connect it again.');
  if (t.expiresAt && t.expiresAt < Date.now()) throw new AccountError('reconnect', 'The Instagram access expired. Connect it again.');
  if (Date.now() - t.updatedAt > 7 * DAY) {
    try {
      const r = await call<{ access_token: string; expires_in: number }>(`${HOST}/refresh_access_token?${new URLSearchParams({
        grant_type: 'ig_refresh_token', access_token: t.token,
      })}`);
      await saveToken(userId, 'Instagram', ref, { token: r.access_token, expiresAt: Date.now() + r.expires_in * 1000 });
      return r.access_token;
    } catch (e) {
      if (e instanceof AccountError && e.code === 'reconnect') throw e;
      // The old token still works for now. Try the refresh again on the next read.
    }
  }
  return t.token;
}

type Media = { id: string; timestamp: string; like_count?: number; comments_count?: number };

/** Posts, views and engagement for this week and last week (rolling 7-day windows). */
export async function readInstagram(userId: string, ref: string): Promise<AccountRead> {
  const token = await freshToken(userId, ref);
  const q = (fields: Record<string, string>) => new URLSearchParams({ ...fields, access_token: token });

  const me = await call<{ username: string; media_count?: number }>(`${GRAPH}/me?${q({ fields: 'user_id,username,media_count' })}`);
  // Media are newest first. 50 covers two weeks for all but the busiest accounts.
  const media = await call<{ data?: Media[] }>(`${GRAPH}/me/media?${q({ fields: 'id,timestamp,like_count,comments_count', limit: '50' })}`);
  const now = Date.now();
  const recent = (media.data || []).map((m) => ({ ...m, at: Date.parse(m.timestamp) })).filter((m) => m.at > now - 14 * DAY);

  // Views come from each post's insights. A post that has no insights (too new, or an old format) counts 0.
  const views = new Map<string, number>();
  await Promise.all(recent.map(async (m) => {
    try {
      const r = await call<{ data?: { name: string; values?: { value: number }[]; total_value?: { value: number } }[] }>(
        `${GRAPH}/${m.id}/insights?${q({ metric: 'views' })}`,
      );
      const v = r.data?.find((d) => d.name === 'views');
      views.set(m.id, Number(v?.values?.[0]?.value ?? v?.total_value?.value ?? 0));
    } catch (e) {
      if (e instanceof AccountError && (e.code === 'reconnect' || e.code === 'timeout')) throw e;
    }
  }));

  const week = (from: number, to: number) => {
    const ms = recent.filter((m) => m.at > from && m.at <= to);
    const v = ms.reduce((n, m) => n + (views.get(m.id) || 0), 0);
    const acts = ms.reduce((n, m) => n + (m.like_count || 0) + (m.comments_count || 0), 0);
    return { posts: ms.length, views: v, eng: v ? Math.round((acts / v) * 1000) / 10 : 0 };
  };
  const a = week(now - 7 * DAY, now);
  const b = week(now - 14 * DAY, now - 7 * DAY);

  return {
    handle: '@' + me.username,
    ref,
    // Instagram shares watch time only for reels, and Meta still marks that number "in development".
    stats: { posts: [a.posts, b.posts], views: [a.views, b.views], eng: [a.eng, b.eng], time: null },
    few: (me.media_count ?? 0) < FEW_POSTS,
  };
}

/**
 * Meta's deauthorize and data deletion callbacks send `signed_request`: "<signature>.<payload>",
 * both base64url, signed with the app secret. Returns the payload, or null when the signature is wrong.
 */
export function parseSignedRequest(value: string): { user_id?: string } | null {
  const [sig, payload] = value.split('.');
  if (!sig || !payload || !process.env.INSTAGRAM_APP_SECRET) return null;
  const want = createHmac('sha256', process.env.INSTAGRAM_APP_SECRET).update(payload).digest();
  const got = Buffer.from(sig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return { user_id: data.user_id != null ? String(data.user_id) : undefined };
  } catch {
    return null;
  }
}
