// Supabase calls for sign-in and the agency row. Every function returns a plain result the
// app can show; errors become short messages in the product's voice.
import { BUCKET, supabase } from './supabase';

export type Profile = { userId: string; email: string; name: string; agencyName: string; draft: unknown; settings: Record<string, unknown> };
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

function authMessage(msg: string | undefined) {
  const m = (msg || '').toLowerCase();
  if (m.includes('invalid login')) return 'Wrong email or password.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'An account with this email already exists. Log in instead.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox.';
  if (m.includes('password')) return 'Your password must have 8 characters or more.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many tries. Wait a minute, then try again.';
  if (m.includes('fetch') || m.includes('network')) return 'The app cannot reach the server. Check your connection.';
  return 'Something went wrong. Try again.';
}

async function loadProfile(userId: string, email: string): Promise<Result<Profile>> {
  const sb = supabase()!;
  const { data, error } = await sb.from('agencies').select('name, owner_name, draft, settings').eq('user_id', userId).maybeSingle();
  if (error) return fail('The app cannot load your agency. Try again.');
  if (!data) return fail('Your agency was not found.');
  return { ok: true, data: { userId, email, name: data.owner_name, agencyName: data.name, draft: data.draft, settings: data.settings || {} } };
}

/** The signed-in student, if a session is saved in this browser. */
export async function currentProfile(): Promise<Profile | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  const u = data.session?.user;
  if (!u) return null;
  const p = await loadProfile(u.id, u.email || '');
  return p.ok ? p.data : null;
}

export async function signUp(input: { name: string; email: string; password: string; agency: string }): Promise<Result<Profile | 'confirm'>> {
  const sb = supabase()!;
  const { data, error } = await sb.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, agency: input.agency } },
  });
  if (error) return fail(authMessage(error.message));
  // Supabase hides "already registered" behind an empty identities list.
  if (data.user && data.user.identities && data.user.identities.length === 0) return fail(authMessage('already registered'));
  if (!data.session || !data.user) return { ok: true, data: 'confirm' };
  return loadProfile(data.user.id, data.user.email || input.email);
}

export async function signIn(email: string, password: string): Promise<Result<Profile>> {
  const sb = supabase()!;
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user) return fail(authMessage(error?.message));
  return loadProfile(data.user.id, data.user.email || email);
}

export async function signOut() {
  await supabase()?.auth.signOut();
}

export async function updateAgency(patch: { name?: string; owner_name?: string; draft?: unknown; settings?: Record<string, unknown> }): Promise<Result<null>> {
  const sb = supabase();
  if (!sb) return { ok: true, data: null };
  const { data } = await sb.auth.getUser();
  if (!data.user) return fail('Please log in again.');
  const { error } = await sb.from('agencies').update(patch).eq('user_id', data.user.id);
  return error ? fail('The app cannot save this. Try again.') : { ok: true, data: null };
}

/** Changing the email sends a confirmation link to the new address (and the old one, if secure email change is on). */
export async function updateEmail(email: string): Promise<Result<'confirm'>> {
  const { error } = await supabase()!.auth.updateUser({ email });
  return error ? fail(authMessage(error.message)) : { ok: true, data: 'confirm' };
}

export async function changePassword(email: string, current: string, next: string): Promise<Result<null>> {
  const sb = supabase()!;
  const check = await sb.auth.signInWithPassword({ email, password: current });
  if (check.error) return fail('Your current password is wrong.');
  const { error } = await sb.auth.updateUser({ password: next });
  return error ? fail(authMessage(error.message)) : { ok: true, data: null };
}

/** The user id of the session saved in this browser (another tab can sign out or sign in someone else). */
export async function sessionUserId(): Promise<string | null> {
  const { data } = (await supabase()?.auth.getSession()) || { data: { session: null } };
  return data.session?.user.id || null;
}

/** The access token for calls to this app's own API routes. */
export async function accessToken(): Promise<string | null> {
  const { data } = (await supabase()?.auth.getSession()) || { data: { session: null } };
  return data.session?.access_token || null;
}

export async function deleteAccount(): Promise<Result<null>> {
  const token = await accessToken();
  if (!token) return fail('Please log in again.');
  const res = await fetch('/api/account', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
  if (!res || !res.ok) return fail('The app cannot delete your account now. Try again.');
  await signOut();
  return { ok: true, data: null };
}

// ---- Talent pictures ------------------------------------------------------------
// Pictures go to the storage bucket under <user_id>/. Talents keep only the public URL.

const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

/** Upload a picture given as a data URL (the form resizes it to 512px JPEG first). Returns its public URL. */
export async function uploadPicture(dataUrl: string): Promise<Result<string>> {
  const sb = supabase();
  if (!sb) return fail('Pictures need an account. Log in first.');
  const { data } = await sb.auth.getUser();
  if (!data.user) return fail('Please log in again.');
  const blob = await fetch(dataUrl).then((r) => r.blob()).catch(() => null);
  if (!blob) return fail('The app cannot read this picture.');
  const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${data.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type || 'image/jpeg', cacheControl: '31536000', upsert: false });
  if (error) return fail('The app cannot upload the picture. Try again.');
  return { ok: true, data: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
}

/** Remove a picture this app uploaded. Other URLs (demo images, data URLs) are left alone. */
export async function removePicture(url: string | null | undefined) {
  const sb = supabase();
  const i = url ? url.indexOf(PUBLIC_PREFIX) : -1;
  if (!sb || !url || i < 0) return;
  await sb.storage.from(BUCKET).remove([decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length))]);
}
