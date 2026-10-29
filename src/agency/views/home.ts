/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AgencyApp } from '../AgencyApp';
import type { Talent } from '../types';
import { PLATFORMS, agencyStats, dailyByPlatform, first, fmt, initials } from '../logic';

const DAY_LONG: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

/** Chart space: same as AgencyApp.analytics() (svg viewBox 0 0 600 200). */
const X = (d: number) => 4 + d * (592 / 6);
const pctX = (d: number) => (X(d) / 600 * 100).toFixed(2) + '%';

/** Smooth path through points, same curve as AgencyApp.analytics(). */
function smooth(pts: number[][]) {
  return pts.map((p, i) => {
    if (!i) return 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    const q = pts[i - 1];
    const cx = (q[0] + p[0]) / 2;
    return 'C' + cx.toFixed(1) + ' ' + q[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
  }).join(' ');
}

/** Rounded top of the y axis, same rule as AgencyApp.analytics(). */
function niceTop(peak: number) {
  if (peak <= 0) return 10;
  const step = Math.pow(10, Math.floor(Math.log10(peak)));
  let top = Math.ceil(peak / step) * step;
  if (top / peak > 1.6) top = Math.ceil(peak / (step / 2)) * (step / 2);
  return top;
}

/** ", updated 3 days ago" when the oldest real read of the talent is more than a day old. */
function age(t: Talent) {
  const reads = t.accounts.filter((a) => a.mode === 'live' && a.readAt).map((a) => a.readAt!);
  if (!reads.length) return '';
  const d = Math.floor((Date.now() - Math.min(...reads)) / 86400000);
  return d >= 1 ? ' · updated ' + d + (d === 1 ? ' day' : ' days') + ' ago' : '';
}

/** Home: the overview of all AI talents. */
export function homeView(app: AgencyApp) {
  const s = app.state;
  const hj = app.jv('home');
  const T = s.talents;
  const withStats = T.filter((t) => t.stats);
  const st = (t: Talent) => t.stats!;
  // An account linked to two AI talents counts once; engagement is weighted by views.
  const ag = agencyStats(T);
  const sum = (k: 'posts' | 'views' | 'time', i: 0 | 1) => (ag && ag[k] ? ag[k]![i] : 0);
  const engAvg = ag ? ag.eng[0] : 0;
  const engPrev = ag ? ag.eng[1] : 0;
  const vNow = sum('views', 0), vPrev = sum('views', 1);
  // A talent's watch time can leave out some of its platforms (timeBy), or all of them (no time).
  const noTime = (t: Talent) => !st(t).time || !!st(t).timeBy;
  const timeMissing = withStats.some(noTime);
  const timeAny = withStats.some((t) => st(t).time);
  const picBg = (t: Talent) => (t.pic ? 'url(' + t.pic + ')' : 'none');
  const colorOf = (t: Talent) => t.color || '#006AFF';

  // Open ideas: Growth and Content in turn per talent, then one talent after the other.
  const openIdeas: any[] = [];
  T.forEach((t) => {
    const base = { talent: t.name, color: colorOf(t), picBg: picBg(t) };
    const g = t.ideas.filter((i) => i.status === 'new').map((i) => ({ ...base, title: i.title, kind: 'Growth', open: () => app.openTalent(t.id, 'grow') }));
    const c = (t.content || []).filter((i) => i.status === 'new').map((i) => ({ ...base, title: i.title, kind: 'Content', open: () => app.openTalent(t.id, 'content') }));
    const n = Math.max(g.length, c.length);
    for (let k = 0; k < n; k++) {
      if (g[k]) openIdeas.push(g[k]);
      if (c[k]) openIdeas.push(c[k]);
    }
  });
  {
    const byT: Record<string, any[]> = {};
    openIdeas.forEach((x) => (byT[x.talent] = byT[x.talent] || []).push(x));
    openIdeas.length = 0;
    const lists = Object.values(byT);
    for (let k = 0; lists.some((l) => l[k]); k++) lists.forEach((l) => l[k] && openIdeas.push(l[k]));
  }

  // Pitches
  const pc: Record<'draft' | 'approved' | 'sent', number> = { draft: 0, approved: 0, sent: 0 };
  s.pitches.forEach((p) => { if (p.status in pc) pc[p.status as keyof typeof pc]++; });
  const readyP = s.pitches.filter((p) => p.status === 'approved').map((p) => {
    const t = app.T(p.talentId);
    return { text: 'Pitch to ' + p.brandName + ' is approved', sub: (t ? t.name : '') + ' · ready to copy', open: () => app.go('pitch', { pitchId: p.id }) };
  });
  const draftP = s.pitches.filter((p) => p.status === 'draft').map((p) => {
    const t = app.T(p.talentId);
    return { text: 'Pitch to ' + p.brandName + ' is a draft', sub: (t ? t.name : '') + ' · read and approve it', open: () => app.go('pitch', { pitchId: p.id }) };
  });
  const pitched = new Set(s.pitches.map((p) => p.brandId));
  const brandCount = T.reduce((a, t) => a + t.brands.filter((b) => !pitched.has(b.id)).length, 0);
  const brandTalents = T.filter((t) => t.brands.some((b) => !pitched.has(b.id)));
  const flagCount = T.reduce((a, t) => a + t.ideas.filter((i) => i.flagged).length + (t.content || []).filter((c) => c.flagged).length + t.brands.filter((b) => b.flagged).length, 0)
    + s.pitches.filter((p) => p.flagged).length;

  const alerts: any[] = [];
  T.forEach((t) => {
    t.accounts.forEach((a) => { if (a.status === 'lost') alerts.push({ text: first(t) + "'s " + a.platform + ' needs Reconnect', open: () => app.openTalent(t.id, 'accounts') }); });
    if (!t.accounts.length) alerts.push({ text: first(t) + ' has no account yet', open: () => app.openTalent(t.id, 'accounts') });
  });

  // Totals (this week against last week)
  const mk = (label: string, a: number, b: number, val: string, prevTxt: string, pts?: boolean) => {
    const m = Math.max(a, b) || 1;
    const p = b ? (pts ? Math.round((a - b) * 10) / 10 : Math.round((a - b) / b * 100)) : 0;
    const up = p >= 0;
    return {
      label, value: val, pct: (up ? '+' : '−') + Math.abs(p) + (pts ? ' pts' : '%'), hasPct: !!b,
      rot: up ? 'none' : 'rotate(180deg)', chipBg: up ? '#EAF2FF' : '#FEECEC', chipFg: up ? '#006AFF' : '#B91C1C',
      nowW: (a / m * 100).toFixed(1) + '%', prevW: (b / m * 100).toFixed(1) + '%', prev: 'Last week: ' + prevTxt,
    };
  };
  const tNow = sum('time', 0), tPrev = sum('time', 1);
  const timeCard = timeAny
    ? mk('Time spent watching' + (timeMissing ? ' *' : ''), tNow, tPrev, fmt(tNow) + ' h', fmt(tPrev) + ' h')
    : { ...mk('Time spent watching', 0, 0, 'Not available', 'not available'), hasPct: false, prev: 'These platforms do not share it' };
  const totals = [
    mk("Views on this week's posts", vNow, vPrev, fmt(vNow)!, fmt(vPrev)!),
    mk('Posts', sum('posts', 0), sum('posts', 1), fmt(sum('posts', 0))!, fmt(sum('posts', 1))!),
    mk('Average engagement', engAvg, engPrev, engAvg + '%', engPrev + '%', true),
    timeCard,
  ];
  const missingBy = Array.from(new Set(withStats.filter(noTime).map((t) => st(t).timeBy || t.accounts.find((a) => a.mode === 'live')?.platform || 'One platform')));
  const missingWho = withStats.filter(noTime).map((t) => first(t));
  const timeNote = '* Time spent watching leaves out ' + missingWho.join(', ') + '. ' + missingBy.join(' and ') + (missingBy.length === 1 ? ' does' : ' do') + ' not share it.';

  // Views each day: one line per AI talent, for all platforms or the one picked in the dropdown.
  const hidden = s.homeHidden || {};
  const daily = withStats.map((t) => ({ t, d: dailyByPlatform(t) }));
  const labels = daily[0]?.d.labels || [];
  const platOpts = PLATFORMS.filter((pl) => daily.some((x) => x.d.lines.some((l) => l.platform === pl)));
  const plat = s.homePlat && (platOpts as readonly string[]).includes(s.homePlat) ? s.homePlat : '';
  const series = daily.map(({ t, d }) => ({
    t, on: !hidden[t.id],
    days: labels.map((_, i) => d.lines.filter((l) => !plat || l.platform === plat).reduce((n, l) => n + l.now[i], 0)),
  }));
  const shown = series.filter((x) => x.on);
  const peak = Math.max(0, ...shown.flatMap((x) => x.days));
  const top = niceTop(peak);
  const Y = (v: number) => 200 - v / top * 196;
  const hovIdx = s.homeHover != null && s.homeHover >= 0 && s.homeHover < 7 && shown.length ? s.homeHover : null;
  const lines = shown.map(({ t, days }) => {
    const d = smooth(days.map((v, i) => [X(i), Y(v)]));
    return {
      color: colorOf(t), d,
      area: d + ' L' + X(6).toFixed(1) + ' 200 L' + X(0).toFixed(1) + ' 200 Z',
      pts: hovIdx == null ? [] : [{ x: pctX(hovIdx), y: (Y(days[hovIdx]) / 200 * 100).toFixed(2) + '%', sz: '12px', fill: '#fff' }],
    };
  });
  const toggle = (id: string) => app.setState((st0) => ({ homeHidden: { ...(st0.homeHidden || {}), [id]: !(st0.homeHidden || {})[id] } }));
  const legend = series.map(({ t, on }) => ({
    name: first(t), picBg: picBg(t), on,
    ring: on ? colorOf(t) : '#D4D4D8',
    bg: on ? '#fff' : '#F4F4F5',
    bd: on ? '#E4E4E7' : 'transparent',
    fg: on ? '#18181b' : '#A1A1AA',
    filter: on ? 'none' : 'grayscale(1) opacity(.6)',
    tip: (on ? 'Hide ' : 'Show ') + first(t) + "'s line",
    toggle: () => toggle(t.id),
  }));
  // Hover columns: each column covers the half way to the next day.
  const half = (592 / 6) / 2;
  const cols = labels.map((_, i) => ({
    flex: String(i === 0 || i === 6 ? 4 + half : 2 * half),
    enter: () => { if (app.state.homeHover !== i) app.setState({ homeHover: i }); },
    // Keyboard and screen readers: each day column is focusable and says its total.
    label: DAY_LONG[labels[i]] + ': ' + fmt(shown.reduce((a, x) => a + x.days[i], 0)) + ' views',
  }));
  const hov = hovIdx == null
    ? { on: false, x: '0%', tx: 'none', day: '', rows: [], total: '' }
    : {
      on: true,
      x: pctX(hovIdx),
      tx: hovIdx < 4 ? 'translateX(12px)' : 'translateX(calc(-100% - 12px))',
      day: DAY_LONG[labels[hovIdx]] + (plat ? ' · ' + plat : ''),
      rows: shown.map(({ t, days }) => ({ name: t.name, color: colorOf(t), picBg: picBg(t), v: fmt(days[hovIdx])!, n: days[hovIdx] })).sort((a, b) => b.n - a.n),
      total: fmt(shown.reduce((a, x) => a + x.days[hovIdx], 0)) + ' views',
    };
  const days = labels.map((label, i) => ({ label, x: pctX(i), labelColor: i === hovIdx ? '#18181b' : '#71717a' }));
  const real = daily.some((x) => x.d.real);
  const platPick = {
    has: platOpts.length > 1, value: plat,
    opts: [{ v: '', label: 'All platforms' }, ...platOpts.map((pl) => ({ v: pl, label: pl }))],
    change: (e: { target: { value: string } }) => app.setState({ homePlat: e.target.value }),
  };

  // Engagement by AI talent: this week bar and last week bar
  const engMax = Math.max(0, ...withStats.flatMap((t) => st(t).eng)) || 1;
  const eng = withStats.map((t) => ({
    first: first(t), color: colorOf(t), picBg: picBg(t),
    value: st(t).eng[0] + '%',
    h: (st(t).eng[0] / engMax * 85).toFixed(1) + '%',
    ph: (st(t).eng[1] / engMax * 85).toFixed(1) + '%',
    tip: t.name + ': ' + st(t).eng[0] + '% this week, ' + st(t).eng[1] + '% last week',
    tap: () => app.toast(t.name + ': ' + st(t).eng[0] + '% engagement this week, ' + st(t).eng[1] + '% last week.'),
  }));

  // AI talent rows
  // All talents are shown (an agency has few), so none is hidden behind "See all".
  const rows = T.map((t) => {
    const v = app.viewsOf(t);
    const ts = t.stats;
    const numbers = ts
      ? [
        fmt(ts.posts[0]) + (ts.posts[0] === 1 ? ' post' : ' posts'),
        ts.eng[0] + '% engagement',
        ts.time ? fmt(ts.time[0]) + ' h watched' : 'Time watched: Not available',
      ]
      : [];
    return {
      hasNumbers: numbers.length > 0, numbers: numbers.join(' · '),
      name: t.name, tint: t.tint, hasPic: !!t.pic, noPic: !t.pic, picBg: picBg(t), initials: initials(t.name),
      views: v ? v.views + " views on this week's posts" + age(t) : t.accounts.length ? 'No numbers yet' : 'No account yet',
      hasV: !!v, delta: v ? v.delta : '', color: v ? v.color : '#71717a', rot: v ? v.rot : 'none', arrow: v ? v.arrow : 'none',
      open: () => app.openTalent(t.id),
    };
  });

  const nIdeas = openIdeas.length;
  const totalP = pc.draft + pc.approved + pc.sent;

  const home = {
    loading: hj.loading, long: hj.long, bad: hj.bad,
    retry: () => app.retryHome(),
    empty: !hj.loading && !hj.bad && !T.length,
    ready: !hj.loading && !hj.bad && T.length > 0,
    count: T.length + ' AI talent' + (T.length === 1 ? '' : 's'),
    hasStats: withStats.length > 0,
    totals,
    hasTimeNote: withStats.length > 0 && timeMissing && timeAny,
    timeNote,

    legend, lines, ticks: [fmt(top), fmt(Math.round(top / 2)), '0'], days, cols, hov,
    noLines: withStats.length > 0 && !shown.length,
    platPick,
    chartTitle: real ? 'Views by the day posted' : 'Views each day',
    hovOff: () => { if (app.state.homeHover != null) app.setState({ homeHover: null }); },
    eng,

    rows, alerts,
    seeAll: () => app.go('talents'),
    add: () => app.openForm('new'),

    ideas: openIdeas.slice(0, 5),
    ideasCount: nIdeas ? (nIdeas > 5 ? '5 of ' + nIdeas : nIdeas + (nIdeas === 1 ? ' idea' : ' ideas')) : '',
    noIdeas: !nIdeas,
    noIdeasText: T.some((t) => t.accounts.some((a) => a.mode === 'live'))
      ? 'No open ideas. New ideas show here when the agents write them.'
      : 'Connect an account. Then ideas to grow each AI talent show here.',

    pc,
    hasPitches: totalP > 0,
    pipe: ([['draft', '#CFE0FF'], ['approved', '#4F8BFF'], ['sent', '#006AFF']] as const)
      .filter(([k]) => pc[k] > 0).map(([k, color]) => ({ n: String(pc[k]), color })),
    todo: readyP.concat(draftP).slice(0, 4),
    hasBrands: brandCount > 0,
    brandText: brandCount + (brandCount === 1 ? ' brand' : ' brands') + ' to pitch',
    brandSub: 'Scout found ' + (brandCount === 1 ? 'it' : 'them') + ' for ' + brandTalents.map((t) => first(t)).join(', '),
    goScout: () => { if (brandTalents[0]) app.openTalent(brandTalents[0].id, 'scout'); },
    hasFlags: flagCount > 0,
    flagText: flagCount + (flagCount === 1 ? ' item is' : ' items are') + ' flagged',
    goFlagged: () => app.go('history', { histTab: 'flagged' }),
  };

  return { home };
}
