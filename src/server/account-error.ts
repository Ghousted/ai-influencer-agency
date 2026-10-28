// Errors and result shape shared by the platform readers (src/server/accounts.ts, youtube.ts, ...).
import type { AccountStats, RecentPost, TopPost } from '@/agency/types';

/** `reconnect`: the platform stopped the app's access (token expired or removed). The student must connect again. */
export type AccountErrorCode = 'bad_request' | 'not_found' | 'not_configured' | 'reconnect' | 'timeout' | 'upstream';

export class AccountError extends Error {
  constructor(public code: AccountErrorCode, message: string, public status?: number) {
    super(message);
    this.name = 'AccountError';
  }
}

export type AccountRead = {
  /** The handle as the platform spells it, with "@". */
  handle: string;
  /** The platform's own id for the account. Later reads use it, so a handle change does not lose the account. */
  ref: string;
  stats: AccountStats;
  /** Very few posts: Grow gives starter ideas. */
  few: boolean;
  /** The best posts this week, by views. */
  top: TopPost[];
  /** Every post of the last 14 days, for the charts. */
  recent: RecentPost[];
};

/** How many posts the "Top posts this week" card shows. */
const TOP_POSTS = 4;

/** This week's posts → the best ones by views (then by likes and comments), with a title from the caption. */
export function topPosts(posts: { text?: string; format: string; views: number; acts: number; url?: string }[]): TopPost[] {
  return [...posts]
    .sort((a, b) => b.views - a.views || b.acts - a.acts)
    .slice(0, TOP_POSTS)
    .map((p) => {
      const line = (p.text || '').split('\n').map((s) => s.trim()).find(Boolean) || '';
      return {
        title: line ? (line.length > 90 ? line.slice(0, 90) + '…' : line) : p.format + ' without a caption',
        format: p.format,
        views: p.views,
        eng: p.views ? Math.round((p.acts / p.views) * 1000) / 10 : 0,
        ...(p.url ? { url: p.url } : {}),
      };
    });
}

/** An account's own words, for the Profile agent: its bio and the text of its newest posts. */
export type AccountAbout = { platform: string; handle: string; bio: string; posts: string[] };

/** How many of the newest posts the Profile agent reads. */
export const ABOUT_POSTS = 15;
