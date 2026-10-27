import { NextResponse } from 'next/server';
import { AGENTS, parseRequest, runAgent, type AgentName } from '@/server/agents';
import { AgentError } from '@/server/openrouter';
import { supabaseConfigured, userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STATUS: Record<AgentError['code'], number> = { bad_request: 400, needs_account: 409, no_key: 503, timeout: 504, upstream: 502, bad_output: 502 };

/** POST /api/agents/{grow|scout|content|pitch} — see src/server/agents.ts for the body. */
export async function POST(req: Request, { params }: { params: Promise<{ agent: string }> }) {
  const { agent } = await params;
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
