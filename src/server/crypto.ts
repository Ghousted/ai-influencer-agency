// Encryption for platform tokens, and signed values for the OAuth round trip. Server only.
// Both use TOKEN_ENCRYPTION_KEY (32 bytes, base64). Make one with: openssl rand -base64 32
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

function key(): Buffer {
  const k = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY || '', 'base64');
  if (k.length !== 32) throw new Error('TOKEN_ENCRYPTION_KEY must be 32 bytes, base64.');
  return k;
}

export function cryptoConfigured() {
  return Buffer.from(process.env.TOKEN_ENCRYPTION_KEY || '', 'base64').length === 32;
}

/** "v1.<iv>.<tag>.<ciphertext>", base64url. */
export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const body = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return ['v1', iv.toString('base64url'), c.getAuthTag().toString('base64url'), body.toString('base64url')].join('.');
}

export function decrypt(sealed: string): string {
  const [v, iv, tag, body] = sealed.split('.');
  if (v !== 'v1' || !iv || !tag || !body) throw new Error('Unknown token format.');
  const d = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
  d.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([d.update(Buffer.from(body, 'base64url')), d.final()]).toString('utf8');
}

// A separate key for signing, so a signature never doubles as anything encrypted.
const signKey = () => createHmac('sha256', key()).update('aia-sign-v1').digest();
const mac = (data: string) => createHmac('sha256', signKey()).update(data).digest('base64url');

/** A tamper-proof value that carries `data` and stops working after `ttlMs`. */
export function sign(data: Record<string, unknown>, ttlMs: number): string {
  const body = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + ttlMs })).toString('base64url');
  return body + '.' + mac(body);
}

/** The data from `sign`, or null when the value was changed or is too old. */
export function verify<T extends Record<string, unknown>>(value: string): T | null {
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  const want = Buffer.from(mac(body));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return typeof data.exp === 'number' && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export const randomId = () => randomBytes(16).toString('base64url');
