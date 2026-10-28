// Browser-side calls to the agent and account API routes (src/app/api). Sends the signed-in student's token.
import { accessToken } from './backend';
import type { AccountStats, Brand, ContentIdea, Platform, Talent } from './types';

export type AgentErrorCode =
  | 'bad_request' | 'needs_account' | 'no_key' | 'timeout' | 'upstream' | 'bad_output'
  | 'not_found' | 'not_configured' | 'reconnect' | 'wrong_origin' | 'unauthorized' | 'server' | 'network';

export class AgentCallError extends Error {
  constructor(public code: AgentErrorCode, message: string) {
    super(message);
    this.name = 'AgentCallError';
  }
}

type ContentSeed = Pick<ContentIdea, 'format' | 'platform' | 'length' | 'title' | 'hook' | 'beats' | 'why' | 'when'>;

/** Only what the agents need. Pictures and ids stay in the browser. */
function talentPayload(t: Talent) {
  return {
    name: t.name,
    niche: t.niche,
    story: t.story,
    accounts: t.accounts.map((a) => ({ platform: a.platform, handle: a.handle, mode: a.mode, status: a.status })),
    stats: t.stats ? { posts: t.stats.posts, views: t.stats.views, eng: t.stats.eng, time: t.stats.time, timeBy: t.stats.timeBy } : null,
  };
}

async function post<T>(path: string, body: unknown, method = 'POST'): Promise<T> {
  const token = await accessToken();
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new AgentCallError('network', 'Could not reach the server.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AgentCallError(data.error || 'server', data.message || `Request failed (${res.status}).`);
  return data as T;
}

const call = <T>(agent: string, body: unknown) => post<T>(`/api/agents/${agent}`, body);

export const agents = {
  /** 3 to 5 growth ideas tied to the talent's numbers. Fails with `needs_account` when no account shares numbers. */
  grow: (t: Talent) =>
    call<{ ideas: { title: string; why: string }[]; few: boolean }>('grow', {
      talent: talentPayload(t),
      avoid: t.ideas.map((i) => i.title),
    }),

  /** At least 3 brands that fit the talent, with where to approach each. Works without accounts. */
  scout: (t: Talent) =>
    call<{ brands: Pick<Brand, 'name' | 'what' | 'why' | 'where'>[] }>('scout', {
      talent: talentPayload(t),
      avoid: t.brands.map((b) => b.name),
    }),

  /** 3 post briefs for the talent. */
  content: (t: Talent) =>
    call<{ ideas: ContentSeed[] }>('content', {
      talent: talentPayload(t),
      avoid: (t.content || []).map((c) => c.title),
    }),

  /** A pitch and a talent profile. Leaves numbers out when no account is connected. */
  pitch: (t: Talent, b: Brand, sender: { name: string; agency: string }) =>
    call<{ pitch: string; profile: string; hasNumbers: boolean }>('pitch', {
      talent: talentPayload(t),
      brand: { name: b.name, what: b.what, why: b.why, where: b.where },
      sender,
    }),

  /**
   * A niche and character story from the talent's accounts. The server reads each account's bio and newest posts;
   * an account it cannot read goes in by handle only. `avoid` holds stories already shown, so Fill in again gives a new one.
   */
  profile: (name: string, accounts: { platform: Platform; handle: string; ref?: string }[], avoid: string[]) =>
    call<{ niche: string; story: string }>('profile', { name, accounts, avoid }),
};

export type AccountRead = { handle: string; ref: string; stats: AccountStats; few: boolean };

export const accounts = {
  /**
   * Read one account's numbers. The first read finds it by handle; later reads pass the `ref` it returned.
   * Fails with `not_configured` for a platform the server cannot read yet, and `not_found` when no account has that handle.
   */
  read: (platform: Platform, by: { handle?: string; ref?: string }) => post<AccountRead>('/api/accounts/read', { platform, ...by }),

  /**
   * Start a platform's login page (Instagram, Facebook) for a talent. The browser leaves the app; the callback
   * brings it back with ?connected=<Platform>&tid&re&ref=<id,id> (or ?connect_error=…). Fails with
   * `wrong_origin` when the app is not open at APP_URL.
   */
  startLogin: (platform: Platform, tid: string, reId: string | null) =>
    post<{ url: string }>(`/api/connect/${platform.toLowerCase()}/start`, { tid, reId }),

  /** Forget the server's token for an account the student disconnected. */
  forget: (platform: Platform, ref: string) =>
    post<{ ok: true }>(`/api/connect/${platform.toLowerCase()}?ref=${encodeURIComponent(ref)}`, undefined, 'DELETE'),
};

/** What the server is set up for: the real agents (an OpenRouter key), and the platforms it reads. */
export async function serverStatus(): Promise<{ agents: boolean; live: Platform[] }> {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    return { agents: !!data?.openrouter?.configured, live: Array.isArray(data?.accounts?.live) ? data.accounts.live : [] };
  } catch {
    return { agents: false, live: [] };
  }
}
