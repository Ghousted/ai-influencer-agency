// Mock data and text generators, ported from the design prototype.
// The Grow, Scout, Content and Pitch agents are simulated here until the real agents exist.
import type { Account, Brand, ContentIdea, Idea, Pair, Pitch, Platform, ScheduledPost, Stats, Talent } from './types';

export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const TCOLORS: [string, string][] = [['Blue', '#006AFF'], ['Amber', '#F59E0B'], ['Pink', '#EC4899'], ['Green', '#10B981'], ['Violet', '#8B5CF6'], ['Teal', '#14B8A6'], ['Red', '#EF4444'], ['Slate', '#475569']];
export const TINTS = ['#E6F0FF', '#D6E6FF', '#EAF2FF', '#CFE0FF'];
export const HOUR = 3600000;
export const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** The order the app lists the platforms in. */
export const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'YouTube'] as const;
export const LOGO: Record<string, string> = {
  TikTok: '/assets/p-tiktok.png',
  Instagram: '/assets/p-instagram.png',
  Facebook: '/assets/p-facebook.png',
  YouTube: '/assets/p-youtube.png',
};

/**
 * Views of the posts from each of the last 7 days (ending today), per platform, and the 7 days before
 * (`prev`). Accounts read for real add up their posts (the platforms share views per post, not per day).
 * Simulated accounts get a seeded split of the talent's views.
 */
export function dailyByPlatform(t: Talent) {
  const dayOf = (ms: number) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const back = (ms: number, n: number) => { const d = new Date(ms); d.setDate(d.getDate() - n); return d.getTime(); };
  const days = Array.from({ length: 7 }, (_, i) => back(dayOf(Date.now()), 6 - i));
  const labels = days.map((d) => DOW[new Date(d).getDay()]);
  // A talent with real and simulated accounts uses the real ones only.
  const anyRead = t.accounts.some((a) => a.mode === 'live' && a.stats);
  const live = t.accounts.filter((a) => a.mode === 'live' && (!anyRead || a.stats));
  const real = anyRead;
  // Accounts read before the app kept posts have none until their next read.
  const stale = real && !live.some((a) => a.recent);
  const by: Record<string, { now: number[]; prev: number[] }> = {};
  const add = (pl: string, now: number[], prev: number[]) => {
    const b = (by[pl] = by[pl] || { now: days.map(() => 0), prev: days.map(() => 0) });
    now.forEach((v, i) => { b.now[i] += v; b.prev[i] += prev[i]; });
  };
  if (real) {
    for (const a of live) {
      const sumOn = (day: number) => (a.recent || []).filter((p) => dayOf(p.at) === day).reduce((n, p) => n + p.views, 0);
      add(a.platform, days.map(sumOn), days.map((d) => sumOn(back(d, 7))));
    }
  } else if (t.stats && live.length) {
    let seed = 0;
    for (const ch of t.id) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const split = (tot: number, k: number) => {
      const ws = Array.from({ length: k }, () => 0.6 + rnd());
      const sm = ws.reduce((a, b) => a + b, 0);
      return ws.map((w) => tot * w / sm);
    };
    const now = split(t.stats.views[0], 7), prev = split(t.stats.views[1], 7);
    const share = split(1, live.length).sort((a, b) => b - a);
    live.forEach((a, i) => add(a.platform, now.map((v) => Math.round(v * share[i])), prev.map((v) => Math.round(v * share[i]))));
  }
  const lines = PLATFORMS.filter((pl) => by[pl]).map((pl) => ({ platform: pl as Platform, ...by[pl] }));
  return { real, stale, labels, lines };
}

let _n = 100;
export const uid = (p: string) => p + (_n++) + Math.random().toString(36).slice(2, 6);
export const fmt = (n: number | null | undefined) => (n == null ? null : Math.round(n).toLocaleString('en-US'));
export const first = (t: { name: string }) => t.name.split(' ')[0];
export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
export function dstr(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const ap = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + h + ':' + String(d.getMinutes()).padStart(2, '0') + ' ' + ap;
}
export function initials(n: string) {
  return n.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}
