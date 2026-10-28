// Shared by the platforms that connect through a login page (Instagram, Facebook). Server only.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { AccountError } from './account-error';

const TIMEOUT_MS = 15000;

export function appUrl() {
  return (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/** Where a platform's login page sends the student back. Register this URL in the platform's app settings. */
export const redirectUri = (slug: string) => `${appUrl()}/api/connect/${slug}/callback`;

/**
 * fetch with a timeout, for a platform's Graph API. Errors carry only status and error codes:
 * URLs and bodies can hold tokens, so they are never logged or returned.
 */
export async function platformFetch<T>(name: string, url: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: ctrl.signal, cache: 'no-store' });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new AccountError('timeout', `${name} did not answer in ${TIMEOUT_MS} ms.`);
    throw new AccountError('upstream', `Could not reach ${name}.`);
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // The Graph APIs nest the error; Instagram's token endpoint does not.
    const err = typeof data?.error === 'object' && data.error ? data.error : { code: data?.code, error_subcode: data?.error_type };
    // 190: the token expired or the owner removed the app. The student must connect again.
    if (err.code === 190 || res.status === 401) throw new AccountError('reconnect', `${name} stopped the access to this account.`);
    throw new AccountError('upstream', `${name} returned ${res.status} (${err.code ?? 'unknown'}/${err.error_subcode ?? '-'}).`, res.status);
  }
  return data as T;
}

/**
 * Meta's deauthorize and data deletion callbacks send `signed_request`: "<signature>.<payload>",
 * both base64url, signed with the app secret. Returns the payload's user id, or null when the signature is wrong.
 */
export function parseSignedRequest(value: string, secret: string | undefined): { user_id?: string } | null {
  const [sig, payload] = value.split('.');
  if (!sig || !payload || !secret) return null;
  const want = createHmac('sha256', secret).update(payload).digest();
  const got = Buffer.from(sig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return { user_id: data.user_id != null ? String(data.user_id) : undefined };
  } catch {
    return null;
  }
}
