import { NextResponse } from 'next/server';
import { parseSignedRequest } from '@/server/instagram';
import { deleteTokensForAccount } from '@/server/tokens';

export const runtime = 'nodejs';

/** POST /api/connect/instagram/deauthorize — Meta calls this when an account owner removes the app on Instagram. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const data = parseSignedRequest(String(form?.get('signed_request') || ''));
  if (!data?.user_id) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  // Without the token the next read fails with `reconnect`, so the app shows Reconnect.
  await deleteTokensForAccount('Instagram', data.user_id);
  return NextResponse.json({ ok: true });
}
