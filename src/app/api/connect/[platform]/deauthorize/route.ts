import { NextResponse } from 'next/server';
import { parseSignedRequest } from '@/server/login-common';
import { loginFor } from '@/server/logins';
import { deleteTokensForOwner } from '@/server/tokens';

export const runtime = 'nodejs';

/** POST /api/connect/{instagram|facebook}/deauthorize — Meta calls this when a user removes the app. */
export async function POST(req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const login = loginFor((await params).platform);
  const form = await req.formData().catch(() => null);
  const data = login ? parseSignedRequest(String(form?.get('signed_request') || ''), login.secret()) : null;
  if (!login || !data?.user_id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  // Without the token the next read fails with `reconnect`, so the app shows Reconnect.
  await deleteTokensForOwner(login.platform, data.user_id);
  return NextResponse.json({ ok: true });
}