export const ymd = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const parseYmd = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const tstr = (t: string) => {
  if (!t) return '';
  const [hh, m] = t.split(':').map(Number);
  const ap = hh >= 12 ? 'pm' : 'am';
  const h = hh % 12 || 12;
  return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
};
export const dlong = (k: string) => {
  const d = parseYmd(k);
  return DOW[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
};

type BrandSeed = Omit<Brand, 'flagged'>;
type ContentSeed = Omit<ContentIdea, 'id' | 'status' | 'flagged' | 'date'>;
type IdeaSeed = Pick<Idea, 'title' | 'why'>;

export function genBrands(t: Pick<Talent, 'name' | 'niche' | 'story'>): BrandSeed[] {
  const w = cap((t.niche.split(' ').find((x) => x.length > 3) || t.niche.split(' ')[0] || 'Local').toLowerCase());
  const f = first(t);
  const s1 = (t.story.split('.')[0] || t.story).trim();
  return [
    { id: uid('b'), name: w + ' Supply PH', what: cap(t.niche.toLowerCase()) + ' products', why: f + ' posts about ' + t.niche.toLowerCase() + ', which is what they sell.', where: 'Direct outreach: the contact form on their website' },
    { id: uid('b'), name: w + ' Hub Manila', what: 'Local shop and events', why: 'Their customers match ' + f + "'s story: " + s1.charAt(0).toLowerCase() + s1.slice(1) + '.', where: 'Creator agency that runs their ads' },
    { id: uid('b'), name: 'The ' + w + ' Collective', what: 'Online store', why: 'Their buyers follow creators like ' + f + ' for tips before they shop.', where: 'Creator marketplace: Elev8or' },
  ];
}

export function seedCalendar(talents: Talent[]) {
  const today = new Date();
  const posts: ScheduledPost[] = [];
  const plan: Record<string, [number, string, string?][]> = {
    luna: [[-6, '19:00', 'posted'], [1, '19:00'], [5, '18:00'], [12, '09:00']],
    paolo: [[-2, '20:00', 'posted'], [3, '20:00'], [8, '10:00']],
    bea: [[2, '19:00'], [9, '17:00']],
  };
  const out = talents.map((t) => {
    const content: ContentIdea[] = genContent(t).concat(moreContent(t).slice(0, 1)).map((c, i) => ({ id: uid('c'), status: 'new', flagged: false, date: Date.now() - i * 60000, ...c }));
    (plan[t.id] || []).forEach(([off, time, st]) => {
      const i = posts.filter((p) => p.talentId === t.id).length;
      const c = content[i];
      if (!c) return;
      c.status = st === 'posted' ? 'posted' : 'planned';
      posts.push({ id: uid('s'), talentId: t.id, contentId: c.id, title: c.title, platform: c.platform, date: ymd(addDays(today, off)), time, status: st === 'posted' ? 'posted' : 'scheduled' });
    });
    return { ...t, content };
  });
  return { talents: out, posts };
}

export function genContent(t: Pick<Talent, 'id' | 'name' | 'niche'>): ContentSeed[] {
  const f = first(t);
  const n = (t.niche || '').toLowerCase();
  const lib: Record<string, ContentSeed[]> = {
    luna: [
      { format: 'Short video', platform: 'TikTok', length: '45 sec', title: 'Adobo, but make it plant-based', hook: '"My lola\'s adobo — with zero meat. She could not tell."', beats: ['Show lola\'s recipe card', 'Swap pork for mushrooms and tofu, one step at a time', 'Taste test with a family member'], why: 'Her 60-second recipes average 4,100 views. Family stories fit her character story.', when: 'Thu, 7 pm' },
      { format: 'Carousel', platform: 'Instagram', length: '6 slides', title: '5 baon meals for under ₱100', hook: '"Your whole week of baon, ₱500 total."', beats: ['Cover: the 5 boxes side by side', 'One slide for each meal with its cost', 'Last slide: shopping list'], why: 'Busy young workers are her audience. Budget posts get saved more.', when: 'Sun, 6 pm' },
      { format: 'Short video', platform: 'TikTok', length: '30 sec', title: 'Oat milk taho at home', hook: '"Taho without the dairy. 3 ingredients."', beats: ['Pour the warm soy pudding', 'Make arnibal with brown sugar', 'Add sago and the oat milk'], why: 'Comfort food remakes match her niche. It can tag an oat milk brand.', when: 'Sat, 9 am' }],
    paolo: [
      { format: 'Short video', platform: 'TikTok', length: '40 sec', title: '3 serve mistakes every beginner makes', hook: '"You are losing points before the rally starts."', beats: ['Mistake 1: foot over the line', 'Mistake 2: wrist too stiff', 'Mistake 3: aiming too low, then the fix'], why: 'His "first serve" drill got 6,800 views, 3 times his usual.', when: 'Wed, 8 pm' },
      { format: 'Reel', platform: 'Instagram', length: '25 sec', title: 'New court check: BGC rooftop', hook: '"Is this the best pickleball court in Metro Manila?"', beats: ['Walk in from the street', 'Rate the surface, lights and price', 'Play one point'], why: 'Posts that tag a court get more shares in his account.', when: 'Sat, 10 am' },
      { format: 'Photo', platform: 'Instagram', length: '1 photo', title: 'My first paddle vs. my paddle now', hook: '"Year 1 vs. year 3. What changed."', beats: ['Both paddles side by side', 'Caption: 3 things to look for in a first paddle'], why: 'Beginners are his audience. It sets up a paddle brand pitch.', when: 'Tue, 12 pm' }],
    bea: [
      { format: 'Carousel', platform: 'Instagram', length: '7 slides', title: 'Church setup for ₱15,000', hook: '"A full church setup on a small budget. Here is every cost."', beats: ['Before and after', 'Flowers, cloth and lights with prices', 'Where to rent each item in Tagaytay'], why: 'Her budget posts have 7.2% engagement, her best number.', when: 'Fri, 7 pm' },
      { format: 'Short video', platform: 'Instagram', length: '30 sec', title: 'Wedding day timeline in 30 seconds', hook: '"What a 6 am to 10 pm wedding day looks like."', beats: ['Fast cuts of each hour', 'Show one tip for each part of the day'], why: 'Her account is new. Simple, useful formats help a first audience find her.', when: 'Sun, 5 pm' },
      { format: 'Photo', platform: 'Instagram', length: '1 photo', title: 'Ask Bea: your budget questions', hook: '"Send me your wedding budget. I will plan it in my next post."', beats: ['Photo of Bea with a notebook', 'Ask followers to comment their budget'], why: 'Comments help a new account. It gives her ideas for next posts.', when: 'Mon, 8 pm' }],
  };
  if (lib[t.id]) return lib[t.id];
  return [
    { format: 'Short video', platform: 'TikTok', length: '30 sec', title: 'Meet ' + f + ': 3 things about me', hook: '"Hi, I am ' + f + '. Here are 3 things you do not know about me."', beats: ['Say who you are and where you are from', 'One fact about your life in ' + (t.niche || 'your niche'), 'Ask viewers what to post next'], why: 'An intro post tells new followers who ' + f + ' is. It comes from the character story.', when: 'Thu, 7 pm' },
    { format: 'Carousel', platform: 'Instagram', length: '5 slides', title: '5 beginner tips for ' + (t.niche || 'your niche'), hook: '"Start here if you are new to ' + (n || 'this') + '."', beats: ['Cover with the 5 tips', 'One slide for each tip', 'Ask followers which tip helped'], why: 'Tip lists are easy to make and easy to save.', when: 'Sun, 6 pm' },
    { format: 'Short video', platform: 'TikTok', length: '20 sec', title: 'A day in ' + f + '\'s life', hook: '"Come with me for a day."', beats: ['Morning', 'One moment about ' + (t.niche || 'your niche'), 'Night'], why: 'Day-in-the-life videos make a character feel real.', when: 'Sat, 9 am' }];
}

export function genPrompt(t: Pick<Talent, 'name' | 'niche' | 'story'>, c: Pick<ContentIdea, 'format' | 'platform' | 'length' | 'hook' | 'beats'>) {
  const n = (t.niche || '').toLowerCase();
  const place = /cook|food|recipe/.test(n) ? 'a small, warm Filipino home kitchen' : /pickle|sport|tennis/.test(n) ? 'an outdoor pickleball court in Metro Manila' : /wedding/.test(n) ? 'a church and garden venue in Tagaytay' : 'a real-life setting that fits ' + (t.niche || 'the niche');
  const isVideo = /video|reel/i.test(c.format);
  const plat = c.platform;
  const head = 'Character: ' + t.name + '. ' + t.story + ' Keep the same face, hair and outfit as the reference image.';
  if (isVideo) {
    const secs = parseInt(c.length) || 30;
    const k = c.beats.length;
    const step = Math.round(secs / k);
    const scenes = c.beats.map((b, i) => 'Scene ' + (i + 1) + ' (' + (i * step) + '–' + (i === k - 1 ? secs : (i + 1) * step) + ' s): ' + b + '.').join('\n');
    return { kind: 'Video prompt', text: 'Vertical 9:16 video, ' + secs + ' seconds, for ' + plat + '.\n' + head + '\nSetting: ' + place + '.\nOpening line, spoken to camera: ' + c.hook + '\n' + scenes + '\nStyle: natural light, handheld phone camera, close shots, fast cuts. Add bold on-screen captions.' };
  }
  const slides = c.beats.map((b, i) => (c.format === 'Carousel' ? 'Slide ' : 'Image ') + (i + 1) + ': ' + b + '.').join('\n');
  return { kind: 'Image prompt', text: (c.format === 'Carousel' ? 'Instagram carousel, 4:5 images, ' + c.length : 'Single 4:5 photo for ' + plat) + '.\n' + head + '\nSetting: ' + place + '.\nCaption opening: ' + c.hook + '\n' + slides + '\nStyle: bright, natural light, clean background, photo-real.' };
}

export function draftFromAccounts(name: string, accs: { handle: string }[]) {
  const f = name && name.trim() ? name.trim().split(' ')[0] : 'This AI talent';
  const h = accs.map((a) => a.handle.toLowerCase()).join(' ');
  const pick: [RegExp, string, string][] = [
    [/cook|food|eat|recipe|kitchen|chef/, 'Easy home cooking', f + ' cooks simple Filipino meals at home and shares quick recipes for students and young workers on a small budget.'],
    [/pickle|ball|sport|tennis|gym|fit/, 'Sports and fitness for beginners', f + ' started a new sport as an adult and shares beginner drills, gear tips and new places to play around Metro Manila.'],
    [/wed|bride|event/, 'Weddings on a budget', f + ' plans small weddings and shares budget tips, venue ideas and setups for couples who want a simple day.'],
    [/travel|trip|tour|wander/, 'Budget travel in the Philippines', f + ' travels around the Philippines on a small budget and shares cheap trips, hidden beaches and local food spots.'],
    [/beauty|skin|makeup|glow/, 'Skincare and beauty', f + ' tests local skincare and makeup and shares honest reviews and simple routines for humid weather.']];
  const m = pick.find((p) => p[0].test(h));
  return m ? { niche: m[1], story: m[2] } : { niche: 'Daily life and lifestyle', story: f + ' is a young creator in Manila who shares daily life, small wins and simple tips that make busy days easier.' };
}

export function moreContent(t: Pick<Talent, 'name' | 'niche'>): ContentSeed[] {
  const f = first(t);
  return [
    { format: 'Short video', platform: 'TikTok', length: '30 sec', title: 'Reply to a comment with a video', hook: '"You asked, so here it is."', beats: ['Show the comment on screen', 'Answer it in one take', 'Ask for the next question'], why: 'Replies bring back the people who commented.', when: 'Tue, 8 pm' },
    { format: 'Reel', platform: 'Instagram', length: '20 sec', title: 'Collab idea: duet with a creator in ' + (t.niche || 'your niche'), hook: '"I tried ' + f + '\'s way vs. their way."', beats: ['Split screen with the other creator', 'Compare the 2 ways', 'Ask viewers to pick one'], why: 'A collab puts ' + f + ' in front of a new audience.', when: 'Fri, 6 pm' }];
}

export function starterIdeas(t: Pick<Talent, 'name' | 'stats'>): IdeaSeed[] {
  const f = first(t);
  const p = t.stats ? t.stats.posts[0] : 0;
  return [
    { title: 'Post 3 times this week', why: f + ' has ' + p + ' posts so far. More posts help me spot what works.' },
    { title: 'Pin your best post to the top', why: 'Your best post has ' + fmt(t.stats ? Math.round(t.stats.views[0] * 0.4) : 0) + ' views, more than your other posts combined.' },
    { title: 'End each caption with a question', why: 'Your post with a question got ' + Math.max(4, Math.round(p * 3)) + ' comments, your most so far.' }];
}

export function moreIdeas(t: Pick<Talent, 'name' | 'stats'>): IdeaSeed[] {
  const f = first(t);
  const v = t.stats ? t.stats.views[0] : 1000;
  return [
    { title: 'Post between 7 and 9 pm', why: f + "'s evening posts got " + fmt(v * 0.09) + ' views on average, twice the morning ones.' },
    { title: 'Make a part 2 of your top post', why: 'Your top post this week had ' + fmt(v * 0.18) + ' views, ' + Math.round(3 + (v % 3)) + ' times your usual.' },
    { title: 'Use the same opening line style for a week', why: 'Posts that start with a question kept people watching ' + (t.stats && t.stats.time ? 'longer' : 'more') + ' than the rest.' },
    { title: 'Invite a creator in your niche to a collab', why: 'Your one collab post got ' + fmt(v * 0.11) + ' views.' }];
}

/**
 * A talent's numbers from the accounts that were read for real: posts, views and watch time add up,
 * and engagement is the views-weighted average. Null when no live account has real numbers yet.
 */
export function combineStats(accounts: Account[]): Stats | null {
  const read = accounts.filter((a) => a.mode === 'live' && a.stats);
  if (!read.length) return null;
  const sum = (list: Account[], f: (a: Account) => Pair): Pair => [0, 1].map((i) => list.reduce((n, a) => n + f(a)[i], 0)) as Pair;
  const views = sum(read, (a) => a.stats!.views);
  const eng = [0, 1].map((i) => (views[i] ? Math.round((read.reduce((n, a) => n + a.stats!.eng[i] * a.stats!.views[i], 0) / views[i]) * 10) / 10 : 0)) as Pair;
  const timed = read.filter((a) => a.stats!.time);
  const untimed = Array.from(new Set(read.filter((a) => !a.stats!.time).map((a) => a.platform)));
  const at = new Date(Math.max(...read.map((a) => a.readAt || 0)) || Date.now());
  return {
    posts: sum(read, (a) => a.stats!.posts),
    views,
    eng,
    time: timed.length ? sum(timed, (a) => a.stats!.time!) : null,
    timeBy: untimed.length ? untimed.join(' and ') : undefined,
    taken: MONTHS[at.getMonth()] + ' ' + at.getDate(),
  };
}

/** The four number cards of an AI talent (this week against last week). */
export function metricCards(t: Talent) {
  const s = t.stats;
  if (!s) return [];
  const stale = t.accounts.filter((a) => a.mode === 'live').every((a) => a.status === 'lost');
  const row = (label: string, arr: [number, number] | null, kind: 'count' | 'pts' | 'pct', unit?: string) => {
    if (!arr) return { label, value: 'Not available', na: true, notNa: false, sub: (s.timeBy || 'This platform') + ' does not share it', hasDelta: false, color: '#71717a', rot: 'none', delta: '', chip: '#F4F4F5' };
    const [a, b] = arr;
    let d: string, up: boolean;
    if (kind === 'count') { const x = a - b; up = x >= 0; d = Math.abs(x) + (up ? ' more' : ' fewer') + ' than last week'; }
    else if (kind === 'pts') { const x = Math.round((a - b) * 10) / 10; up = x >= 0; d = Math.abs(x) + (up ? '% more' : '% less') + ' than last week'; }
    else if (!b) {
      // Nothing last week: a percent change has no meaning.
      if (!a) return { label, value: fmt(a) + (unit || ''), na: false, notNa: true, sub: 'None last week either', hasDelta: false, color: '#71717a', rot: 'none', delta: '', chip: '#F4F4F5' };
      up = true; d = 'None last week';
    }
    else { const x = Math.round((a - b) / b * 100); up = x >= 0; d = Math.abs(x) + (up ? '% more' : '% less') + ' than last week'; }
    return { label, value: (kind === 'pts' ? a + '%' : fmt(a) + (unit || '')), na: false, notNa: true, sub: '', hasDelta: !stale, delta: d, color: up ? '#006AFF' : '#B91C1C', rot: up ? 'none' : 'rotate(180deg)', chip: up ? '#EAF2FF' : '#FEECEC' };
  };
  return [row('Posts', s.posts, 'count'), row("Views on this week's posts", s.views, 'pct'), row('Average engagement', s.eng, 'pts'), row('Time spent watching', s.time, 'pct', ' h')];
}

/** This week's views and the change against last week, for talent rows and cards. */
export function viewsOf(t: Talent) {
  if (!t.stats) return null;
  const [a, b] = t.stats.views;
  // No views last week: show "New" (or nothing when both weeks are 0), not Infinity% or NaN%.
  if (!b) return { views: fmt(a), delta: a ? 'New' : '', up: true, color: a ? '#006AFF' : '#71717a', rot: 'none', arrow: a ? 'block' : 'none' };
  const x = Math.round((a - b) / b * 100);
  return { views: fmt(a), delta: Math.abs(x) + '%', up: x >= 0, color: x >= 0 ? '#006AFF' : '#B91C1C', rot: x >= 0 ? 'none' : 'rotate(180deg)', arrow: 'block' };
}

export function pitchText(t: Talent, b: Pick<Brand, 'name' | 'why' | 'what'>, user: string, agency: string) {
  const f = first(t);
  const s = t.stats && t.accounts.some((a) => a.mode === 'live') ? t.stats : null;
  // The platforms share views per post, so these are the views of the posts from the last 7 days.
  const nums = s ? f + "'s " + s.posts[0] + (s.posts[0] === 1 ? ' post' : ' posts') + ' from the last 7 days have ' + fmt(s.views[0]) + ' views so far, with ' + s.eng[0] + '% average engagement.\n\n' : '';
  const pitch = 'Hi ' + b.name + ' team,\n\nI run ' + t.name + ', an AI talent who posts about ' + t.niche.toLowerCase() + '. ' + b.why + '\n\n' + nums + 'I would love to talk about a sponsored post that shows ' + b.what.toLowerCase() + ' to ' + f + "'s audience.\n\nCould we set up a short call this week?\n\nThanks,\n" + user + '\n' + agency;
  const profile = t.name + ' is an AI talent. ' + t.story + ' ' + f + ' posts about ' + t.niche.toLowerCase() + '.' + (s ? ' Posts from the last 7 days: ' + fmt(s.views[0]) + ' views, ' + s.eng[0] + '% average engagement.' : '');
  return { pitch, profile };
}

export function demoData(user: string, agency: string): { talents: Talent[]; pitches: Pitch[] } {
  const now = Date.now();
  const mk = (list: IdeaSeed[], offset: number): Idea[] => list.map((x, i) => ({ id: uid('i'), status: 'new', flagged: false, date: now - (offset + i) * HOUR, ...x }));
  const mb = (list: Omit<Brand, 'id' | 'flagged'>[]): Brand[] => list.map((x) => ({ id: uid('b'), flagged: false, ...x }));
  const acc = (a: Account) => a;
  const talents: Talent[] = [
    { id: 'luna', color: '#006AFF', name: 'Luna Reyes', niche: 'Plant-based home cooking', story: 'Luna grew up in Cebu cooking with her lola. She turns Filipino classics into quick plant-based meals for busy young workers.', tint: TINTS[0], pic: '/assets/hero-1.jpeg', few: false, growLoaded: false, scoutLoaded: false,
      accounts: [acc({ id: 'a1', platform: 'TikTok', handle: '@luna.cooks', mode: 'live', status: 'ok', updated: 12 }), acc({ id: 'a2', platform: 'Facebook', handle: '@lunacooksph', mode: 'handle', status: 'ok' })],
      stats: { posts: [24, 20], views: [48200, 43000], eng: [5.8, 6.2], time: [312, 286], taken: 'Oct 18' },
      ideas: mk([{ title: 'Post another 60-second recipe this week', why: 'Your 60-second recipes average 4,100 views. Longer ones average 1,300.' }, { title: 'Tag an oat milk brand in your next latte recipe', why: 'Your oat latte post got 312 comments, your most ever.' }, { title: 'Invite a fitness creator to cook with Luna', why: 'Your 3 collab posts got 2.3 times your usual views.' }, { title: 'Reply to comments in the first hour', why: 'Posts where you replied within an hour got 38% more comments.' }], 2),
      brands: mb([{ name: 'Green Pantry Co.', what: 'Plant-based meal kits', why: 'Luna cooks quick plant-based meals, and they sell plant-based meal kits.', where: 'Direct outreach: their partnerships email' }, { name: 'Oat Lane', what: 'Oat milk', why: "Luna's oat latte post is her most commented post.", where: 'Creator marketplace: Elev8or' }, { name: "Lola's Kitchen Co.", what: 'Filipino sauces and spices', why: "Luna's story is about cooking with her lola in Cebu.", where: 'Creator agency that runs their ads' }]) },
    { id: 'paolo', color: '#F59E0B', name: 'Paolo Dink', niche: 'Pickleball', story: 'Paolo is a Manila office worker who found pickleball at 30. He shares beginner drills and new courts around Metro Manila.', tint: TINTS[1], pic: '/assets/hero-2.jpeg', few: false, growLoaded: false, scoutLoaded: false,
      accounts: [acc({ id: 'a3', platform: 'TikTok', handle: '@paolodinks', mode: 'live', status: 'ok', updated: 34 }), acc({ id: 'a4', platform: 'Instagram', handle: '@paolo.dink', mode: 'live', status: 'ok', updated: 34 })],
      stats: { posts: [11, 9], views: [21900, 18600], eng: [4.4, 4.1], time: null, timeBy: 'Instagram', taken: 'Oct 20' },
      ideas: mk([{ title: 'Film a 3-drill series for beginners', why: 'Your "first serve" drill got 6,800 views, 3 times your usual.' }, { title: 'Tag the court in every post', why: 'Posts that tagged a court got 52% more shares.' }, { title: 'Invite a pickleball coach to a doubles game', why: 'Your one collab post got 4,900 views.' }], 8),
      brands: mb([{ name: 'Smash PH Paddles', what: 'Pickleball paddles', why: 'Paolo teaches beginners, and every beginner needs a first paddle.', where: 'Direct outreach: their Instagram messages' }, { name: 'Courtside Hydrate', what: 'Sports drinks', why: "Paolo's drills are filmed outdoors in Manila heat.", where: 'Creator marketplace: TikTok One, once Paolo has 1,000 followers' }, { name: 'Rally Club Manila', what: 'Pickleball courts', why: 'Paolo already films at their courts.', where: 'Direct outreach: the club manager' }]) },
    { id: 'bea', color: '#EC4899', name: 'Bea Altar', niche: 'Weddings', story: 'Bea is a wedding planner from Tagaytay who shares budget tips and church setups for couples on a small budget.', tint: TINTS[2], pic: '/assets/hero-4.jpeg', few: true, growLoaded: false, scoutLoaded: false,
      accounts: [acc({ id: 'a5', platform: 'Instagram', handle: '@bea.altar', mode: 'live', status: 'lost', updated: 2880 })],
      stats: { posts: [3, 1], views: [9400, 9800], eng: [7.2, 6.6], time: [61, 64], taken: 'Oct 18' },
      ideas: mk([{ title: 'Post 3 times this week', why: 'Bea has 3 posts so far. More posts help me spot what works.' }, { title: 'Pin your best post to the top', why: '"Church setup tour" has 2,100 views, 3 times your other posts.' }, { title: 'Answer one couple question each week', why: 'Your Q&A post got 41 saves, the most of your 3 posts.' }], 14),
      brands: mb([{ name: 'Tagaytay Flower Farm', what: 'Wedding flowers', why: "Bea's church setups always show the flowers up close.", where: 'Direct outreach: the farm owner on Facebook' }, { name: 'Simple Vows Studio', what: 'Wedding photos and video', why: 'Bea talks to couples on a small budget, their main buyers.', where: 'Creator agency that runs their ads' }, { name: 'Barong Atelier', what: 'Formal wear', why: "Bea's budget tips often cover what to wear.", where: 'Creator marketplace: Elev8or' }]) },
  ];
  const P = (tid: string, bi: number, status: Pitch['status'], h: number): Pitch => {
    const tt = talents.find((x) => x.id === tid)!;
    const b = tt.brands[bi];
    return { id: uid('p'), talentId: tid, brandId: b.id, brandName: b.name, status, flagged: false, date: now - h * HOUR, ...pitchText(tt, b, user, agency) };
  };
  return { talents, pitches: [P('luna', 0, 'sent', 3), P('paolo', 0, 'approved', 20), P('luna', 1, 'draft', 26)] };
}

/**
 * Signed in, a talent's numbers come only from accounts read for real. Accounts that an older version
 * connected with made-up numbers become "added by handle", and their made-up numbers go.
 */
export function realOnly(t: Talent): Talent {
  const fake = t.accounts.some((a) => a.mode === 'live' && !a.stats);
  const stats = combineStats(t.accounts);
  if (!fake && JSON.stringify(stats) === JSON.stringify(t.stats ?? null)) return t;
  const accounts = fake ? t.accounts.map((a) => (a.mode === 'live' && !a.stats ? { ...a, mode: 'handle' as const, status: 'ok' as const } : a)) : t.accounts;
  return { ...t, accounts, stats };
}
