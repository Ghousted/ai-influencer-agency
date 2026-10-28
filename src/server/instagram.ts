// Instagram API with Instagram Login. Server only: it reads INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET.
// Works for Business and Creator accounts. In Development mode only Instagram Testers of the Meta app can connect.
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
import { ABOUT_POSTS, AccountError, topPosts, type AccountAbout, type AccountRead } from './account-error';
import { cryptoConfigured } from './crypto';
import { platformFetch, redirectUri } from './login-common';
import { supabaseConfigured } from './supabase';
import { loadToken, saveToken } from './tokens';

const HOST = 'https://graph.instagram.com';
const GRAPH = `${HOST}/v26.0`;
const DAY = 86400000;
/** Read the numbers only; the app never posts, comments or sends messages. */
const SCOPES = ['instagram_business_basic', 'instagram_business_manage_insights'];
/** An account with fewer posts than this gets starter ideas instead of trends. */
const FEW_POSTS = 10;

export function instagramConfigured() {
  return !!(process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET) && cryptoConfigured() && supabaseConfigured();
}

const instagramRedirectUri = () => redirectUri('instagram');

/** The Instagram login page. Instagram sends the student back to the callback with `code` and `state`. */
export function instagramAuthorizeUrl(state: string) {
  const q = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: instagramRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
    // Always show the login screen, so a student with several AI talents picks the right account each time.
    force_reauth: 'true',
  });
  return `https://www.instagram.com/oauth/authorize?${q}`;
}

const call = <T>(url: string, init?: RequestInit) => platformFetch<T>('Instagram', url, init);

/**
 * Turn the code from the callback into a long-lived token (60 days), and save it for the student.
 * Returns the account's Instagram user id (the `ref`), as a list like the other login platforms.
 */
export async function connectInstagram(userId: string, code: string): Promise<string[]> {
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
  await saveToken(userId, 'Instagram', ref, { token: long.access_token, expiresAt: Date.now() + long.expires_in * 1000, owner: ref });
  return [ref];
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
      await saveToken(userId, 'Instagram', ref, { token: r.access_token, expiresAt: Date.now() + r.expires_in * 1000, owner: ref });
      return r.access_token;
    } catch (e) {
      if (e instanceof AccountError && e.code === 'reconnect') throw e;
      // The old token still works for now. Try the refresh again on the next read.
    }
  }
  return t.token;
}

type Media = {
  id: string; timestamp: string; like_count?: number; comments_count?: number;
  caption?: string; media_type?: string; media_product_type?: string; permalink?: string;
};

const FORMAT: Record<string, string> = { CAROUSEL_ALBUM: 'Carousel', IMAGE: 'Photo', VIDEO: 'Video' };

/** Posts, views and engagement for this week and last week (rolling 7-day windows). */
export async function readInstagram(userId: string, ref: string): Promise<AccountRead> {
  const token = await freshToken(userId, ref);
  const q = (fields: Record<string, string>) => new URLSearchParams({ ...fields, access_token: token });

  const me = await call<{ username: string; media_count?: number }>(`${GRAPH}/me?${q({ fields: 'user_id,username,media_count' })}`);
  // Media are newest first. 50 covers two weeks for all but the busiest accounts.
  const media = await call<{ data?: Media[] }>(`${GRAPH}/me/media?${q({ fields: 'id,timestamp,like_count,comments_count,caption,media_type,media_product_type,permalink', limit: '50' })}`);
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
    top: topPosts(recent.filter((m) => m.at > now - 7 * DAY).map((m) => ({
      text: m.caption,
      format: m.media_product_type === 'REELS' ? 'Reel' : FORMAT[m.media_type || ''] || 'Post',
      views: views.get(m.id) || 0,
      acts: (m.like_count || 0) + (m.comments_count || 0),
      url: m.permalink,
    }))),
  };
}

/** The bio and the newest captions, for the Profile agent. */
export async function aboutInstagram(userId: string, ref: string): Promise<AccountAbout> {
  const token = await freshToken(userId, ref);
  const q = (fields: Record<string, string>) => new URLSearchParams({ ...fields, access_token: token });
  let me: { username: string; name?: string; biography?: string };
  try {
    me = await call(`${GRAPH}/me?${q({ fields: 'username,name,biography' })}`);
  } catch (e) {
    if (e instanceof AccountError && (e.code === 'reconnect' || e.code === 'timeout')) throw e;
    // Some accounts do not share the bio with this login. Read the account without it.
    me = await call(`${GRAPH}/me?${q({ fields: 'username,name' })}`);
  }
  const media = await call<{ data?: { caption?: string }[] }>(`${GRAPH}/me/media?${q({ fields: 'caption', limit: String(ABOUT_POSTS) })}`);
  return {
    platform: 'Instagram',
    handle: '@' + me.username,
    bio: [me.name, me.biography].filter(Boolean).join(' — '),
    posts: (media.data || []).map((m) => m.caption || '').filter(Boolean),
  };
}
