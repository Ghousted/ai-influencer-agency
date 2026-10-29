// One engagement rule for every platform, so the talent's combined percent adds like with like.

/** A post's views and its interactions: likes (or reactions), comments, shares and saves, as the platform shares them. */
export type Engaged = { views: number; likes: number; comments: number; shares?: number; saves?: number };

/**
 * Engagement in percent, one decimal: all interactions divided by all views. A post with no view count
 * (its insights failed) is left out of both, so its likes do not push the percent up.
 */
export function engagement(posts: Engaged[]): number {
  const seen = posts.filter((p) => p.views > 0);
  const views = seen.reduce((n, p) => n + p.views, 0);
  const acts = seen.reduce((n, p) => n + p.likes + p.comments + (p.shares || 0) + (p.saves || 0), 0);
  return views ? Math.round((acts / views) * 1000) / 10 : 0;
}
