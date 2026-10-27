/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangeEvent } from 'react';
import type { AgencyApp } from '../AgencyApp';
import type { ContentIdea, ScheduledPost, Talent } from '../types';
import { DOW, LOGO, MONTHS_LONG, PLATFORMS, addDays, dlong, first, genPrompt, tstr, ymd } from '../logic';

/** Most post chips shown in one calendar day cell. */
const MAX_CHIPS = 3;

const logoBg = (pl: string) => (LOGO[pl] ? 'url(' + LOGO[pl] + ')' : 'none');
const picBg = (t: Talent | undefined) => (t && t.pic ? 'url(' + t.pic + ')' : 'none');
const byTime = (a: ScheduledPost, b: ScheduledPost) => (a.time || '').localeCompare(b.time || '');

/** Content calendar: month grid, talent filters and the selected day's posts. */
export function calendarView(app: AgencyApp) {
  const s = app.state;
  const now = new Date();
  const todayK = ymd(now);
  const mo = s.calMonth || { y: now.getFullYear(), m: now.getMonth() };
  const sel = s.calSel || todayK;
  const tal = (id: string) => s.talents.find((t) => t.id === id);
  const filter = s.calFilter && tal(s.calFilter) ? s.calFilter : null;
  const posts = s.posts.filter((p) => (!filter || p.talentId === filter) && tal(p.talentId));

  const byDay: Record<string, ScheduledPost[]> = {};
  posts.forEach((p) => { (byDay[p.date] = byDay[p.date] || []).push(p); });
  Object.values(byDay).forEach((a) => a.sort(byTime));

  const setMonth = (y: number, m: number) => {
    const d = new Date(y, m, 1);
    app.setState({ calMonth: { y: d.getFullYear(), m: d.getMonth() } });
  };

  // Weeks start on Sunday, to match DOW.
  const firstDay = new Date(mo.y, mo.m, 1);
  const lastDay = new Date(mo.y, mo.m + 1, 0);
  let cur = addDays(firstDay, -firstDay.getDay());
  const weeks: any[] = [];
  while (cur <= lastDay) {
    const days: any[] = [];
    for (let i = 0; i < 7; i++) {
      const d = cur;
      const k = ymd(d);
      const inMonth = d.getMonth() === mo.m;
      const isToday = k === todayK;
      const isSel = k === sel;
      const list = byDay[k] || [];
      days.push({
        day: String(d.getDate()),
        cellBg: isSel ? '#F5F9FF' : inMonth ? '#fff' : '#FAFAFB',
        ring: isSel ? 'inset 0 0 0 2px #006AFF' : 'none',
        numBg: isToday ? '#006AFF' : 'transparent',
        numColor: isToday ? '#fff' : inMonth ? '#18181b' : '#A1A1AA',
        select: () => app.setState({ calSel: k, calMonth: { y: d.getFullYear(), m: d.getMonth() } }),
        posts: list.slice(0, MAX_CHIPS).map((p) => {
          const t = tal(p.talentId);
          const done = p.status === 'posted';
          return {
            title: p.title,
            color: (t && t.color) || '#006AFF',
            picBg: picBg(t),
            bg: ((t && t.color) || '#006AFF') + '1A',
            op: done ? '.55' : '1',
            deco: done ? 'line-through' : 'none',
          };
        }),
        hasMore: list.length > MAX_CHIPS,
        more: '+' + (list.length - MAX_CHIPS) + ' more',
      });
      cur = addDays(cur, 1);
    }
    weeks.push({ days });
  }

  const dayPosts = (byDay[sel] || []).map((p) => {
    const t = tal(p.talentId)!;
    const c: ContentIdea | undefined = p.contentId ? (t.content || []).find((x) => x.id === p.contentId) : undefined;
    const pr = c ? genPrompt(t, c) : null;
    const sched = p.status === 'scheduled';
    return {
      title: p.title,
      talent: t.name,
      color: t.color || '#006AFF',
      picBg: picBg(t),
      platform: p.platform,
      logoBg: logoBg(p.platform),
      time: tstr(p.time),
      statusText: sched ? 'Planned' : 'Posted',
      statusBg: sched ? '#EAF2FF' : '#F4F4F5',
      statusFg: sched ? '#006AFF' : '#52525b',
      hasContent: !!c,
      noContent: !c,
      format: c ? c.format + ' · ' + c.length : '',
      hook: c ? c.hook : '',
      promptKind: pr ? pr.kind : '',
      prompt: pr ? pr.text : '',
      copy: () => { if (c) app.copyPrompt(t, c); },
      isSched: sched,
      posted: () => app.setPost(p.id, { status: 'posted' }, 'Marked as posted.'),
      edit: () => app.openSchedule({ postId: p.id }),
      remove: () => app.setPost(p.id, null, 'Removed from the calendar.'),
      openTalent: () => app.openTalent(t.id, 'content'),
    };
  });

  const filters = [
    { id: null as string | null, label: 'All', hasPic: false, picBg: 'none', ring: '#E4E4E7' },
    ...s.talents.map((t) => ({ id: t.id as string | null, label: first(t), hasPic: true, picBg: picBg(t), ring: t.color || '#006AFF' })),
  ].map((f) => {
    const on = f.id === filter;
    return {
      ...f,
      bg: on ? '#006AFF' : '#fff',
      fg: on ? '#fff' : '#18181b',
      go: () => app.setState({ calFilter: f.id }),
    };
  });

  const cal = {
    title: MONTHS_LONG[mo.m] + ' ' + mo.y,
    dow: DOW,
    weeks,
    prev: () => setMonth(mo.y, mo.m - 1),
    next: () => setMonth(mo.y, mo.m + 1),
    today: () => app.setState({ calMonth: { y: now.getFullYear(), m: now.getMonth() }, calSel: todayK }),
    selTitle: (sel === todayK ? 'Today, ' : '') + dlong(sel),
    noDay: dayPosts.length === 0,
    dayPosts,
    filters,
    add: () => app.openSchedule({ date: sel }),
  };
  return { cal };
}

