/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangeEvent } from 'react';
import type { AgencyApp } from '../AgencyApp';
import { LOGO, dstr, first } from '../logic';
import type { Pitch, Talent } from '../types';

type Inp = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const tabStyle = (on: boolean) => ({ color: on ? '#18181b' : '#71717a', line: on ? '#006AFF' : 'transparent' });

// ---- Pitch (PRD feature 7) -------------------------------------------------------

/** Pitch page: write, edit, approve, copy, mark as sent. */
export function pitchView(app: AgencyApp) {
  const s = app.state;
  const p = s.pitches.find((x) => x.id === s.pitchId);
  const t = p ? app.T(p.talentId) : undefined;
  if (!p || !t) {
    return { pitch: { none: true, exists: false, goTalents: () => app.go('talents') } };
  }
  const b = t.brands.find((x) => x.id === p.brandId);
  const j = app.jv('pitch-' + p.id);
  const writing = p.status === 'writing';
  // A pitch that is still "writing" with no live job (for example after a reload) cannot finish by itself.
  const orphan = writing && !j.loading && !j.bad;
  const loading = writing && j.loading;
  const bad = writing && (j.bad || orphan);
  const ready = !writing;
  const isDraft = p.status === 'draft';
  const isApproved = p.status === 'approved';
  const isSent = p.status === 'sent';
  const canCopy = isApproved || isSent;
  const cur = (): Pitch | undefined => app.state.pitches.find((x) => x.id === p.id);

  return {
    pitch: {
      none: false, exists: true,
      goTalents: () => app.go('talents'),
      back: () => { app.setState({ editedAfterApprove: false }); app.openTalent(t.id, 'scout'); },
      first: first(t), talent: t.name, brand: p.brandName,
      where: b ? b.where : '',
      loading, long: loading && j.long, bad,
      retry: () => app.writePitch(p.id),
      ready,
      flagged: !!p.flagged, notFlagged: !p.flagged,
      flag: () => app.openFlag('pitch', t.id, p.id, 'Pitch to ' + p.brandName),
      text: p.pitch, profile: p.profile,
      onText: (e: Inp) => app.editPitch(p.id, 'pitch', e.target.value),
      onProfile: (e: Inp) => app.editPitch(p.id, 'profile', e.target.value),
      noNumbers: !t.accounts.some((a) => a.mode === 'live'),
      isDraft, isApproved, isSent, canCopy,
      reapprove: isDraft && s.editedAfterApprove,
      approve: () => {
        app.updPitch(p.id, { status: 'approved', date: Date.now() });
        app.setState({ editedAfterApprove: false });
        app.toast('Approved. Now you can copy the pitch.');
      },
      copy: () => { const c = cur(); if (c && (c.status === 'approved' || c.status === 'sent')) app.copyPitch(c); },
      markSent: () => {
        app.updPitch(p.id, { status: 'sent', date: Date.now() });
        app.toast('Marked as sent. You can find it in History.');
      },
    },
  };
}

// ---- History (PRD feature 8) -------------------------------------------------------

type Row = {
  title: string; type: string; status: string; statusColor: string; date: number; dateText: string;
  talent: string; tColor: string; picBg: string; hasNote: boolean; noteText: string; flagged: boolean; open: () => void;
};

const ST: Record<string, [string, string]> = {
  new: ['New', '#006AFF'],
  done: ['Done', '#18181b'],
  planned: ['Planned', '#006AFF'],
  posted: ['Posted', '#18181b'],
  dismissed: ['Dismissed', '#71717a'],
  writing: ['Writing', '#71717a'],
  draft: ['Draft', '#52525b'],
  approved: ['Approved', '#006AFF'],
  sent: ['Sent', '#18181b'],
};

function noteOf(x: { dismissReason?: string; dismissNote?: string; flagged?: boolean; flagNote?: string }) {
  const parts: string[] = [];
  if (x.dismissReason) parts.push('Dismissed: ' + x.dismissReason + (x.dismissNote ? '. ' + x.dismissNote : ''));
  if (x.flagged && x.flagNote && x.flagNote !== x.dismissNote) parts.push('Flag note: ' + x.flagNote);
  else if (x.flagged && !x.dismissReason) parts.push('Flagged');
  return parts.join(' · ');
}

