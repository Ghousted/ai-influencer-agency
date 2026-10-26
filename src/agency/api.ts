// Browser-side calls to the agent API routes (src/app/api/agents). Not wired into the screens yet:
// the app still uses the mock generators in logic.ts.
import type { Brand, ContentIdea, Talent } from './types';

export type AgentErrorCode = 'bad_request' | 'needs_account' | 'no_key' | 'timeout' | 'upstream' | 'bad_output' | 'server' | 'network';

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

async function call<T>(agent: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/agents/${agent}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new AgentCallError('network', 'Could not reach the server.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AgentCallError(data.error || 'server', data.message || `Request failed (${res.status}).`);
  return data as T;
}

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
};

/** Whether the server has an OpenRouter key. */
export async function agentsConfigured() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    return !!data?.openrouter?.configured;
  } catch {
    return false;
  }
}