const REASONS = ['Not a fit for this talent', 'Already did this', 'Not now', 'This looks wrong'];

/** All modal and side-panel overlays, driven by app.state.ov. */
export function overlaysView(app: AgencyApp) {
  const s = app.state;
  const o: any = s.ov;
  const kind: string | null = o ? o.kind : null;
  const setOv = (patch: Record<string, any>) => app.setState((st) => (st.ov ? { ov: { ...st.ov, ...patch } } : null));
  const close = () => app.setState({ ov: null });
  const tal = (id: string | null | undefined) => s.talents.find((t) => t.id === id);

  const ovl: any = {
    show: !!o,
    close,
    isConnect: kind === 'connect',
    isDismiss: kind === 'dismiss',
    isFlag: kind === 'flag',
    isDelete: kind === 'delete',
    isDelAcct: kind === 'delAcct',
    isSchedule: kind === 'schedule',
    c: {}, dm: {}, f: {}, d: {}, sc: {}, da: {},
    delAcct: () => {},
  };
  if (!o) return { ovl };

  if (kind === 'connect') {
    const t = tal(o.tid);
    const j = app.jv('connect');
    const re = !!o.reId;
    const handle: string = o.handle || '';
    const addHandle = () => {
      let h = handle.trim();
      if (!h) return;
      if (!re) { app.addByHandle(); return; }
      // Reconnect failed: keep the account, but read it by handle only.
      if (h[0] !== '@') h = '@' + h;
      app.clearJob('connect');
      app.upd(o.tid, (x) => {
        const accounts = x.accounts.map((a) => (a.id === o.reId ? { ...a, handle: h, mode: 'handle' as const, status: 'ok' as const, updated: undefined } : a));
        return { ...x, accounts, stats: accounts.some((a) => a.mode === 'live') ? x.stats : null };
      });
      app.setState({ ov: null });
      app.toast(o.platform + ' added by handle.');
    };
    ovl.c = {
      title: re ? 'Reconnect ' + o.platform : 'Connect an account',
      talent: t ? t.name : '',
      platform: o.platform,
      notRe: !re,
      idle: !j.loading && !j.bad,
      loading: j.loading,
      long: j.long,
      bad: j.bad,
      platforms: PLATFORMS.map((pl) => {
        const on = pl === o.platform;
        return { label: pl, bg: on ? '#EAF2FF' : '#F4F4F5', color: on ? '#006AFF' : '#3f3f46', go: () => setOv({ platform: pl }) };
      }),
      connect: () => app.connectNow(),
      handle,
      onHandle: (e: ChangeEvent<HTMLInputElement>) => setOv({ handle: e.target.value }),
      handleOff: handle.trim() ? '1' : '.5',
      addHandle,
    };
  }

  if (kind === 'dismiss') {
    const reason: string = o.reason || '';
    ovl.dm = {
      label: o.label,
      reasons: REASONS.map((label) => {
        const on = label === reason;
        return {
          label,
          bd: on ? '#006AFF' : '#E4E4E7',
          bg: on ? '#EAF2FF' : '#fff',
          fg: on ? '#006AFF' : '#18181b',
          go: () => setOv({ reason: on ? '' : label }),
        };
      }),
      isWrong: reason === 'This looks wrong',
      note: o.note || '',
      onNote: (e: ChangeEvent<HTMLTextAreaElement>) => setOv({ note: e.target.value }),
      submit: () => app.submitDismiss(),
    };
  }

  if (kind === 'flag') {
    ovl.f = {
      label: o.label,
      note: o.note || '',
      onNote: (e: ChangeEvent<HTMLTextAreaElement>) => setOv({ note: e.target.value }),
      submit: () => app.submitFlag(),
    };
  }

  if (kind === 'delete') {
    const t = tal(o.tid);
    ovl.d = {
      name: t ? t.name : 'this AI talent',
      first: t ? first(t) : 'This AI talent',
      confirm: () => (t ? app.deleteTalent() : close()),
    };
  }

  if (kind === 'delAcct') {
    const t = tal(o.tid);
    const a = t && o.aid ? t.accounts.find((x) => x.id === o.aid) : undefined;
    if (o.aid) {
      // Disconnect one social account of a talent.
      ovl.da = {
        title: 'Disconnect ' + (a ? a.platform : 'this account') + '?',
        body: (a ? a.platform + ' ' + a.handle : 'This account') + ' will be removed from ' + (t ? t.name : 'this AI talent') + '. The app stops reading its numbers.',
        btn: 'Disconnect',
      };
      ovl.delAcct = () => (t && a ? app.disconnectAccount(t.id, a.id) : close());
    } else {
      // Delete the user's own account and all its data.
      ovl.da = {
        title: 'Delete your account?',
        body: 'Your agency, AI talents, connected accounts, ideas, pitches and history will be deleted. This cannot be undone.',
        btn: 'Delete account',
      };
      ovl.delAcct = () => {
        // deleteAccount shows the result: "Your account was deleted." or why it failed.
        app.setState({ ov: null });
        app.deleteAccount();
      };
    }
  }

  if (kind === 'schedule') {
    const t = tal(o.tid);
    const editing = !!o.postId;
    const pickTalent = (x: Talent) => {
      if (x.id === o.tid) return;
      setOv({ tid: x.id, cid: '', platform: (x.accounts[0] && x.accounts[0].platform) || o.platform || 'TikTok' });
    };
    const content = t ? (t.content || []).filter((c) => c.status === 'new' || c.status === 'planned' || c.id === o.cid) : [];
    const title: string = o.title || '';
    const ok = !!(o.tid && title.trim() && o.date);
    ovl.sc = {
      title: editing ? 'Edit post' : 'Plan a post',
      talents: s.talents.map((x) => {
        const on = x.id === o.tid;
        return {
          name: x.name,
          color: x.color || '#006AFF',
          picBg: picBg(x),
          bg: on ? '#EAF2FF' : '#fff',
          ring: on ? '0 0 0 2px #006AFF' : '0 0 0 1px #E4E4E7',
          go: () => pickTalent(x),
        };
      }),
      cid: o.cid || '',
      ideas: [{ v: '', label: content.length ? 'No content idea' : 'No open content ideas' }].concat(
        content.map((c) => ({ v: c.id, label: c.title + ' · ' + c.platform })),
      ),
      onIdea: (e: ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        const c = content.find((x) => x.id === v);
        setOv(c ? { cid: c.id, title: c.title, platform: c.platform } : { cid: '' });
      },
      titleV: title,
      onTitle: (e: ChangeEvent<HTMLInputElement>) => setOv({ title: e.target.value }),
      plats: PLATFORMS.map((pl) => {
        const on = pl === o.platform;
        return { label: pl, bd: on ? '#006AFF' : '#E4E4E7', bg: on ? '#EAF2FF' : '#fff', fg: on ? '#006AFF' : '#18181b', go: () => setOv({ platform: pl }) };
      }),
      date: o.date || '',
      onDate: (e: ChangeEvent<HTMLInputElement>) => setOv({ date: e.target.value }),
      time: o.time || '',
      onTime: (e: ChangeEvent<HTMLInputElement>) => setOv({ time: e.target.value }),
      canSave: ok,
      cannotSave: !ok,
      save: () => app.saveSchedule(),
      saveLabel: editing ? 'Save changes' : 'Plan',
    };
  }

  return { ovl };
}

