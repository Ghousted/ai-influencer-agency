import { NextResponse } from 'next/server';
import { randomId, sign } from '@/server/crypto';
import { appUrl, instagramAuthorizeUrl, instagramConfigured, NONCE_COOKIE } from '@/server/instagram';
import { userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';

/** The login round trip must finish within this time. */
const TTL_MS = 15 * 60000;

/**
 * POST /api/connect/instagram/start — body { tid, reId? }. Returns { url }: the Instagram login page.
 * The browser goes there, and Instagram sends it back to /api/connect/instagram/callback.
 */
export async function POST(req: Request) {
  if (!instagramConfigured()) return NextResponse.json({ error: 'not_configured', message: 'Instagram is not set up on the server.' }, { status: 503 });
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });

  // The callback lands on APP_URL. The nonce cookie only comes back if the app runs on that same site.
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(appUrl()).origin) {
    return NextResponse.json({ error: 'wrong_origin', message: `Open the app at ${appUrl()} to connect Instagram.` }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const tid = typeof body.tid === 'string' && body.tid.length <= 64 ? body.tid : null;
  const reId = typeof body.reId === 'string' && body.reId.length <= 64 ? body.reId : null;
  if (!tid) return NextResponse.json({ error: 'bad_request', message: 'tid is required.' }, { status: 400 });

  // The state proves the callback belongs to this student and this browser (the nonce cookie).
  const nonce = randomId();
  const state = sign({ uid: user.id, tid, reId, nonce }, TTL_MS);
  const res = NextResponse.json({ url: instagramAuthorizeUrl(state) });
  res.cookies.set(NONCE_COOKIE, nonce, { httpOnly: true, secure: appUrl().startsWith('https:'), sameSite: 'lax', path: '/api/connect/instagram', maxAge: TTL_MS / 1000 });
  return res;
}
