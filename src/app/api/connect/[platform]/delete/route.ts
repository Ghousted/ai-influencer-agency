import { NextResponse } from 'next/server';
import { randomId } from '@/server/crypto';
import { appUrl, parseSignedRequest } from '@/server/login-common';
import { loginFor } from '@/server/logins';
import { deleteTokensForOwner } from '@/server/tokens';

export const runtime = 'nodejs';

/**
 * POST /api/connect/{instagram|facebook}/delete — Meta's data deletion request. The server keeps only
 * access tokens for a platform user, so the request is done when that user's tokens are gone.
 */
export async function POST(req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const login = loginFor((await params).platform);
  const form = await req.formData().catch(() => null);
  const data = login ? parseSignedRequest(String(form?.get('signed_request') || ''), login.secret()) : null;
  if (!login || !data?.user_id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  await deleteTokensForOwner(login.platform, data.user_id);
  const code = randomId();
  return NextResponse.json({ url: `${appUrl()}/?deletion=${code}`, confirmation_code: code });
}
