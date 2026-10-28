import { NextResponse, type NextRequest } from 'next/server';
import { AccountError } from '@/server/account-error';
import { verify } from '@/server/crypto';
import { appUrl } from '@/server/login-common';
import { loginFor, nonceCookie } from '@/server/logins';

export const runtime = 'nodejs';

type State = { uid: string; slug: string; tid: string; reId: string | null; nonce: string; tab?: boolean };

/** The app tab listens on this channel for the result of a login page that ran in its own tab. */
const CHANNEL = 'aia-connect';

/**
 * The login tab's last page. It hands the result to the app tab and closes itself. The platform's login page
 * cuts the link to the tab that opened it (window.opener), so the result goes over a BroadcastChannel.
 * If the app tab is gone, the link opens the app with the result, as the same-tab login does.
 */
function tabPage(platform: string, params: Record<string, string>, back: string) {
  const ok = !!params.connected;
  const json = JSON.stringify(params).replace(/</g, '\\u003c');
  const text = ok ? `${platform} is connected.` : `${platform} was not connected.`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${text}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font:500 15px/1.5 system-ui,sans-serif;color:#18181b;background:#fafafb">
<div style="text-align:center;padding:24px"><p style="font-weight:700;font-size:18px;margin:0 0 6px">${text}</p>
<p style="margin:0 0 16px;color:#52525b">You can close this tab and go back to the app.</p>
<a href="${back.replace(/&/g, '&amp;')}" style="color:#006AFF;font-weight:700">Open the app</a></div>
<script>try{var c=new BroadcastChannel('${CHANNEL}');c.postMessage(${json});c.close()}catch(e){}setTimeout(function(){window.close()},400)</script>
</body></html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

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
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(p)) if (v) { url.searchParams.set(k, v); params[k] = v; }
    const res = state?.tab ? tabPage(login.platform, { ...params, platform: login.platform }, url.toString()) : NextResponse.redirect(url, 303);
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
