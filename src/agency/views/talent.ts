import { createRef, type RefObject } from 'react';
import type { AgencyApp } from '../AgencyApp';
import { LOGO, PLATFORMS, dlong, first, genPrompt, parseYmd, tstr } from '../logic';
import type { Account, ContentIdea, PitchStatus, Talent, TalentTab } from '../types';

const TABS: [string, TalentTab][] = [['Overview', 'overview'], ['Accounts', 'accounts'], ['Grow', 'grow'], ['Content', 'content'], ['Scout', 'scout']];
const PITCH_LABEL: Record<PitchStatus, string> = { writing: 'Writing', draft: 'Draft', approved: 'Approved', sent: 'Sent' };
const logoBg = (p: string) => (LOGO[p] ? 'url(' + LOGO[p] + ')' : 'none');
const noop = () => {};

/** One stable ref per app instance for the content ideas rail. */
const rails = new WeakMap<AgencyApp, RefObject<HTMLDivElement | null>>();
function railRef(app: AgencyApp) {
  let r = rails.get(app);
  if (!r) { r = createRef<HTMLDivElement>(); rails.set(app, r); }
  return r;
}

function ago(min: number) {
  if (min < 1) return 'Updated just now';
  if (min < 60) return 'Updated ' + min + ' minute' + (min === 1 ? '' : 's') + ' ago';
  const h = Math.round(min / 60);
  if (h < 24) return 'Updated ' + h + ' hour' + (h === 1 ? '' : 's') + ' ago';
  const d = Math.round(h / 24);
  return 'Updated ' + d + ' day' + (d === 1 ? '' : 's') + ' ago';
}

/** Safe, empty view model for when no talent is open. */
function emptyCur() {
  const job = { loading: false, long: false, bad: false, stalled: false, empty: false, ready: false, retry: noop, more: noop };
  return {
    tint: 'transparent', hasPic: false, noPic: true, picBg: 'none', initials: '', name: '', niche: '', first: '', color: '#006AFF',
    colorOpen: false, toggleColor: noop, swatches: [], cp: { hex: '#006AFF', hexVal: '', cFill: '#fff', cRing: 'none', onPick: noop, onHex: noop, onHexBlur: noop },
    edit: noop, del: noop, connect: noop, tabs: [],
    isOverview: false, isAccounts: false, isGrow: false, isContent: false, isScout: false,
    noAccounts: false, lost: false, lostText: '', reconnectLost: noop, handleOnly: false, hasMetrics: false, hasAccounts: false,
    metrics: [], an: {}, platRows: [],
    grow: { ...job, needsAccount: false, few: false, fewText: '', ideas: [] },
    content: { ...job, noAccount: false, items: [], railRef: undefined },
    scout: { ...job, brands: [] },
  };
}

function accountRows(app: AgencyApp, t: Talent) {
  const taken = t.stats ? t.stats.taken : '';
  const accRow = (a: Account) => {
    const lost = a.mode === 'live' && a.status === 'lost';
    const busy = app.jv('refresh-' + a.id).loading;
    const sub = a.mode === 'handle' ? 'Numbers not available. Added by handle.'
      : lost ? 'Connection lost. Last good numbers from ' + (taken || 'the last read') + '.'
        : busy ? 'Reading the numbers…' : ago(a.readAt ? Math.floor((Date.now() - a.readAt) / 60000) : a.updated || 0);
    return {
      handle: a.handle, sub, subColor: lost ? '#B91C1C' : '#71717a',
      canRefresh: a.mode === 'live' && !lost && !busy,
      canReconnect: lost,
      refresh: () => app.refreshAccount(t.id, a.id),
      reconnect: () => app.openConnect(t.id, a.id),
      disconnect: () => app.setState({ ov: { kind: 'delAcct', tid: t.id, aid: a.id, platform: a.platform, handle: a.handle } }),
    };
  };
  return PLATFORMS.map((p) => {
    const list = t.accounts.filter((a) => a.platform === p);
    const on = list.length > 0;
    const anyLost = list.some((a) => a.mode === 'live' && a.status === 'lost');
    const allHandle = on && list.every((a) => a.mode === 'handle');
    const badge = anyLost ? ['Reconnect needed', '#FEECEC', '#B91C1C'] : allHandle ? ['Added by handle', '#F4F4F5', '#52525b'] : ['Connected', '#EAF2FF', '#006AFF'];
    return {
      name: p,
      sub: on ? list.length + ' account' + (list.length === 1 ? '' : 's') : 'Not connected',
      logoBg: logoBg(p), filter: on ? 'none' : 'grayscale(1) opacity(.55)',
      noLogo: !LOGO[p], ytBg: '#FF0033',
      isOn: on, isOff: !on, badge: badge[0], badgeBg: badge[1], badgeFg: badge[2],
      connect: () => app.openConnect(t.id, null, p),
      accs: list.map(accRow),
    };
  });
}

