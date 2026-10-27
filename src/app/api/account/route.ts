import { NextResponse } from 'next/server';
import { supabaseAdmin, userFromRequest } from '@/server/supabase';

export const runtime = 'nodejs';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'ai-influencer-agency';

/** DELETE /api/account — deletes the signed-in student, their pictures and (by cascade) all their rows. */
export async function DELETE(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: 'unauthorized', message: 'Please log in again.' }, { status: 401 });

  const admin = supabaseAdmin();

  // Pictures live under <user_id>/ in the bucket. Remove them page by page.
  for (;;) {
    const { data: files, error } = await admin.storage.from(BUCKET).list(user.id, { limit: 100 });
    if (error || !files || !files.length) break;
    const { error: rmError } = await admin.storage.from(BUCKET).remove(files.map((f) => `${user.id}/${f.name}`));
    if (rmError) break;
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('[account] delete failed', error.message);
    return NextResponse.json({ error: 'server', message: 'The app cannot delete your account now. Try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
