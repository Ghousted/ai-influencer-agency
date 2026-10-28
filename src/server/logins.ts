// The platforms that connect through a login page, by their URL slug (/api/connect/<slug>/...). Server only.
import type { Platform } from '@/agency/types';
import { connectFacebook, facebookAuthorizeUrl, facebookConfigured } from './facebook';
import { connectInstagram, instagramAuthorizeUrl, instagramConfigured } from './instagram';
import { connectTiktok, tiktokAuthorizeUrl, tiktokConfigured } from './tiktok';

export type Login = {
  platform: Platform;
  configured: () => boolean;
  /** The platform's login page for this round trip. */
  authorizeUrl: (state: string) => string;
  /** Turn the callback's code into saved tokens. Returns the connected accounts' refs. */
  connect: (userId: string, code: string) => Promise<string[]>;
  /** The secret that signs Meta's deauthorize and data deletion callbacks. TikTok has none. */
  secret: () => string | undefined;
};

const LOGINS: Record<string, Login> = {
  instagram: {
    platform: 'Instagram', configured: instagramConfigured, authorizeUrl: instagramAuthorizeUrl, connect: connectInstagram,
    secret: () => process.env.INSTAGRAM_APP_SECRET,
  },
  facebook: {
    platform: 'Facebook', configured: facebookConfigured, authorizeUrl: facebookAuthorizeUrl, connect: connectFacebook,
    secret: () => process.env.FACEBOOK_APP_SECRET,
  },
  tiktok: {
    platform: 'TikTok', configured: tiktokConfigured, authorizeUrl: tiktokAuthorizeUrl, connect: connectTiktok,
    secret: () => undefined,
  },
};

export const loginFor = (slug: string): Login | null => LOGINS[slug] ?? null;

/** Ties a login round trip to the browser that started it. One cookie per platform. */
export const nonceCookie = (slug: string) => `aia_${slug}_nonce`;
