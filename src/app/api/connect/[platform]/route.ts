import { NextResponse, type NextRequest } from 'next/server';
import { loginFor } from '@/server/logins';
import { userFromRequest } from '@/server/supabase';
import { deleteToken } from '@/server/tokens';

export const runtime = 'nodejs';

/** DELETE /api/connect/{instagram|facebook}?ref=<id> — forget the signed-in student's token for that account. */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const login = loginFor((await params).platform);
  if (!login) return NextResponse.json({ error: 'bad_request', message: 'Unknown platform.' }, { status: 404 });
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref || !/^[\w-]{1,64}$/.test(ref)) return NextResponse.json({ error: 'bad_request', message: 'ref is required.' }, { status: 400 });
  await deleteToken(user.id, login.platform, ref);
  return NextResponse.json({ ok: true });
}
