// Facebook Pages through Facebook Login for Business. Server only: it reads FACEBOOK_APP_ID,
// FACEBOOK_APP_SECRET and FACEBOOK_CONFIG_ID (the login configuration in the Meta app).
// In Development mode only people with a role on the Meta app can connect their Pages.
// Docs: https://developers.facebook.com/docs/facebook-login/facebook-login-for-business
import { ABOUT_POSTS, AccountError, topPosts, type AccountAbout, type AccountRead } from './account-error';
import { cryptoConfigured } from './crypto';
import { platformFetch, redirectUri } from './login-common';
import { supabaseConfigured } from './supabase';
import { loadToken, saveToken } from './tokens';
import { engagement } from './engagement';

const GRAPH = 'https://graph.facebook.com/v26.0';
const DAY = 86400000;
/** A Page with fewer posts than this in two weeks gets starter ideas instead of trends. */
const FEW_POSTS = 3;

export function facebookConfigured() {
  return !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && process.env.FACEBOOK_CONFIG_ID) && cryptoConfigured() && supabaseConfigured();
}

const facebookRedirectUri = () => redirectUri('facebook');
const call = <T>(url: string) => platformFetch<T>('Facebook', url);

/**
 * The Facebook login dialog. The configuration (FACEBOOK_CONFIG_ID) sets the permissions:
 * pages_show_list, pages_read_engagement and read_insights. The student picks the Pages to share.
 */
export function facebookAuthorizeUrl(state: string) {
  const q = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: facebookRedirectUri(),
    response_type: 'code',
    config_id: process.env.FACEBOOK_CONFIG_ID!,
    state,
  });
  return `https://www.facebook.com/v26.0/dialog/oauth?${q}`;
}

/**
 * Turn the code into a long-lived user token, then save a token for each Page the student shared.
 * A Page token made from a long-lived user token does not expire. Returns the Page ids (the `ref`s).
 */
export async function connectFacebook(userId: string, code: string): Promise<string[]> {
  const app = { client_id: process.env.FACEBOOK_APP_ID!, client_secret: process.env.FACEBOOK_APP_SECRET! };
  const short = await call<{ access_token: string }>(`${GRAPH}/oauth/access_token?${new URLSearchParams({ ...app, redirect_uri: facebookRedirectUri(), code })}`);
  const long = await call<{ access_token: string }>(`${GRAPH}/oauth/access_token?${new URLSearchParams({ ...app, grant_type: 'fb_exchange_token', fb_exchange_token: short.access_token })}`);
  const me = await call<{ id: string }>(`${GRAPH}/me?${new URLSearchParams({ fields: 'id', access_token: long.access_token })}`);
  const pages = await call<{ data?: { id: string; access_token?: string }[] }>(`${GRAPH}/me/accounts?${new URLSearchParams({ fields: 'id,access_token', limit: '100', access_token: long.access_token })}`);
  const shared = (pages.data || []).filter((p) => p.access_token);
  if (!shared.length) throw new AccountError('not_found', 'No Facebook Page was shared. Pick a Page you manage.');
  for (const p of shared) await saveToken(userId, 'Facebook', p.id, { token: p.access_token!, owner: me.id });
  return shared.map((p) => p.id);
}

type Post = {
  id: string;
  created_time: string;
  message?: string;
  status_type?: string;
  permalink_url?: string;
  shares?: { count: number };
  reactions?: { summary?: { total_count: number } };
  comments?: { summary?: { total_count: number } };
};

/** One lifetime insight number for a post. 0 when the post has none (e.g. watch time on a photo). */
async function insight(token: string, postId: string, metric: string): Promise<number> {
  try {
    const r = await call<{ data?: { name: string; values?: { value: number }[] }[] }>(`${GRAPH}/${postId}/insights?${new URLSearchParams({ metric, access_token: token })}`);
    return Number(r.data?.find((d) => d.name === metric)?.values?.[0]?.value ?? 0);
  } catch (e) {
    if (e instanceof AccountError && (e.code === 'reconnect' || e.code === 'timeout')) throw e;
    return 0;
  }
}

