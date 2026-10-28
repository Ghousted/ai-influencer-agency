import { NextResponse } from 'next/server';
import { AccountError, readAbout } from '@/server/accounts';
import { AGENTS, parseProfileRequest, parseRequest, runAgent, runProfile, type AgentName } from '@/server/agents';
import { AgentError } from '@/server/openrouter';
import { supabaseConfigured, userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STATUS: Record<AgentError['code'], number> = { bad_request: 400, needs_account: 409, no_key: 503, timeout: 504, upstream: 502, bad_output: 502 };

/** POST /api/agents/{grow|scout|content|pitch|profile} — see src/server/agents.ts for the body. */
export async function POST(req: Request, { params }: { params: Promise<{ agent: string }> }) {
  const { agent } = await params;
  if (agent === 'profile') return profile(req);
  if (!AGENTS.includes(agent as AgentName)) return NextResponse.json({ error: 'unknown_agent', message: `Unknown agent "${agent}".` }, { status: 404 });

  // With Supabase set up, only signed-in students can spend the OpenRouter key.
  if (supabaseConfigured() && !(await userFromRequest(req))) {
    return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'The body must be JSON.' }, { status: 400 });
  }

  try {
    const request = parseRequest(agent as AgentName, body);
    const result = await runAgent(agent as AgentName, request);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof AgentError) {
      if (e.code !== 'bad_request' && e.code !== 'needs_account') console.warn(`[agents] ${agent}: ${e.code} ${e.message}`);
      return NextResponse.json({ error: e.code, message: e.message }, { status: STATUS[e.code] });
    }
    console.error('[agents]', e);
    return NextResponse.json({ error: 'server', message: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * POST /api/agents/profile — body { name, accounts: [{ platform, ref?, handle? }], avoid? }. Returns { niche, story }.
 * Reads each account's bio and newest posts first. An account it cannot read goes in by handle only.
 */
async function profile(req: Request) {
  const user = supabaseConfigured() ? await userFromRequest(req) : null;
  if (supabaseConfigured() && !user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'The body must be JSON.' }, { status: 400 });
  }

  try {
    const r = parseProfileRequest(body);
    const reads = await Promise.allSettled(r.accounts.map((a) => readAbout(a, user?.id ?? null)));
    const abouts = reads.flatMap((x) => (x.status === 'fulfilled' ? [x.value] : []));
    const others = r.accounts.flatMap((a, i) => {
      const x = reads[i];
      if (x.status === 'fulfilled') return [];
      if (x.reason instanceof AccountError && x.reason.code !== 'not_configured') console.warn(`[agents] profile: ${a.platform} ${x.reason.code}`);
      return [{ platform: a.platform, handle: a.handle || 'account' }];
    });
    return NextResponse.json(await runProfile(r.name, abouts, others, r.avoid));
  } catch (e) {
    if (e instanceof AgentError) {
      if (e.code !== 'bad_request') console.warn(`[agents] profile: ${e.code} ${e.message}`);
      return NextResponse.json({ error: e.code, message: e.message }, { status: STATUS[e.code] });
    }
    console.error('[agents] profile', e);
    return NextResponse.json({ error: 'server', message: 'Something went wrong.' }, { status: 500 });
  }
}
