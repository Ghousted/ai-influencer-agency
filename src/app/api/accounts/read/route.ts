import { NextResponse } from 'next/server';
import { AccountError, parseReadRequest, readAccount } from '@/server/accounts';
import { supabaseConfigured, userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

const STATUS: Record<AccountError['code'], number> = { bad_request: 400, not_found: 404, not_configured: 503, timeout: 504, upstream: 502 };

/** POST /api/accounts/read — body { platform, handle?, ref? }. Reads one account's numbers. */
export async function POST(req: Request) {
  // With Supabase set up, only signed-in students can spend the platform quotas.
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
    const result = await readAccount(parseReadRequest(body));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof AccountError) {
      if (e.code === 'timeout' || e.code === 'upstream') console.warn(`[accounts] ${e.code} ${e.message}`);
      return NextResponse.json({ error: e.code, message: e.message }, { status: STATUS[e.code] });
    }
    console.error('[accounts]', (e as Error).name);
    return NextResponse.json({ error: 'server', message: 'Something went wrong.' }, { status: 500 });
  }
}