function growView(app: AgencyApp, t: Talent, f: string, hasLive: boolean) {
  const j = app.jv('grow-' + t.id);
  const shown = t.ideas.filter((i) => i.status !== 'dismissed');
  const ordered = shown.filter((i) => i.status === 'new').concat(shown.filter((i) => i.status === 'done'));
  const idle = hasLive && !j.loading && !j.bad;
  const ready = idle && ordered.length > 0;
  return {
    needsAccount: !hasLive,
    loading: hasLive && j.loading, long: hasLive && j.long, bad: hasLive && j.bad, stalled: hasLive && j.stalled,
    retry: () => app.moreIdeas(t.id),
    more: () => app.moreIdeas(t.id),
    empty: idle && ordered.length === 0,
    ready,
    few: ready && t.few,
    fewText: f + "'s account is new. These are starter ideas. After more posts, the ideas will use more numbers.",
    ideas: ordered.map((i) => ({
      title: i.title, why: i.why,
      isNew: i.status === 'new', isDone: i.status === 'done',
      flagged: !!i.flagged,
      op: i.status === 'done' ? 0.65 : 1,
      done: () => app.setIdea(t.id, i.id, 'done'),
      dismiss: () => app.openDismiss('idea', t.id, i.id, i.title),
      flag: () => app.openFlag('idea', t.id, i.id, i.title),
    })),
  };
}

function contentView(app: AgencyApp, t: Talent, hasLive: boolean) {
  const s = app.state;
  const j = app.jv('content-' + t.id);
  const rank: Record<string, number> = { new: 0, planned: 1, posted: 2 };
  const list = (t.content || []).filter((c) => c.status !== 'dismissed').map((c, i) => ({ c, i }))
    .sort((a, b) => (rank[a.c.status] - rank[b.c.status]) || (a.i - b.i)).map((x) => x.c);
  const item = (c: ContentIdea) => {
    const mine = s.posts.filter((p) => p.contentId === c.id);
    const post = mine.find((p) => p.status === 'scheduled') || mine[0] || null;
    const pr = genPrompt(t, c);
    const schedText = post ? (post.status === 'posted' ? 'Posted on ' : 'Planned for ') + dlong(post.date) + ', ' + tstr(post.time) : '';
    return {
      format: c.format, platform: c.platform, length: c.length, title: c.title, hook: c.hook, beats: c.beats, why: ' ' + c.why, when: c.when,
      logoBg: logoBg(String(c.platform)),
      prompt: pr.text, promptKind: pr.kind,
      isNew: c.status === 'new', isPlanned: c.status === 'planned', isPosted: c.status === 'posted',
      op: c.status === 'posted' ? 0.7 : 1,
      flagged: !!c.flagged,
      hasSched: !!post, schedText,
      seeCal: () => {
        if (!post) return;
        const d = parseYmd(post.date);
        app.go('calendar', { calSel: post.date, calMonth: { y: d.getFullYear(), m: d.getMonth() } });
      },
      plan: () => app.openSchedule({ tid: t.id, cid: c.id }),
      posted: () => {
        const open = mine.find((p) => p.status === 'scheduled');
        if (open) app.setPost(open.id, { status: 'posted' }, 'Marked as posted.');
        else app.setContent(t.id, c.id, 'posted');
      },
      dismiss: () => app.openDismiss('content', t.id, c.id, c.title),
      flag: () => app.openFlag('content', t.id, c.id, c.title),
      copyPrompt: () => app.copyPrompt(t, c),
      copyBrief: () => app.copyBrief(c),
    };
  };
  const idle = !j.loading && !j.bad;
  return {
    loading: j.loading, long: j.long, bad: j.bad, stalled: j.stalled,
    retry: () => app.moreContentIdeas(t.id),
    more: () => app.moreContentIdeas(t.id),
    empty: idle && list.length === 0,
    ready: idle && list.length > 0,
    noAccount: !hasLive,
    items: list.map(item),
    railRef: railRef(app),
  };
}