function historyRows(app: AgencyApp): Row[] {
  const s = app.state;
  const rows: Row[] = [];
  const base = (t: Talent) => ({ talent: t.name, tColor: t.color || '#006AFF', picBg: app.pic(t).picBg });
  const mk = (t: Talent, title: string, type: string, status: string, date: number, x: any, open: () => void): Row => {
    const [label, color] = ST[status] || [status, '#52525b'];
    const note = noteOf(x);
    return { ...base(t), title, type, status: label, statusColor: color, date, dateText: dstr(date), hasNote: !!note, noteText: note, flagged: !!x.flagged, open };
  };
  s.talents.forEach((t) => {
    t.ideas.forEach((i) => rows.push(mk(t, i.title, 'Idea', i.status, i.date, i, () => app.openTalent(t.id, 'grow'))));
    (t.content || []).forEach((c) => rows.push(mk(t, c.title, 'Content idea', c.status, c.date, c, () => app.openTalent(t.id, 'content'))));
    t.brands.filter((b) => b.flagged).forEach((b) => {
      const d = b.flagDate || Date.now();
      rows.push({ ...base(t), title: b.name, type: 'Brand idea', status: 'Flagged', statusColor: '#B91C1C', date: d, dateText: dstr(d), hasNote: !!b.flagNote, noteText: b.flagNote ? 'Flag note: ' + b.flagNote : '', flagged: true, open: () => app.openTalent(t.id, 'scout') });
    });
  });
  s.pitches.forEach((p) => {
    const t = app.T(p.talentId);
    if (!t) return;
    rows.push(mk(t, 'Pitch to ' + p.brandName, 'Pitch', p.status, p.date, p, () => app.go('pitch', { pitchId: p.id })));
  });
  return rows.sort((a, b) => b.date - a.date);
}

/** History page: every idea, content idea, flagged brand and pitch, with status and date. */
export function historyView(app: AgencyApp) {
  const s = app.state;
  const all = historyRows(app);
  const flaggedRows = all.filter((h) => h.flagged);
  const cur = s.histTab === 'flagged' ? 'flagged' : 'all';
  const rows = cur === 'flagged' ? flaggedRows : all;
  const tabs = ([['All', 'all'], ['Flagged', 'flagged']] as const).map(([label, k]) => ({
    label: k === 'flagged' && flaggedRows.length ? label + ' (' + flaggedRows.length + ')' : label,
    go: () => app.setState({ histTab: k }),
    ...tabStyle(cur === k),
  }));
  return {
    hist: {
      tabs, rows,
      has: rows.length > 0,
      empty: rows.length === 0,
      emptyText: cur === 'flagged'
        ? 'There are no flagged items. When you select "This looks wrong" on an item, it shows here.'
        : 'There is nothing here yet. Ideas, content ideas and pitches show here with their status and date.',
    },
  };
}

// ---- Account ------------------------------------------------------------------------

const NOTIFS: { k: string; label: string; sub: string; def: boolean }[] = [
  { k: 'ideas', label: 'New ideas', sub: 'Tell me when the app has new ideas for an AI talent.', def: true },
  { k: 'lost', label: 'Account problems', sub: 'Tell me when a connected account stops sharing numbers.', def: true },
  { k: 'weekly', label: 'Weekly summary', sub: 'Send me a short summary every Monday.', def: false },
];

