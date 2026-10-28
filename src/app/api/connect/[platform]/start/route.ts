import { NextResponse } from 'next/server';
import { randomId, sign } from '@/server/crypto';
import { appUrl } from '@/server/login-common';
import { loginFor, nonceCookie } from '@/server/logins';
import { userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';

/** The login round trip must finish within this time. */
const TTL_MS = 15 * 60000;

/**
 * POST /api/connect/{instagram|facebook}/start — body { tid, reId?, tab? }. Returns { url }: the platform's login page.
 * The browser goes there, and the platform sends it back to /api/connect/<platform>/callback.
 * `tab`: the login page runs in a new tab, so the callback hands the result to the app tab instead of reloading the app.
 */
export async function POST(req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform: slug } = await params;
  const login = loginFor(slug);
  if (!login) return NextResponse.json({ error: 'bad_request', message: `Unknown platform "${slug}".` }, { status: 404 });
  if (!login.configured()) return NextResponse.json({ error: 'not_configured', message: `${login.platform} is not set up on the server.` }, { status: 503 });
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });

  // The callback lands on APP_URL. The nonce cookie only comes back if the app runs on that same site.
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(appUrl()).origin) {
    return NextResponse.json({ error: 'wrong_origin', message: `Open the app at ${appUrl()} to connect ${login.platform}.` }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const tid = typeof body.tid === 'string' && body.tid.length <= 64 ? body.tid : null;
  const reId = typeof body.reId === 'string' && body.reId.length <= 64 ? body.reId : null;
  const tab = body.tab === true;
  if (!tid) return NextResponse.json({ error: 'bad_request', message: 'tid is required.' }, { status: 400 });

  // The state proves the callback belongs to this student and this browser (the nonce cookie).
  const nonce = randomId();
  const state = sign({ uid: user.id, slug, tid, reId, nonce, tab }, TTL_MS);
  const res = NextResponse.json({ url: login.authorizeUrl(state) });
  res.cookies.set(nonceCookie(slug), nonce, { httpOnly: true, secure: appUrl().startsWith('https:'), sameSite: 'lax', path: `/api/connect/${slug}`, maxAge: TTL_MS / 1000 });
  return res;
}
