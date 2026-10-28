export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook';

export type Account = {
  id: string;
  platform: Platform;
  handle: string;
  /** live: numbers are read from the platform. handle: added by handle only, no numbers. */
  mode: 'live' | 'handle';
  status: 'ok' | 'lost';
  /** Minutes since the numbers were last read (simulated accounts). */
  updated?: number;
  /** The platform's own id for the account, e.g. a YouTube channel id. Set once it is read for real. */
  ref?: string;
  /** When the numbers were last read for real (ms). */
  readAt?: number;
  /** This account's own numbers from its last real read. The talent's stats add these up. */
  stats?: AccountStats;
  /** This account's best posts this week, from its last real read. */
  top?: TopPost[];
  /** This account's posts of the last 14 days, from its last real read. The charts use them. */
  recent?: RecentPost[];
};

/** A post of the last 14 days: when it went up (ms) and its numbers. 0 when the platform does not share one. */
export type RecentPost = { at: number; views: number; likes: number; comments: number; shares: number; saves: number };

/** A post from the last 7 days, as the platform reports it. */
export type TopPost = { title: string; format: string; views: number; eng: number; url?: string };

/** [this week, last week] */
export type Pair = [number, number];

export type Stats = {
  posts: Pair;
  views: Pair;
  eng: Pair;
  /** Hours spent watching. null when the platform does not share it. */
  time: Pair | null;
  timeBy?: string;
  taken: string;
};

/** One account's numbers, as the server reads them. */
export type AccountStats = Pick<Stats, 'posts' | 'views' | 'eng' | 'time'>;

export type ItemStatus = 'new' | 'done' | 'dismissed';

type Flaggable = {
  flagged: boolean;
  flagNote?: string;
  flagDate?: number;
};

export type Idea = Flaggable & {
  id: string;
  title: string;
  why: string;
  status: ItemStatus;
  date: number;
  dismissReason?: string;
  dismissNote?: string;
};

export type ContentIdea = Flaggable & {
  id: string;
  format: string;
  platform: Platform | string;
  length: string;
  title: string;
  hook: string;
  beats: string[];
  why: string;
  when: string;
  status: 'new' | 'planned' | 'posted' | 'dismissed';
  date: number;
  dismissReason?: string;
  dismissNote?: string;
};

export type Brand = Flaggable & {
  id: string;
  name: string;
  what: string;
  why: string;
  where: string;
};

export type Talent = {
  id: string;
  name: string;
  niche: string;
  story: string;
  pic: string | null;
  color: string;
  tint: string;
  accounts: Account[];
  stats: Stats | null;
  ideas: Idea[];
  brands: Brand[];
  content?: ContentIdea[];
  /** Brand new account with very few posts: Grow gives starter ideas. */
  few: boolean;
  growLoaded: boolean;
  scoutLoaded: boolean;
  contentLoaded?: boolean;
};

export type PitchStatus = 'writing' | 'draft' | 'approved' | 'sent';

export type Pitch = Flaggable & {
  id: string;
  talentId: string;
  brandId: string;
  brandName: string;
  status: PitchStatus;
  date: number;
  pitch: string;
  profile: string;
};

export type ScheduledPost = {
  id: string;
  talentId: string;
  contentId: string | null;
  title: string;
  platform: string;
  /** yyyy-mm-dd */
  date: string;
  /** HH:mm */
  time: string;
  status: 'scheduled' | 'posted';
};

export type Route =
  | 'start' | 'signup' | 'login' | 'home' | 'talents' | 'form' | 'talent'
  | 'pitch' | 'history' | 'account' | 'calendar';

export type TalentTab = 'overview' | 'accounts' | 'grow' | 'content' | 'scout';

export type JobPhase = 'idle' | 'loading' | 'done' | 'failed' | 'stalled';
export type Job = { phase: JobPhase; long?: boolean };

export type Simulate = 'normal' | 'slow' | 'fails' | 'stalls';