/** Posts, views, engagement and watch time for this week and last week (rolling 7-day windows). */
export async function readFacebook(userId: string, ref: string): Promise<AccountRead> {
  const t = await loadToken(userId, 'Facebook', ref);
  if (!t) throw new AccountError('reconnect', 'This Facebook Page has no saved access. Connect it again.');
  const q = (p: Record<string, string>) => new URLSearchParams({ ...p, access_token: t.token });

  const page = await call<{ name: string; username?: string }>(`${GRAPH}/${ref}?${q({ fields: 'name,username' })}`);
  const now = Date.now();
  const posts = await call<{ data?: Post[] }>(`${GRAPH}/${ref}/posts?${q({
    fields: 'id,created_time,message,status_type,permalink_url,shares,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0)',
    since: String(Math.floor((now - 14 * DAY) / 1000)),
    limit: '100',
  })}`);
  const recent = (posts.data || []).map((p) => ({ ...p, at: Date.parse(p.created_time) })).filter((p) => p.at > now - 14 * DAY);

  // post_media_view replaces the post impressions that Meta deprecated above v25.
  // post_video_view_time is in milliseconds and is 0 for posts without a video.
  const nums = await Promise.all(recent.map(async (p) => ({
    id: p.id,
    views: await insight(t.token, p.id, 'post_media_view'),
    ms: await insight(t.token, p.id, 'post_video_view_time'),
  })));
  const byId = new Map(nums.map((n) => [n.id, n]));

  const week = (from: number, to: number) => {
    const ps = recent.filter((p) => p.at > from && p.at <= to);
    const views = ps.reduce((n, p) => n + (byId.get(p.id)?.views || 0), 0);
    const eng = engagement(ps.map((p) => ({ views: byId.get(p.id)?.views || 0, likes: p.reactions?.summary?.total_count || 0, comments: p.comments?.summary?.total_count || 0, shares: p.shares?.count || 0 })));
    const hours = ps.reduce((n, p) => n + (byId.get(p.id)?.ms || 0), 0) / 3600000;
    return { posts: ps.length, views, eng, time: Math.round(hours * 10) / 10 };
  };
  const a = week(now - 7 * DAY, now);
  const b = week(now - 14 * DAY, now - 7 * DAY);

  return {
    handle: page.username ? '@' + page.username : page.name,
    ref,
    stats: { posts: [a.posts, b.posts], views: [a.views, b.views], eng: [a.eng, b.eng], time: [a.time, b.time] },
    few: recent.length < FEW_POSTS,
    top: topPosts(recent.filter((p) => p.at > now - 7 * DAY).map((p) => ({
      text: p.message,
      format: p.status_type === 'added_video' ? 'Video' : p.status_type === 'added_photos' ? 'Photo' : 'Post',
      views: byId.get(p.id)?.views || 0,
      acts: (p.reactions?.summary?.total_count || 0) + (p.comments?.summary?.total_count || 0) + (p.shares?.count || 0),
      url: p.permalink_url,
    }))),
    // Facebook shares no saves.
    recent: recent.map((p) => ({
      at: p.at, views: byId.get(p.id)?.views || 0, likes: p.reactions?.summary?.total_count || 0,
      comments: p.comments?.summary?.total_count || 0, shares: p.shares?.count || 0, saves: 0,
    })),
  };
}

/** The Page's category and About text and the newest post text, for the Profile agent. */
export async function aboutFacebook(userId: string, ref: string): Promise<AccountAbout> {
  const t = await loadToken(userId, 'Facebook', ref);
  if (!t) throw new AccountError('reconnect', 'This Facebook Page has no saved access. Connect it again.');
  const q = (p: Record<string, string>) => new URLSearchParams({ ...p, access_token: t.token });
  const page = await call<{ name: string; username?: string; category?: string; about?: string; description?: string }>(
    `${GRAPH}/${ref}?${q({ fields: 'name,username,category,about,description' })}`,
  );
  const posts = await call<{ data?: { message?: string }[] }>(`${GRAPH}/${ref}/posts?${q({ fields: 'message', limit: String(ABOUT_POSTS) })}`);
  return {
    platform: 'Facebook',
    handle: page.username ? '@' + page.username : page.name,
    bio: [page.name, page.category, page.about, page.description].filter(Boolean).join(' — '),
    posts: (posts.data || []).map((p) => p.message || '').filter(Boolean),
  };
}