/** Account page: profile, agency name, password, connected accounts, notifications, delete. */
export function accountView(app: AgencyApp) {
  const s = app.state;
  const ui = s.ui;
  const nameV: string = ui.acctName ?? s.user.name;
  const emailV: string = ui.acctEmail ?? s.user.email;
  const notifOn: Record<string, boolean> = ui.notifs || {};

  const accs = s.talents.flatMap((t) => t.accounts.map((a) => {
    const lost = a.status === 'lost';
    const byHandle = a.mode === 'handle';
    return {
      handle: a.handle,
      sub: a.platform + ' · ' + t.name,
      logoBg: LOGO[a.platform] ? 'url(' + LOGO[a.platform] + ')' : 'none',
      status: lost ? 'Reconnect' : byHandle ? 'Handle only' : 'Connected',
      stBg: lost ? '#FEECEC' : byHandle ? '#F4F4F5' : '#EAF2FF',
      stFg: lost ? '#B91C1C' : byHandle ? '#52525b' : '#006AFF',
      color: t.color || '#006AFF',
      picBg: app.pic(t).picBg,
      open: () => app.openTalent(t.id, 'accounts'),
    };
  }));

  const openIdeas = s.talents.reduce((n, t) => n + t.ideas.filter((i) => i.status === 'new').length + (t.content || []).filter((c) => c.status === 'new').length, 0);
  const stats = [
    { v: String(s.talents.length), l: s.talents.length === 1 ? 'AI talent' : 'AI talents' },
    { v: String(accs.length), l: accs.length === 1 ? 'Connected account' : 'Connected accounts' },
    { v: String(openIdeas), l: openIdeas === 1 ? 'Open idea' : 'Open ideas' },
    { v: String(s.pitches.length), l: s.pitches.length === 1 ? 'Pitch' : 'Pitches' },
  ];

  const pwErrText: string = ui.pwErr || '';

  // Each Account action runs once at a time; its button says "Saving…" while it runs.
  const busy: Record<string, boolean> = ui.acctBusy || {};
  const once = (k: string, run: () => Promise<unknown> | undefined) => {
    if (busy[k]) return;
    const p = run();
    if (!p) return;
    app.setUi({ acctBusy: { ...(app.state.ui.acctBusy || {}), [k]: true } });
    p.finally(() => app.setUi({ acctBusy: { ...(app.state.ui.acctBusy || {}), [k]: false } }));
  };
  const label = (k: string, idle: string) => (busy[k] ? 'Saving…' : idle);

  return {
    acct: {
      name: s.user.name,
      profileLabel: label('profile', 'Save'), renameLabel: label('rename', 'Rename'), pwLabel: label('pw', 'Change password'),
      profileBusy: !!busy.profile, renameBusy: !!busy.rename, pwBusy: !!busy.pw,
      nameV, emailV,
      onName: (e: Inp) => app.setUi({ acctName: e.target.value }),
      onEmail: (e: Inp) => app.setUi({ acctEmail: e.target.value }),
      saveProfile: () => {
        const name = nameV.trim(), email = emailV.trim();
        if (!name || !email) { app.toast('Please fill in your name and email.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { app.toast('Please type a correct email.'); return; }
        once('profile', () => app.saveProfile(name, email).then((ok) => { if (ok) app.setUi({ acctName: undefined, acctEmail: undefined }); }));
      },

      val: ui.renameOn ? s.renameVal : s.agencyName,
      onVal: (e: Inp) => { app.setState({ renameVal: e.target.value }); app.setUi({ renameOn: true }); },
      save: () => {
        const v = (ui.renameOn ? s.renameVal : s.agencyName).trim();
        if (!v) { app.toast('Please type a name for your agency.'); return; }
        once('rename', () => app.renameAgency(v).then((ok) => { if (ok) app.setUi({ renameOn: false }); }));
      },

      pw0: ui.pw0 || '', pw1: ui.pw1 || '',
      onPw0: (e: Inp) => app.setUi({ pw0: e.target.value, pwErr: '' }),
      onPw1: (e: Inp) => app.setUi({ pw1: e.target.value, pwErr: '' }),
      pwErr: !!pwErrText, pwErrText,
      savePw: () => {
        const a: string = ui.pw0 || '', b: string = ui.pw1 || '';
        if (!a.trim()) { app.setUi({ pwErr: 'Please type your current password.' }); return; }
        if (b.length < 8) { app.setUi({ pwErr: 'Your new password must have 8 characters or more.' }); return; }
        if (a === b) { app.setUi({ pwErr: 'Your new password must be different.' }); return; }
        once('pw', () => app.changePassword(a, b).then((err) => app.setUi(err ? { pwErr: err } : { pw0: '', pw1: '', pwErr: '' })));
      },

      accs,
      accCount: accs.length + (accs.length === 1 ? ' account' : ' accounts'),
      noAccs: accs.length === 0,

      notifs: NOTIFS.map((n) => {
        const on = notifOn[n.k] ?? n.def;
        return {
          label: n.label, sub: n.sub, on,
          track: on ? '#006AFF' : '#E4E4E7',
          knob: on ? '21px' : '3px',
          toggle: () => app.setUi({ notifs: { ...(app.state.ui.notifs || {}), [n.k]: !on } }),
        };
      }),

      stats,

      // The delete-account overlay (kind 'delAcct' with no account id) confirms, clears data and logs out.
      del: () => app.setState({ ov: { kind: 'delAcct' } }),
    },
  };
}
