import { NextResponse } from 'next/server';
import { randomId } from '@/server/crypto';
import { appUrl, parseSignedRequest } from '@/server/instagram';
import { deleteTokensForAccount } from '@/server/tokens';

export const runtime = 'nodejs';

/**
 * POST /api/connect/instagram/delete — Meta's data deletion request. The server keeps only the access
 * token for an Instagram account, so the request is done when the tokens are gone.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const data = parseSignedRequest(String(form?.get('signed_request') || ''));
  if (!data?.user_id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  await deleteTokensForAccount('Instagram', data.user_id);
  const code = randomId();
  return NextResponse.json({ url: `${appUrl()}/?deletion=${code}`, confirmation_code: code });
}