function scoutView(app: AgencyApp, t: Talent) {
  const j = app.jv('scout-' + t.id);
  const idle = !j.loading && !j.bad;
  return {
    loading: j.loading, long: j.long, bad: j.bad, stalled: j.stalled,
    // ensure() does nothing once Scout has loaded, so Try again runs the job and fills an empty list.
    retry: () => app.scoutBrands(t.id),
    empty: idle && t.brands.length === 0,
    ready: idle && t.brands.length > 0,
    brands: t.brands.map((b) => {
      const p = app.state.pitches.find((x) => x.talentId === t.id && x.brandId === b.id);
      return {
        name: b.name, what: b.what, why: ' ' + b.why, where: ' ' + b.where,
        initial: (b.name.replace(/^The /, '').trim()[0] || '?').toUpperCase(),
        hasStatus: !!p, status: p ? PITCH_LABEL[p.status] : '',
        label: p ? 'Open pitch' : 'Write pitch',
        flagged: !!b.flagged, notFlagged: !b.flagged,
        flag: () => app.openFlag('brand', t.id, b.id, b.name),
        draft: () => app.draftPitch(t.id, b.id),
      };
    }),
  };
}

/** The single talent page: header, tabs and each tab's content. */
export function talentView(app: AgencyApp) {
  const s = app.state;
  const t = s.route === 'talent' ? app.T(s.talentId) : undefined;
  if (!t) return { cur: emptyCur() };

  const f = first(t);
  const tab = s.tab;
  const live = t.accounts.filter((a) => a.mode === 'live');
  const hasLive = live.length > 0;
  const lostAcc = live.find((a) => a.status === 'lost');
  const color = t.color || '#006AFF';
  const pickColor = (hex: string) => app.upd(t.id, (x) => ({ ...x, color: hex }));

  const cur = {
    ...app.pic(t),
    name: t.name, niche: t.niche, first: f, color,
    colorOpen: !!s.colorOpen,
    toggleColor: () => app.setState((st) => ({ colorOpen: !st.colorOpen, hexDraft: null })),
    swatches: app.swatches(color, pickColor),
    cp: app.picker(color, pickColor, 'talent-' + t.id),
    edit: () => { app.setState({ colorOpen: false }); app.openForm('edit', t.id); },
    del: () => app.setState({ ov: { kind: 'delete', tid: t.id }, colorOpen: false }),
    connect: () => app.openConnect(t.id),

    tabs: TABS.map(([label, k]) => ({
      label,
      go: () => { if (s.colorOpen) app.setState({ colorOpen: false }); app.setTab(k); },
      color: tab === k ? '#18181b' : '#71717a',
      line: tab === k ? '#006AFF' : 'transparent',
    })),
    isOverview: tab === 'overview', isAccounts: tab === 'accounts', isGrow: tab === 'grow', isContent: tab === 'content', isScout: tab === 'scout',

    // Overview
    noAccounts: t.accounts.length === 0,
    hasAccounts: t.accounts.length > 0,
    lost: !!lostAcc,
    lostText: lostAcc ? lostAcc.platform + ' ' + lostAcc.handle + ' lost its connection. These are the last good numbers' + (t.stats ? ' from ' + t.stats.taken : '') + '.' : '',
    reconnectLost: () => { if (lostAcc) app.openConnect(t.id, lostAcc.id); },
    handleOnly: t.accounts.length > 0 && !hasLive,
    hasMetrics: hasLive && !!t.stats,
    metrics: hasLive ? app.metricCards(t) : [],
    an: hasLive && t.stats ? app.analytics(t) : {},

    platRows: accountRows(app, t),
    grow: growView(app, t, f, hasLive),
    content: contentView(app, t, hasLive),
    scout: scoutView(app, t),
  };
  return { cur };
}
