// Server-side Supabase helpers. The secret key skips row-level security, so this file must
// never be imported from a client component.
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

let admin: SupabaseClient | null = null;

export function supabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

/** Admin client (secret key). Only for work the student cannot do themselves, e.g. deleting their account. */
export function supabaseAdmin(): SupabaseClient {
  if (!supabaseConfigured()) throw new Error('Supabase is not configured.');
  if (!admin) {
    admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}

/** The signed-in student for this request, from the `Authorization: Bearer <access token>` header. */
export async function userFromRequest(req: Request): Promise<User | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !supabaseConfigured()) return null;
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  return error ? null : data.user;
}
