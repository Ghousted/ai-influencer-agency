import { NextResponse, type NextRequest } from 'next/server';
import { AccountError } from '@/server/account-error';
import { verify } from '@/server/crypto';
import { appUrl } from '@/server/login-common';
import { loginFor, nonceCookie } from '@/server/logins';

export const runtime = 'nodejs';

type State = { uid: string; slug: string; tid: string; reId: string | null; nonce: string };

/**
 * GET /api/connect/{instagram|facebook}/callback — the platform sends the student here after its login page.
 * Saves the tokens, then sends the browser back to the app: ?connected=<Platform>&tid&re&ref=<id,id>,
 * or ?connect_error=<reason>&platform=<Platform>&tid&re. The app finishes the connect from there.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform: slug } = await params;
  const login = loginFor(slug);
  if (!login) return NextResponse.redirect(new URL(appUrl() + '/'), 303);
  const q = req.nextUrl.searchParams;
  const state = verify<State>(q.get('state') || '');
  const back = (p: Record<string, string | null | undefined>) => {
    const url = new URL(appUrl() + '/');
    for (const [k, v] of Object.entries(p)) if (v) url.searchParams.set(k, v);
    const res = NextResponse.redirect(url, 303);
    res.cookies.delete({ name: nonceCookie(slug), path: `/api/connect/${slug}` });
    return res;
  };
  const fail = (reason: string) => back({ connect_error: reason, platform: login.platform, tid: state?.tid, re: state?.reId });

  if (!state || state.slug !== slug || state.nonce !== req.cookies.get(nonceCookie(slug))?.value) return fail('expired');
  if (q.get('error')) return fail(q.get('error') === 'access_denied' ? 'denied' : 'failed');
  const code = q.get('code');
  if (!code || !login.configured()) return fail('failed');

  try {
    const refs = await login.connect(state.uid, code);
    return back({ connected: login.platform, tid: state.tid, re: state.reId, ref: refs.join(',') });
  } catch (e) {
    console.warn(`[connect] ${slug}`, e instanceof AccountError ? `${e.code} ${e.message}` : (e as Error).message);
    return fail(e instanceof AccountError && e.code === 'not_found' ? 'no_pages' : 'failed');
  }
}
