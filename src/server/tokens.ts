// The account_tokens table (supabase/migrations/0003_account_tokens.sql). Server only.
// Tokens go in encrypted and come out decrypted; nothing here returns a token to the browser.
import type { Platform } from '@/agency/types';
import { decrypt, encrypt } from './crypto';
import { supabaseAdmin } from './supabase';

export type StoredToken = { token: string; refreshToken: string | null; expiresAt: number | null; updatedAt: number };

/** `owner` is the platform user who granted the token (see migration 0004). */
export async function saveToken(userId: string, platform: Platform, ref: string, t: { token: string; refreshToken?: string | null; expiresAt?: number | null; owner: string }) {
  const { error } = await supabaseAdmin().from('account_tokens').upsert({
    user_id: userId, platform, ref, owner: t.owner,
    token: encrypt(t.token),
    refresh_token: t.refreshToken ? encrypt(t.refreshToken) : null,
    expires_at: t.expiresAt ? new Date(t.expiresAt).toISOString() : null,
  }, { onConflict: 'user_id,platform,ref' });
  if (error) throw new Error(`Could not save the token (${error.code}).`);
}

export async function loadToken(userId: string, platform: Platform, ref: string): Promise<StoredToken | null> {
  const { data, error } = await supabaseAdmin().from('account_tokens')
    .select('token, refresh_token, expires_at, updated_at')
    .eq('user_id', userId).eq('platform', platform).eq('ref', ref).maybeSingle();
  if (error) throw new Error(`Could not load the token (${error.code}).`);
  if (!data) return null;
  return {
    token: decrypt(data.token),
    refreshToken: data.refresh_token ? decrypt(data.refresh_token) : null,
    expiresAt: data.expires_at ? Date.parse(data.expires_at) : null,
    updatedAt: Date.parse(data.updated_at),
  };
}

/** Forget one student's token for an account (the student disconnected it). */
export async function deleteToken(userId: string, platform: Platform, ref: string) {
  await supabaseAdmin().from('account_tokens').delete().eq('user_id', userId).eq('platform', platform).eq('ref', ref);
}

/** Forget every token a platform user granted (they removed the app on the platform, or asked to delete their data). */
export async function deleteTokensForOwner(platform: Platform, owner: string) {
  const { error } = await supabaseAdmin().from('account_tokens').delete().eq('platform', platform).eq('owner', owner);
  if (error) throw new Error(`Could not delete the tokens (${error.code}).`);
}
