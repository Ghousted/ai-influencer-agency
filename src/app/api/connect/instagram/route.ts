import { NextResponse, type NextRequest } from 'next/server';
import { userFromRequest } from '@/server/supabase';
import { deleteToken } from '@/server/tokens';

export const runtime = 'nodejs';

/** DELETE /api/connect/instagram?ref=<id> — forget the signed-in student's token for that account. */
export async function DELETE(req: NextRequest) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref || !/^[\w-]{1,64}$/.test(ref)) return NextResponse.json({ error: 'bad_request', message: 'ref is required.' }, { status: 400 });
  await deleteToken(user.id, 'Instagram', ref);
  return NextResponse.json({ ok: true });
}
