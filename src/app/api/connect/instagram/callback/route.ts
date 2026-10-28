import { NextResponse, type NextRequest } from 'next/server';
import { AccountError } from '@/server/account-error';
import { verify } from '@/server/crypto';
import { appUrl, connectInstagram, instagramConfigured, NONCE_COOKIE } from '@/server/instagram';

export const runtime = 'nodejs';

type State = { uid: string; tid: string; reId: string | null; nonce: string };

/**
 * GET /api/connect/instagram/callback — Instagram sends the student here after its login page.
 * Saves the token, then sends the browser back to the app: ?connected=Instagram&tid&re&ref,
 * or ?connect_error=<reason>&platform=Instagram&tid&re. The app finishes the connect from there.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const state = verify<State>(q.get('state') || '');
  const back = (params: Record<string, string | null | undefined>) => {
    const url = new URL(appUrl() + '/');
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
    const res = NextResponse.redirect(url, 303);
    res.cookies.delete({ name: NONCE_COOKIE, path: '/api/connect/instagram' });
    return res;
  };
  const fail = (reason: string) => back({ connect_error: reason, platform: 'Instagram', tid: state?.tid, re: state?.reId });

  if (!state || state.nonce !== req.cookies.get(NONCE_COOKIE)?.value) return fail('expired');
  if (q.get('error')) return fail(q.get('error') === 'access_denied' ? 'denied' : 'failed');
  const code = q.get('code');
  if (!code || !instagramConfigured()) return fail('failed');

  try {
    const ref = await connectInstagram(state.uid, code);
    return back({ connected: 'Instagram', tid: state.tid, re: state.reId, ref });
  } catch (e) {
    console.warn('[connect] instagram', e instanceof AccountError ? `${e.code} ${e.message}` : (e as Error).message);
    return fail('failed');
  }
}
