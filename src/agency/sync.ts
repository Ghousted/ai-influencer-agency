// Saves talents, pitches and posts to Supabase. The app replaces an object whenever something in it
// changes, so comparing references finds exactly the rows to write.
import { supabase } from './supabase';
import type { Pitch, ScheduledPost, Talent } from './types';

export type CloudData = { talents: Talent[]; pitches: Pitch[]; posts: ScheduledPost[] };

type Snapshot = CloudData & { draft: unknown };

export async function loadData(): Promise<CloudData | null> {
  const sb = supabase();
  if (!sb) return null;
  const [t, p, s] = await Promise.all([
    sb.from('talents').select('data').order('created_at').order('position'),
    sb.from('pitches').select('data').order('created_at', { ascending: false }),
    sb.from('posts').select('data'),
  ]);
  if (t.error || p.error || s.error) return null;
  return {
    talents: t.data.map((r) => r.data as Talent),
    pitches: p.data.map((r) => r.data as Pitch),
    posts: s.data.map((r) => r.data as ScheduledPost),
  };
}

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));

export class Syncer {
  private saved: { talents: Map<string, Talent>; pitches: Map<string, Pitch>; posts: Map<string, ScheduledPost>; draft: string };
  private pending: Snapshot | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private failures = 0;
  private stopped = false;
  private running: Promise<unknown> = Promise.resolve();

  constructor(start: CloudData & { draft?: unknown }, private notify: (message: string) => void, private onSaved?: () => void) {
    this.saved = { talents: byId(start.talents), pitches: byId(start.pitches), posts: byId(start.posts), draft: JSON.stringify(start.draft ?? null) };
  }

  /** Changes that are not in the database yet (waiting, or a save that failed). */
  get dirty() { return !!this.pending; }

  /** Save soon. Many quick changes become one write. */
  schedule(next: Snapshot) {
    if (this.stopped) return;
    this.pending = next;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 600);
  }

  /** Save now, after any save already running. Resolves true when everything is saved. */
  flush(): Promise<boolean> {
    clearTimeout(this.timer);
    clearTimeout(this.retryTimer);
    const next = this.pending;
    this.pending = null;
    if (next) this.running = this.running.then(() => this.push(next)).catch(() => {});
    return this.running.then(() => !this.pending);
  }

  /** Stop saving: drop what is waiting (account deleted, or the agency loads again). */
  stop() {
    this.stopped = true;
    this.pending = null;
    clearTimeout(this.timer);
    clearTimeout(this.retryTimer);
  }

  private async push(next: Snapshot) {
    const sb = supabase();
    if (!sb) return;
    const s = this.saved;
    const changed = <T extends { id: string }>(list: T[], prev: Map<string, T>) => list.filter((x) => prev.get(x.id) !== x);
    const removed = <T extends { id: string }>(list: T[], prev: Map<string, T>) => {
      const ids = new Set(list.map((x) => x.id));
      return [...prev.keys()].filter((id) => !ids.has(id));
    };

    // position only breaks ties between talents created in the same write (created_at sorts the rest).
    const talentRows = changed(next.talents, s.talents).map((t) => ({ id: t.id, position: next.talents.indexOf(t), data: t }));
    const pitchRows = changed(next.pitches, s.pitches).map((p) => ({ id: p.id, talent_id: p.talentId, data: p }));
    const postRows = changed(next.posts, s.posts).map((p) => ({ id: p.id, talent_id: p.talentId, data: p }));
    const goneTalents = removed(next.talents, s.talents);
    const gonePitches = removed(next.pitches, s.pitches);
    const gonePosts = removed(next.posts, s.posts);
    const draft = JSON.stringify(next.draft ?? null);

    try {
      // Talents first: pitches and posts point at them.
      if (talentRows.length) await must(sb.from('talents').upsert(talentRows));
      if (pitchRows.length) await must(sb.from('pitches').upsert(pitchRows));
      if (postRows.length) await must(sb.from('posts').upsert(postRows));
      if (gonePosts.length) await must(sb.from('posts').delete().in('id', gonePosts));
      if (gonePitches.length) await must(sb.from('pitches').delete().in('id', gonePitches));
      // Deleting a talent also deletes its pitches and posts (on delete cascade).
      if (goneTalents.length) await must(sb.from('talents').delete().in('id', goneTalents));
      if (draft !== s.draft) {
        const { data } = await sb.auth.getUser();
        if (data.user) await must(sb.from('agencies').update({ draft: next.draft ?? null }).eq('user_id', data.user.id));
      }
      this.saved = { talents: byId(next.talents), pitches: byId(next.pitches), posts: byId(next.posts), draft };
    } catch {
      if (this.stopped) return;
      // Keep the old snapshot and try again later: 5 s, 10 s, 20 s … up to 1 minute.
      if (!this.pending) this.pending = next;
      this.failures++;
      if (this.failures === 1) this.notify('The app could not save your last change. It will keep trying.');
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => this.flush(), Math.min(60000, 5000 * 2 ** (this.failures - 1)));
      return;
    }
    if (this.failures) this.notify('Your changes are saved.');
    this.failures = 0;
    this.onSaved?.();
  }
}

async function must(q: PromiseLike<{ error: unknown }>) {
  const { error } = await q;
  if (error) throw error;
}
