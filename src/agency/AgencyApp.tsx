'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// App controller, ported from the design prototype's logic class.
// State lives here; each screen reads a plain view model built in ./views.
import { Component, type ChangeEvent } from 'react';
import {
  HOUR, MONTHS, TCOLORS, TINTS, addDays, demoData, dlong, draftFromAccounts, first, fmt,
  genBrands, genContent, genPrompt, initials, moreContent, moreIdeas, parseYmd, pitchText,
  seedCalendar, starterIdeas, tstr, uid, ymd,
} from './logic';
import type { ContentIdea, Idea, Job, Pitch, Route, ScheduledPost, Simulate, Talent, TalentTab } from './types';
import { deleteSavedAccount, loadAccount, loadState, saveAccount, saveState } from './persist';
import * as backend from './backend';
import { supabase } from './supabase';
import { loadData, Syncer } from './sync';
import { Shell } from './Shell';
import { buildView } from './views';
import { LandingScreen } from './screens/LandingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TalentsScreen } from './screens/TalentsScreen';
import { TalentFormScreen } from './screens/TalentFormScreen';
import { TalentScreen } from './screens/TalentScreen';
import { PitchScreen } from './screens/PitchScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { AccountScreen } from './screens/AccountScreen';
import { OverlaysScreen } from './screens/OverlaysScreen';

export type AppProps = {
  /** Prototype switch to try the loading, failed and stalled states. */
  simulate?: Simulate;
  startAt?: 'Start page' | 'Signed in';
};

export type AppState = {
  route: Route;
  tab: TalentTab;
  talentId: string | null;
  pitchId: string | null;
  signedIn: boolean;
  user: { name: string; email: string };
  agencyName: string;
  talents: Talent[];
  pitches: Pitch[];
  posts: ScheduledPost[];
  calMonth: { y: number; m: number } | null;
  calSel: string | null;
  calFilter: string | null;
  jobs: Record<string, Job>;
  ov: any;
  acctMenu: boolean;
  toast: string | null;
  draft: any;
  form: any;
  histTab: string;
  auth: { name: string; email: string; password: string; agency: string };
  authErr: string;
  renameVal: string;
  editedAfterApprove: boolean;
  narrow?: boolean;
  hexDraft?: { key: string; v: string } | null;
  colorOpen?: boolean;
  homeHover?: number | null;
  homeHidden?: Record<string, boolean>;
  /** Free-form UI state used by individual screens. */
  ui: Record<string, any>;
  /** Signed in through Supabase (not the local demo). */
  cloud?: boolean;
  userId?: string | null;
  authBusy?: boolean;
};

const PERSISTED = ['signedIn', 'user', 'agencyName', 'talents', 'pitches', 'posts', 'draft'] as const;
const ACCOUNT_KEYS = ['user', 'agencyName', 'talents', 'pitches', 'posts', 'draft'] as const;

export class AgencyApp extends Component<AppProps, AppState> {
  state: AppState = {
    route: 'start', tab: 'overview', talentId: null, pitchId: null, signedIn: false,
    user: { name: 'Mika Santos', email: 'mika.santos@email.com' }, agencyName: "Mika's Talent House",
    talents: [], pitches: [], posts: [], calMonth: null, calSel: null, calFilter: null, jobs: {}, ov: null,
    acctMenu: false, toast: null, draft: null, form: null, histTab: 'all',
    auth: { name: '', email: '', password: '', agency: '' }, authErr: '', renameVal: '', editedAfterApprove: false,
    ui: {},
  };
  timers: Record<string, ReturnType<typeof setTimeout>[]> = {};
  private _tt?: ReturnType<typeof setTimeout>;
  private _nr?: () => void;
  private _tlOff?: () => void;
  private _revealIO?: IntersectionObserver;
  private _armReveal?: () => void;
  private _hydrated = false;
  private _sync?: Syncer;
  private _onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (this.state.ov) this.setState({ ov: null });
    else if (this.state.acctMenu || this.state.colorOpen) this.setState({ acctMenu: false, colorOpen: false });
  };

  componentDidMount() {
    this._nr = () => {
      const n = innerWidth < 870;
      if (n !== !!this.state.narrow) this.setState({ narrow: n });
    };
    addEventListener('resize', this._nr);
    addEventListener('keydown', this._onKey);
    this._nr();
    this._tlSetup();
    this._revealIO = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        this._revealIO!.unobserve(el);
        const d = parseFloat(el.dataset.reveal || '') || 0;
        const orig = el.dataset.rvTr || '';
        el.style.transition = 'opacity .9s ease ' + d + 's,translate 1s cubic-bezier(.2,.8,.2,1) ' + d + 's,scale 1s cubic-bezier(.2,.8,.2,1) ' + d + 's,rotate 1s cubic-bezier(.2,.8,.2,1) ' + d + 's' + (orig ? ',' + orig : '');
        el.style.opacity = '1';
        el.style.translate = '0 0';
        el.style.scale = '1';
        el.style.rotate = 'none';
        setTimeout(() => { el.style.transition = orig; }, (d + 1.1) * 1000);
      });
    }, { threshold: 0.12 });
    this._armReveal = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])').forEach((el) => {
        el.setAttribute('data-rv', '1');
        el.dataset.rvTr = el.style.transition || '';
        el.style.transition = 'none';
        el.style.opacity = '0';
        if (el.dataset.revealKind === 'tilt') {
          el.style.translate = '0 60px';
          el.style.scale = '.92';
          el.style.rotate = 'x 18deg';
        } else {
          el.style.translate = '0 48px';
          el.style.scale = '.98';
        }
        this._revealIO!.observe(el);
      });
    };
    setTimeout(this._armReveal, 50);

    const demo = (this.props.startAt ?? 'Start page') === 'Signed in';
    if (demo) {
      this._hydrated = true;
      this.login();
    } else if (supabase()) {
      backend.currentProfile().then((p) => {
        this._hydrated = true;
        if (p) this.enterCloud(p);
      });
    } else {
      const saved = loadState(PERSISTED);
      if (saved && saved.signedIn) {
        this.setState({ ...saved, route: 'home' } as AppState, () => { this._hydrated = true; });
        this.runJob('home');
      } else {
        this._hydrated = true;
      }
    }
  }

  componentDidUpdate() {
    this._armReveal?.();
    if (!this._hydrated) return;
    if (this.state.cloud) {
      const s = this.withDraft(this.state);
      this._sync?.schedule({ talents: s.talents, pitches: s.pitches, posts: s.posts, draft: s.draft });
    } else {
      saveState(this.withDraft(this.state), PERSISTED);
    }
  }

  componentWillUnmount() {
    if (this._nr) removeEventListener('resize', this._nr);
    removeEventListener('keydown', this._onKey);
    this._tlOff?.();
    this._revealIO?.disconnect();
    Object.values(this.timers).forEach((a) => a.forEach(clearTimeout));
    clearTimeout(this._tt);
  }

  /** Landing page "how it works" timeline: horizontal scroll driven by vertical scroll. */
  _tlSetup() {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const run = () => {
      raf = 0;
      const tr = document.querySelector<HTMLElement>('[data-tl-track]');
      const sl = tr && tr.querySelector<HTMLElement>('[data-tl-slider]');
      if (!tr || !sl) return;
      const vw = innerWidth, vh = innerHeight, dist = Math.max(0, sl.scrollWidth - vw);
      const want = Math.round(dist + vh) + 'px';
      if (tr.style.height !== want) tr.style.height = want;
      const r = tr.getBoundingClientRect();
      const p = dist ? Math.min(1, Math.max(0, -r.top / dist)) : 0;
      sl.style.transform = 'translate3d(' + (-p * dist) + 'px,0,0)';
      const ln = tr.querySelector<HTMLElement>('[data-tl-line]');
      if (ln) {
        const b = ln.parentElement!.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (vw * 0.72 - b.left) / Math.max(1, b.width - vw * 0.28)));
        ln.style.transform = 'scaleX(' + (rm ? 1 : f) + ')';
      }
      tr.querySelectorAll<HTMLElement>('[data-tl-stem]').forEach((st) => {
        const i = st.dataset.tlStem;
        const L = st.getBoundingClientRect().left;
        const t = rm ? 1 : Math.min(1, Math.max(0, (vw * 0.78 - L) / (vw * 0.2)));
        const e = 1 - Math.pow(1 - t, 3);
        st.style.transform = 'scaleY(' + e + ')';
        const d = tr.querySelector<HTMLElement>('[data-tl-dot="' + i + '"]');
        if (d) d.style.transform = d.style.transform.replace(/scale\([^)]*\)/, 'scale(' + e + ')');
        tr.querySelectorAll<HTMLElement>('[data-tl-txt="' + i + '"]').forEach((x, k) => {
          const tt = Math.min(1, Math.max(0, t * 1.25 - k * 0.15));
          const ee = 1 - Math.pow(1 - tt, 3);
          x.style.transform = 'translateY(' + ((1 - ee) * 105) + '%)';
        });
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    addEventListener('scroll', on, true);
    addEventListener('resize', on);
    const iv = setInterval(on, 500);
    on();
    this._tlOff = () => {
      removeEventListener('scroll', on, true);
      removeEventListener('resize', on);
      clearInterval(iv);
    };
  }

  _authLayout(su: boolean) {
    const wide = !this.state.narrow;
    if (!wide) return { wide: false, narrow: true, boxH: '100vh', logoLeft: '24px', formPos: 'relative', formLeft: '0', formW: '100%', formT: 'none', formPad: '96px 0 40px', fDelay: '0s', suOp: su ? 1 : 0, liOp: su ? 0 : 1, suPe: su ? 'auto' : 'none', liPe: su ? 'none' : 'auto' };
    return {
      wide: true, narrow: false, boxH: 'max(100vh,760px)', logoLeft: su ? '32px' : 'calc(50% + 32px)', formPos: 'absolute', formLeft: su ? '25%' : '75%', formW: '50%', formT: 'translate(-50%,-50%)', formPad: '0', fDelay: '.7s',
      suOp: su ? 1 : 0, liOp: su ? 0 : 1, suPe: su ? 'auto' : 'none', liPe: su ? 'none' : 'auto',
      circleRight: su ? '52%' : '48%', circleT: su ? 'translate(100%,-50%)' : 'translateY(-50%)',
      leftX: su ? '-110vw' : '0px', rightX: su ? '0px' : '110vw', leftPe: su ? 'none' : 'auto', rightPe: su ? 'auto' : 'none',
    };
  }

  toast(text: string) {
    clearTimeout(this._tt);
    this.setState({ toast: text });
    this._tt = setTimeout(() => this.setState({ toast: null }), 2800);
  }

  setUi(patch: Record<string, any>) {
    this.setState((s) => ({ ui: { ...s.ui, ...patch } }));
  }

  // ---- Simulated agent jobs -------------------------------------------------
  clearJob(k: string) {
    (this.timers[k] || []).forEach(clearTimeout);
    this.timers[k] = [];
  }

  runJob(key: string, done?: () => void) {
    this.clearJob(key);
    const sim = this.props.simulate ?? 'normal';
    const T = this.timers[key];
    const set = (p: Partial<Job>) => this.setState((s) => ({ jobs: { ...s.jobs, [key]: { ...(s.jobs[key] || { phase: 'idle' }), ...p } } }));
    const at = (ms: number, f: () => void) => T.push(setTimeout(f, ms));
    set({ phase: 'loading', long: false });
    const fin = () => { set({ phase: 'done' }); done?.(); };
    if (sim === 'slow') { at(2200, () => set({ long: true })); at(4800, fin); }
    else if (sim === 'fails') { at(1300, () => set({ phase: 'failed' })); }
    else if (sim === 'stalls') { at(2200, () => set({ long: true })); at(6500, () => set({ phase: 'stalled' })); }
    else at(1100, fin);
  }

  job(k: string): Job { return this.state.jobs[k] || { phase: 'idle' }; }

  jv(k: string) {
    const j = this.job(k);
    return { loading: j.phase === 'loading', long: !!j.long && j.phase === 'loading', failed: j.phase === 'failed', stalled: j.phase === 'stalled', bad: j.phase === 'failed' || j.phase === 'stalled', phase: j.phase };
  }

  // ---- Navigation ------------------------------------------------------------
  go(route: Route, extra?: Partial<AppState> & { _saved?: boolean }) {
    this.setState((s) => {
      const patch: any = { route, acctMenu: false, ...(extra || {}) };
      if (s.route === 'form' && s.form && s.form.mode === 'new' && !patch._saved) {
        const f = s.form;
        if (f.name || f.niche || f.story || f.pic) patch.draft = { ...f };
      }
      delete patch._saved;
      return patch;
    });
    try { window.scrollTo(0, 0); } catch { /* not in a browser */ }
  }

  T(id: string | null) { return this.state.talents.find((t) => t.id === id); }

  upd(id: string, fn: (t: Talent) => Talent) {
    this.setState((s) => ({ talents: s.talents.map((t) => (t.id === id ? fn(t) : t)) }));
  }

  // ---- Auth ------------------------------------------------------------------
  /** Load the demo agency (used by ?demo and by logins with no saved account). */
  login() {
    const d = demoData(this.state.user.name, this.state.agencyName);
    const cs = seedCalendar(d.talents);
    this.setState({ signedIn: true, talents: cs.talents, posts: cs.posts, pitches: d.pitches, route: 'home', authErr: '', auth: { name: '', email: '', password: '', agency: '' } });
    this.runJob('home');
  }

  /** Open the signed-in student's agency after a Supabase sign-in, and load it from the database. */
  async enterCloud(p: backend.Profile) {
    this._sync = undefined;
    this.setState({
      signedIn: true, cloud: true, userId: p.userId, authBusy: false,
      user: { name: p.name, email: p.email }, agencyName: p.agencyName,
      talents: [], pitches: [], posts: [], draft: p.draft || null,
      route: 'home', authErr: '', auth: { name: '', email: '', password: '', agency: '' },
      jobs: { ...this.state.jobs, home: { phase: 'loading', long: false } },
    });
    const data = await loadData();
    if (!data) {
      this.setState((s) => ({ jobs: { ...s.jobs, home: { phase: 'failed' } } }));
      return;
    }
    // One-time import: an agency made in this browser before sign-in moves into the database.
    const local = loadAccount(p.email) as Partial<AppState> | null;
    const importLocal = !data.talents.length && !!local?.talents?.length;
    const start = importLocal
      ? { talents: local!.talents as Talent[], pitches: (local!.pitches as Pitch[]) || [], posts: (local!.posts as ScheduledPost[]) || [] }
      : data;
    this._sync = new Syncer(importLocal ? { talents: [], pitches: [], posts: [], draft: null } : { ...data, draft: p.draft }, (m) => this.toast(m));
    this.setState((s) => ({ ...start, jobs: { ...s.jobs, home: { phase: 'done' } } }));
    if (importLocal) {
      deleteSavedAccount(p.email);
      this.toast('Your AI talents from this browser are now saved to your account.');
    }
  }

  /** Home "Try again": reload the agency from the database, or rerun the demo load. */
  retryHome() {
    if (!this.state.cloud) { this.runJob('home'); return; }
    backend.currentProfile().then((p) => (p ? this.enterCloud(p) : this.logOut(false)));
  }

  async submitLogin() {
    const a = this.state.auth;
    if (!a.email.trim() || !a.password.trim()) { this.setState({ authErr: 'Please fill in your email and password.' }); return; }
    if (supabase()) {
      if (this.state.authBusy) return;
      this.setState({ authBusy: true, authErr: '' });
      const r = await backend.signIn(a.email.trim(), a.password);
      if (!r.ok) { this.setState({ authBusy: false, authErr: r.error }); return; }
      this.enterCloud(r.data);
      return;
    }
    // Mock auth: an agency made in this browser comes back for the same email. Any other email opens the demo.
    const acc = loadAccount(a.email);
    if (acc) {
      this.setState({ ...(acc as Partial<AppState> as AppState), signedIn: true, route: 'home', authErr: '', auth: { name: '', email: '', password: '', agency: '' } });
      this.runJob('home');
      return;
    }
    this.login();
  }

  async signup() {
    const a = this.state.auth;
    if (!a.name.trim() || !a.email.trim() || !a.password.trim() || !a.agency.trim()) { this.setState({ authErr: 'Please fill in all four fields.' }); return; }
    if (a.password.length < 8) { this.setState({ authErr: 'Your password must have 8 characters or more.' }); return; }
    if (supabase()) {
      if (this.state.authBusy) return;
      this.setState({ authBusy: true, authErr: '' });
      const r = await backend.signUp({ name: a.name.trim(), email: a.email.trim(), password: a.password, agency: a.agency.trim() });
      if (!r.ok) { this.setState({ authBusy: false, authErr: r.error }); return; }
      if (r.data === 'confirm') {
        this.setState({ authBusy: false, route: 'login', auth: { ...a, password: '' }, authErr: '' });
        this.toast('Check your email and click the link to confirm. Then log in.');
        return;
      }
      this.enterCloud(r.data);
      return;
    }
    this.setState({ signedIn: true, user: { name: a.name.trim(), email: a.email.trim() }, agencyName: a.agency.trim(), talents: [], posts: [], pitches: [], route: 'home', authErr: '', draft: null, auth: { name: '', email: '', password: '', agency: '' } });
  }

  logOut(keepAccount = true) {
    Object.keys(this.timers).forEach((k) => this.clearJob(k));
    if (this.state.cloud) {
      // Save anything still waiting, then end the session.
      const pending = keepAccount && this._sync ? this._sync.flush() : Promise.resolve();
      this._sync = undefined;
      pending.finally(() => backend.signOut());
    } else if (keepAccount && this.state.signedIn) {
      saveAccount(this.state.user.email, this.withDraft(this.state), ACCOUNT_KEYS);
    }
    this.setState({ signedIn: false, cloud: false, userId: null, authBusy: false, route: 'start', user: { name: 'Mika Santos', email: 'mika.santos@email.com' }, agencyName: "Mika's Talent House", talents: [], pitches: [], posts: [], draft: null, form: null, ov: null, acctMenu: false, jobs: {}, ui: {}, renameVal: '', editedAfterApprove: false, histTab: 'all', calMonth: null, calSel: null, calFilter: null });
  }
  /** Delete the agency and everything in it, then log out. */
  async deleteAccount() {
    const email = this.state.user.email;
    if (this.state.cloud) {
      this._sync = undefined;
      const r = await backend.deleteAccount();
      if (!r.ok) { this.toast(r.error); return; }
    }
    deleteSavedAccount(email);
    this.logOut(false);
    this.toast('Your account was deleted.');
  }

  async saveProfile(name: string, email: string) {
    const emailChanged = email.toLowerCase() !== this.state.user.email.toLowerCase();
    if (this.state.cloud) {
      const r = await backend.updateAgency({ owner_name: name });
      if (!r.ok) { this.toast(r.error); return false; }
      if (emailChanged) {
        const e = await backend.updateEmail(email);
        if (!e.ok) { this.toast(e.error); return false; }
        this.setState((s) => ({ user: { ...s.user, name } }));
        this.toast('Saved. Check your new email and click the link to finish the change.');
        return true;
      }
    }
    this.setState({ user: { name, email } });
    this.toast('Saved.');
    return true;
  }

  async renameAgency(name: string) {
    if (this.state.cloud) {
      const r = await backend.updateAgency({ name });
      if (!r.ok) { this.toast(r.error); return false; }
    }
    this.setState({ agencyName: name, renameVal: '' });
    this.toast('Agency renamed.');
    return true;
  }

  /** Returns an error message, or null when the password changed. */
  async changePassword(current: string, next: string): Promise<string | null> {
    if (this.state.cloud) {
      const r = await backend.changePassword(this.state.user.email, current, next);
      if (!r.ok) return r.error;
    }
    this.toast('Password changed.');
    return null;
  }

  /** While a new talent is being written, keep it as the draft so a reload can resume it. */
  withDraft(s: AppState): AppState {
    const f = s.form;
    if (s.route === 'form' && f && f.mode === 'new' && (f.name || f.niche || f.story || f.pic)) return { ...s, draft: { ...f } };
    return s;
  }


  authInput = (k: keyof AppState['auth']) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    this.setState((st) => ({ auth: { ...st.auth, [k]: v }, authErr: '' }));
  };

  // ---- Talent ----------------------------------------------------------------
  openTalent(id: string, tab?: TalentTab) {
    this.go('talent', { talentId: id, tab: tab || 'overview' });
    setTimeout(() => this.ensure(id, tab || 'overview'), 0);
  }

  setTab(tab: TalentTab) { this.setState({ tab }, () => this.ensure(this.state.talentId!, tab)); }

  ensure(id: string, tab: TalentTab) {
    const t = this.T(id);
    if (!t) return;
    if (tab === 'grow' && !t.growLoaded && t.accounts.some((a) => a.mode === 'live') && this.job('grow-' + id).phase !== 'loading') this.runJob('grow-' + id, () => this.upd(id, (x) => ({ ...x, growLoaded: true })));
    if (tab === 'content' && !t.contentLoaded && this.job('content-' + id).phase !== 'loading') this.runJob('content-' + id, () => this.upd(id, (x) => ({ ...x, contentLoaded: true, content: (x.content && x.content.length ? x.content : genContent(x).map((c, i) => ({ id: uid('c'), status: 'new' as const, flagged: false, date: Date.now() - i * 60000, ...c }))) })));
    if (tab === 'scout' && !t.scoutLoaded && this.job('scout-' + id).phase !== 'loading') this.runJob('scout-' + id, () => this.upd(id, (x) => ({ ...x, scoutLoaded: true })));
  }

  moreIdeas(id: string) {
    this.runJob('grow-' + id, () => this.upd(id, (t) => {
      const used = new Set(t.ideas.map((i) => i.title));
      const pool = (t.few ? starterIdeas(t).concat(moreIdeas(t)) : moreIdeas(t)).filter((i) => !used.has(i.title));
      let open = t.ideas.filter((i) => i.status === 'new').length;
      const add: Idea[] = [];
      for (const p of pool) {
        if (open >= 5 || add.length >= 2) break;
        add.push({ id: uid('i'), status: 'new' as const, flagged: false, date: Date.now(), ...p });
        open++;
      }
      if (!add.length) setTimeout(() => this.toast('There are no new ideas now. Try again after your next post.'), 0);
      return { ...t, growLoaded: true, ideas: add.concat(t.ideas) };
    }));
  }

  moreContentIdeas(id: string) {
    this.runJob('content-' + id, () => this.upd(id, (t) => {
      const used = new Set((t.content || []).map((c) => c.title));
      const add: ContentIdea[] = moreContent(t).filter((c) => !used.has(c.title)).map((c) => ({ id: uid('c'), status: 'new' as const, flagged: false, date: Date.now(), ...c }));
      if (!add.length) setTimeout(() => this.toast('There are no new content ideas now. Try again after your next post.'), 0);
      return { ...t, contentLoaded: true, content: add.concat(t.content || []) };
    }));
  }

  // ---- Calendar ----------------------------------------------------------------
  openSchedule(opts?: { postId?: string; tid?: string; cid?: string; date?: string }) {
    const o = opts || {};
    const T = this.state.talents;
    if (o.postId) {
      const p = this.state.posts.find((x) => x.id === o.postId)!;
      this.setState({ ov: { kind: 'schedule', postId: p.id, tid: p.talentId, cid: p.contentId || '', title: p.title, platform: p.platform, date: p.date, time: p.time } });
      return;
    }
    const tid = o.tid || this.state.calFilter || (T[0] && T[0].id);
    const t = T.find((x) => x.id === tid);
    const c = o.cid && t ? (t.content || []).find((x) => x.id === o.cid) : null;
    this.setState({ ov: { kind: 'schedule', postId: null, tid, cid: c ? c.id : '', title: c ? c.title : '', platform: c ? c.platform : ((t && t.accounts[0] && t.accounts[0].platform) || 'TikTok'), date: o.date || this.state.calSel || ymd(addDays(new Date(), 1)), time: '19:00' } });
  }

  saveSchedule() {
    const o = this.state.ov;
    if (!o.tid || !o.title.trim() || !o.date) return;
    const rec = { talentId: o.tid, contentId: o.cid || null, title: o.title.trim(), platform: o.platform, date: o.date, time: o.time || '19:00' };
    this.setState((s) => {
      const old = o.postId ? s.posts.find((p) => p.id === o.postId) : null;
      const posts = old ? s.posts.map((p) => (p.id === o.postId ? { ...p, ...rec } : p)) : s.posts.concat([{ id: uid('s'), status: 'scheduled', ...rec }]);
      const talents = s.talents.map((t) => (t.id !== o.tid ? t : { ...t, content: (t.content || []).map((c) => (c.id === o.cid && c.status === 'new' ? { ...c, status: 'planned' as const, date: Date.now() } : c)) }));
      const d = parseYmd(o.date);
      return { posts, talents, ov: null, calSel: o.date, calMonth: { y: d.getFullYear(), m: d.getMonth() } };
    });
    this.toast(o.postId ? 'Post moved to ' + dlong(o.date) + '.' : 'Planned for ' + dlong(o.date) + ', ' + tstr(o.time) + '.');
  }

  setPost(pid: string, patch: Partial<ScheduledPost> | null, msg?: string) {
    const p = this.state.posts.find((x) => x.id === pid);
    this.setState((s) => ({
      posts: patch ? s.posts.map((x) => (x.id === pid ? { ...x, ...patch } : x)) : s.posts.filter((x) => x.id !== pid),
      talents: p && p.contentId ? s.talents.map((t) => (t.id !== p.talentId ? t : { ...t, content: (t.content || []).map((c) => (c.id !== p.contentId ? c : { ...c, status: patch && patch.status === 'posted' ? 'posted' as const : patch ? c.status : 'new' as const, date: Date.now() })) })) : s.talents,
    }));
    if (msg) this.toast(msg);
  }

  // ---- Content and Grow ------------------------------------------------------------
  setContent(tid: string, cid: string, status: ContentIdea['status']) {
    this.upd(tid, (t) => ({ ...t, content: (t.content || []).map((c) => (c.id === cid ? { ...c, status, date: Date.now() } : c)) }));
    this.toast(status === 'planned' ? 'Added to your plan.' : status === 'posted' ? 'Marked as posted.' : 'Dismissed. The app will not show this idea again.');
  }

  copyText(text: string) {
    try { navigator.clipboard?.writeText(text).catch(() => {}); } catch { /* clipboard blocked */ }
  }

  copyPrompt(t: Talent, c: ContentIdea) {
    const p = genPrompt(t, c);
    this.copyText(p.text);
    this.toast(p.kind + ' copied. Paste it into your video tool.');
  }

  copyBrief(c: ContentIdea) {
    const txt = c.title + '\n' + c.format + ' · ' + c.platform + ' · ' + c.length + '\nHook: ' + c.hook + '\n' + c.beats.map((b, i) => (i + 1) + '. ' + b).join('\n') + '\nPost: ' + c.when;
    this.copyText(txt);
    this.toast('Brief copied.');
  }

  setIdea(tid: string, iid: string, status: 'done' | 'dismissed') {
    this.upd(tid, (t) => ({ ...t, ideas: t.ideas.map((i) => (i.id === iid ? { ...i, status, date: Date.now() } : i)) }));
    this.toast(status === 'done' ? 'Marked as done.' : 'Dismissed. The app will not show this idea again.');
  }

  // ---- Pitch ----------------------------------------------------------------------
  draftPitch(tid: string, bid: string) {
    const ex = this.state.pitches.find((p) => p.talentId === tid && p.brandId === bid);
    if (ex) { this.go('pitch', { pitchId: ex.id }); return; }
    const t = this.T(tid)!;
    const b = t.brands.find((x) => x.id === bid)!;
    const id = uid('p');
    this.setState((s) => ({ pitches: [{ id, talentId: tid, brandId: bid, brandName: b.name, status: 'writing' as const, flagged: false, date: Date.now(), pitch: '', profile: '' }, ...s.pitches] }));
    this.go('pitch', { pitchId: id });
    this.writePitch(id);
  }

  writePitch(id: string) {
    this.runJob('pitch-' + id, () => this.setState((s) => ({
      pitches: s.pitches.map((p) => {
        if (p.id !== id) return p;
        const t = s.talents.find((x) => x.id === p.talentId)!;
        const b = t.brands.find((x) => x.id === p.brandId)!;
        return { ...p, ...pitchText(t, b, s.user.name, s.agencyName), status: 'draft' as const, date: Date.now() };
      }),
    })));
  }

  updPitch(id: string, patch: Partial<Pitch>) {
    this.setState((s) => ({ pitches: s.pitches.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }

  editPitch(id: string, field: 'pitch' | 'profile', val: string) {
    const p = this.state.pitches.find((x) => x.id === id)!;
    const patch: Partial<Pitch> = { [field]: val };
    if (p.status === 'approved' || p.status === 'sent') { patch.status = 'draft'; this.setState({ editedAfterApprove: true }); }
    this.updPitch(id, patch);
  }

  copyPitch(p: Pitch) {
    this.copyText(p.pitch + '\n\n---\nTalent profile\n' + p.profile);
    this.toast('Copied. Paste it into your email or app. Then send it.');
  }

  // ---- Dismiss and flag ------------------------------------------------------------
  openDismiss(type: 'idea' | 'content', tid: string, id: string, label: string) {
    this.setState({ ov: { kind: 'dismiss', type, tid, id, label, reason: '', note: '' } });
  }

  submitDismiss() {
    const o = this.state.ov;
    const key = o.type === 'idea' ? 'ideas' : 'content';
    const wrong = o.reason === 'This looks wrong';
    this.upd(o.tid, (t: any) => ({ ...t, [key]: (t[key] || []).map((x: any) => (x.id !== o.id ? x : { ...x, status: 'dismissed', date: Date.now(), dismissReason: o.reason, dismissNote: o.note, ...(wrong ? { flagged: true, flagNote: o.note, flagDate: Date.now() } : {}) })) }));
    this.setState({ ov: null });
    this.toast(wrong ? 'Dismissed and flagged. You can find it in History.' : 'Dismissed. The app will not show this idea again.');
  }

  openFlag(type: 'idea' | 'content' | 'brand' | 'pitch', tid: string, id: string, label: string) {
    this.setState({ ov: { kind: 'flag', type, tid, id, label, note: '' } });
  }

  submitFlag() {
    const o = this.state.ov;
    const stamp = { flagged: true, flagNote: o.note, flagDate: Date.now() };
    if (o.type === 'pitch') this.updPitch(o.id, stamp);
    else {
      const key = o.type === 'idea' ? 'ideas' : o.type === 'content' ? 'content' : 'brands';
      this.upd(o.tid, (t: any) => ({ ...t, [key]: (t[key] || []).map((x: any) => (x.id === o.id ? { ...x, ...stamp } : x)) }));
    }
    this.setState({ ov: null });
    this.toast('Flagged. You can find it in History.');
  }

  // ---- Accounts ----------------------------------------------------------------------
  openConnect(tid: string, reAcc?: string | null, plat?: string) {
    const t = this.T(tid)!;
    const a = reAcc ? t.accounts.find((x) => x.id === reAcc) : null;
    this.clearJob('connect');
    this.setState((s) => ({ ov: { kind: 'connect', tid, platform: a ? a.platform : (plat || 'TikTok'), handle: '', reId: reAcc || null }, jobs: { ...s.jobs, connect: { phase: 'idle' } } }));
  }

  connectNow() {
    this.runJob('connect', () => {
      const o2 = this.state.ov;
      if (!o2) return;
      this.upd(o2.tid, (t) => {
        let accounts;
        if (o2.reId) accounts = t.accounts.map((a) => (a.id === o2.reId ? { ...a, status: 'ok' as const, updated: 0 } : a));
        else accounts = t.accounts.concat([{ id: uid('a'), platform: o2.platform, handle: '@' + t.name.toLowerCase().replace(/[^a-z]/g, ''), mode: 'live', status: 'ok', updated: 0 }]);
        const nt: Talent = { ...t, accounts };
        if (!t.stats) {
          nt.stats = { posts: [5, 3], views: [2600, 1900], eng: [6.4, 5.9], time: o2.platform === 'Facebook' ? null : [18, 12], timeBy: o2.platform, taken: MONTHS[new Date().getMonth()] + ' ' + new Date().getDate() };
          nt.few = true;
        }
        if (!t.ideas.length) {
          nt.ideas = starterIdeas(nt).map((x, i) => ({ id: uid('i'), status: 'new' as const, flagged: false, date: Date.now() - i * 60000, ...x }));
          nt.growLoaded = false;
        }
        return nt;
      });
      this.setState({ ov: null });
      this.toast((o2.reId ? 'Reconnected ' : 'Connected ') + o2.platform + '.');
    });
  }

  addByHandle() {
    const o = this.state.ov;
    let h = o.handle.trim();
    if (!h) return;
    if (h[0] !== '@') h = '@' + h;
    this.upd(o.tid, (t) => ({ ...t, accounts: t.accounts.concat([{ id: uid('a'), platform: o.platform, handle: h, mode: 'handle', status: 'ok' }]) }));
    this.setState({ ov: null });
    this.toast(o.platform + ' added by handle.');
  }

  refreshAccount(tid: string, aid: string) {
    this.runJob('refresh-' + aid, () => {
      this.upd(tid, (t) => ({ ...t, accounts: t.accounts.map((a) => (a.id === aid ? { ...a, updated: 0 } : a)) }));
      this.toast('Numbers updated.');
    });
  }

  disconnectAccount(tid: string, aid: string) {
    const t = this.T(tid);
    const a = t?.accounts.find((x) => x.id === aid);
    this.upd(tid, (x) => {
      const accounts = x.accounts.filter((y) => y.id !== aid);
      return { ...x, accounts, stats: accounts.some((y) => y.mode === 'live') ? x.stats : null };
    });
    this.setState({ ov: null });
    if (a) this.toast(a.platform + ' ' + a.handle + ' was removed.');
  }

  deleteTalent() {
    const id = this.state.ov.tid;
    const t = this.T(id)!;
    this.setState((s) => ({ talents: s.talents.filter((x) => x.id !== id), pitches: s.pitches.filter((p) => p.talentId !== id), posts: s.posts.filter((p) => p.talentId !== id), ov: null }));
    this.go('talents');
    this.toast(t.name + ' was deleted.');
  }

  // ---- Talent form -----------------------------------------------------------------
  openForm(mode: 'new' | 'edit', id?: string) {
    if (mode === 'edit') {
      const t = this.T(id!)!;
      this.go('form', { form: { mode, id, name: t.name, niche: t.niche, story: t.story, pic: t.pic, color: t.color || '#006AFF', resumed: false, step: 1 } });
    } else {
      const d = this.state.draft;
      // A draft saved mid-connect or mid-fill must not come back stuck in that state.
      const accs = d ? Object.fromEntries(Object.entries<any>(d.accs || {}).filter(([, a]) => a.phase === 'on')) : {};
      this.go('form', { form: d ? { ...d, accs, filling: false, mode: 'new', resumed: true } : { mode: 'new', name: '', niche: '', story: '', pic: null, color: this.nextColor(), resumed: false, step: 1 } });
    }
  }

  nextColor() {
    const used = new Set(this.state.talents.map((t) => t.color));
    const c = TCOLORS.find(([, h]) => !used.has(h));
    return c ? c[1] : TCOLORS[this.state.talents.length % TCOLORS.length][1];
  }

  swatches(cur: string, pick: (hex: string) => void) {
    return TCOLORS.map(([name, hex]) => ({ name, hex, ring: hex.toLowerCase() === (cur || '').toLowerCase() ? '0 0 0 2px #fff,0 0 0 4px ' + hex : '0 0 0 1px rgba(24,24,27,.08)', pick: () => pick(hex) }));
  }

  picker(cur: string, pick: (hex: string) => void, key: string) {
    const isPreset = TCOLORS.some((c) => c[1].toLowerCase() === (cur || '').toLowerCase());
    const draft = this.state.hexDraft && this.state.hexDraft.key === key ? this.state.hexDraft.v : null;
    const norm = (v: string) => {
      v = v.trim();
      if (v[0] !== '#') v = '#' + v;
      return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toUpperCase() : null;
    };
    return {
      hex: cur, hexVal: draft != null ? draft : (cur || '').toUpperCase(),
      cFill: isPreset ? '#fff' : cur, cRing: isPreset ? '0 0 0 1px rgba(24,24,27,.08)' : '0 0 0 2px #fff,0 0 0 4px ' + cur,
      onPick: (e: ChangeEvent<HTMLInputElement>) => { this.setState({ hexDraft: null }); pick(e.target.value.toUpperCase()); },
      onHex: (e: ChangeEvent<HTMLInputElement>) => { const v = e.target.value; const n = norm(v); this.setState({ hexDraft: { key, v } }); if (n) pick(n); },
      onHexBlur: () => this.setState({ hexDraft: null }),
    };
  }

  formConnect(pl: string) {
    const f = this.state.form;
    const acc = (f.accs || {})[pl] || {};
    const h = (acc.handle || '').trim();
    if (!h) return;
    const handle = h[0] === '@' ? h : '@' + h;
    this.setState((s) => ({ form: { ...s.form, accs: { ...(s.form.accs || {}), [pl]: { handle, phase: 'loading' } } } }));
    setTimeout(() => this.setState((s) => (s.form ? { form: { ...s.form, accs: { ...(s.form.accs || {}), [pl]: { handle, phase: 'on' } } } } : null)), 1100);
  }

  formFill() {
    const f = this.state.form;
    const accs = Object.entries<any>(f.accs || {}).filter(([, a]) => a.phase === 'on').map(([platform, a]) => ({ platform, handle: a.handle }));
    if (!accs.length) return;
    this.setForm('filling', true);
    setTimeout(() => {
      const d = draftFromAccounts(this.state.form.name, accs);
      this.setState((s) => (s.form ? { form: { ...s.form, filling: false, filled: accs.map((a) => a.handle).join(', '), niche: d.niche, story: d.story } } : null));
    }, 1600);
  }

  setForm(k: string, v: any) { this.setState((s) => ({ form: { ...s.form, [k]: v } })); }

  saveForm() {
    const f = this.state.form;
    if (f.mode === 'edit') {
      this.upd(f.id, (t) => ({ ...t, name: f.name.trim(), niche: f.niche.trim(), story: f.story.trim(), pic: f.pic, color: f.color || t.color }));
      this.go('talent', { talentId: f.id, _saved: true });
      this.toast('Saved.');
      return;
    }
    const fAccs = Object.entries<any>(f.accs || {}).filter(([, a]) => a.phase === 'on').map(([platform, a]) => ({ id: uid('a'), platform: platform as any, handle: a.handle, mode: 'live' as const, status: 'ok' as const, updated: 0 }));
    const t: Talent = { id: uid('t'), name: f.name.trim(), niche: f.niche.trim(), story: f.story.trim(), pic: f.pic, color: f.color || this.nextColor(), tint: TINTS[this.state.talents.length % TINTS.length], accounts: fAccs, stats: fAccs.length ? { posts: [6, 4], views: [5200, 4100], eng: [6.1, 5.5], time: [40, 31], taken: MONTHS[new Date().getMonth()] + ' ' + new Date().getDate() } : null, ideas: [], brands: [], few: true, growLoaded: false, scoutLoaded: false };
    t.brands = genBrands(t).map((b) => ({ ...b, flagged: false }));
    if (fAccs.length) t.ideas = starterIdeas(t).map((x, i) => ({ id: uid('i'), status: 'new' as const, flagged: false, date: Date.now() - i * 60000, ...x }));
    this.setState((s) => ({ talents: s.talents.concat([t]), draft: null }));
    this.go('talent', { talentId: t.id, tab: 'overview', _saved: true, draft: null });
    this.toast(t.name + ' was added.' + (fAccs.length ? '' : ' Next, connect an account.'));
  }

  // ---- Derived numbers ----------------------------------------------------------------
  analytics(t: Talent): any {
    if (!t.stats) return {};
    let seed = 0;
    for (const ch of t.id) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const col = t.color || '#006AFF';
    const DN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const split = (tot: number, k: number) => {
      const ws = Array.from({ length: k }, () => 0.6 + rnd());
      const sm = ws.reduce((a, b) => a + b, 0);
      return ws.map((w) => Math.round(tot * w / sm));
    };
    const now = split(t.stats.views[0], 7), prev = split(t.stats.views[1], 7);
    const peak = Math.max(...now, ...prev);
    const step = Math.pow(10, Math.floor(Math.log10(peak)));
    let top = Math.ceil(peak / step) * step;
    if (top / peak > 1.6) top = Math.ceil(peak / (step / 2)) * (step / 2);
    const X = (d: number) => 4 + d * (592 / 6), Y = (v: number) => 200 - v / top * 196;
    const sm = (pts: number[][]) => pts.map((p, i) => {
      if (!i) return 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      const q = pts[i - 1];
      const cx = (q[0] + p[0]) / 2;
      return 'C' + cx.toFixed(1) + ' ' + q[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' ');
    const nowD = sm(now.map((v, d) => [X(d), Y(v)])), prevD = sm(prev.map((v, d) => [X(d), Y(v)]));
    const bi = now.indexOf(Math.max(...now));
    const LOGO: Record<string, string> = { TikTok: '/assets/p-tiktok.png', Instagram: '/assets/p-instagram.png', Facebook: '/assets/p-facebook.png', YouTube: '/assets/p-youtube.png' };
    const live = t.accounts.filter((a) => a.mode === 'live');
    const handle = t.accounts.filter((a) => a.mode === 'handle');
    const shades = [col, col + '99', col + '55', col + '33'];
    const pv = live.length ? split(t.stats.views[0], live.length).sort((a, b) => b - a) : [];
    const plats = live.map((a, i) => ({ name: a.platform, sub: a.handle + (a.status === 'lost' ? ' · last good numbers' : ''), logoBg: LOGO[a.platform] ? 'url(' + LOGO[a.platform] + ')' : 'none', views: fmt(pv[i]), pct: Math.round(pv[i] / t.stats!.views[0] * 100) + '%', share: pv[i], bar: shades[i % 4] }));
    const pool = (t.content || []).map((c) => ({ title: c.title, format: c.format, platform: c.platform })).concat(t.ideas.map((i) => ({ title: i.title.replace(/^(Post|Film|Tag|Invite|Reply to) /, ''), format: 'Short video', platform: (live[0] || {}).platform || 'TikTok' })));
    const tv = split(Math.round(t.stats.views[0] * 0.62), 4).sort((a, b) => b - a);
    const topPosts = pool.slice(0, 4).map((p, i) => ({ rank: i + 1, rankBg: i === 0 ? col : '#F4F4F5', rankFg: i === 0 ? '#fff' : '#52525b', title: p.title, meta: p.format + ' · ' + p.platform, logoBg: LOGO[p.platform] ? 'url(' + LOGO[p.platform] + ')' : 'none', views: fmt(tv[i]) + ' views', w: (tv[i] / tv[0] * 100).toFixed(0) + '%', eng: (t.stats!.eng[0] + (1.6 - i * 0.7) + rnd() * 0.4).toFixed(1) + '%' }));
    const SL = ['Morning', 'Noon', 'Evening', 'Night'];
    const base = [0.35, 0.5, 1, 0.7];
    const dayB = [0.75, 0.7, 0.8, 0.95, 0.9, 1, 0.85];
    let best = { v: 0, r: 0, c: 0 };
    const heat: any[] = SL.map((l, r) => ({ label: l, cells: DN.map((d, c) => { const v = base[r] * dayB[c] * (0.75 + rnd() * 0.5); if (v > best.v) best = { v, r, c }; return { v, d, l }; }) }));
    const mx = best.v;
    heat.forEach((h) => {
      h.cells = h.cells.map((x: any, ci: number) => {
        const a = x.v / mx;
        const hex = Math.round(18 + a * 237).toString(16).padStart(2, '0');
        const isB = h.label === SL[best.r] && ci === best.c;
        return { bg: col + hex, ring: isB ? '0 0 0 2px #fff,0 0 0 4px ' + col : 'none', tip: x.d + ' ' + x.l.toLowerCase() + ': ' + Math.round(a * 100) + '% of peak' };
      });
    });
    const totEng = Math.round(t.stats.views[0] * t.stats.eng[0] / 100);
    const parts: [string, number][] = [['Likes', 0.72], ['Comments', 0.12], ['Shares', 0.09], ['Saves', 0.07]];
    const eng = parts.map(([label, f], i) => ({ label, n: f, v: fmt(totEng * f), pct: Math.round(f * 100) + '%', bg: shades[i] }));
    return {
      color: col, ticks: [fmt(top), fmt(Math.round(top / 2)), '0'], nowD, prevD, area: nowD + ' L' + X(6).toFixed(1) + ' 200 L' + X(0).toFixed(1) + ' 200 Z',
      pts: now.map((v, d) => ({ x: (X(d) / 600 * 100).toFixed(2) + '%', y: (Y(v) / 200 * 100).toFixed(2) + '%', tip: DN[d] + ': ' + fmt(v) + ' views (last week ' + fmt(prev[d]) + ')' })),
      days: DN.map((l, d) => ({ l, x: (X(d) / 600 * 100).toFixed(2) + '%', c: d === bi ? col : '#71717a' })),
      dayNote: 'Best day: ' + DN[bi] + ', with ' + fmt(now[bi]) + ' views.',
      plats, hasHandleOnly: handle.length > 0, handleNote: handle.map((a) => a.platform).join(', ') + ' is added by handle, so it shares no numbers.',
      top: topPosts, dowL: DN.map((d) => d[0]), heat, best: DN[best.c] + ' ' + SL[best.r].toLowerCase(),
      eng, engTotal: fmt(totEng) + ' total this week',
    };
  }

  metricCards(t: Talent) {
    const s = t.stats;
    if (!s) return [];
    const stale = t.accounts.filter((a) => a.mode === 'live').every((a) => a.status === 'lost');
    const row = (label: string, arr: [number, number] | null, kind: 'count' | 'pts' | 'pct', unit?: string) => {
      if (!arr) return { label, value: 'Not available', na: true, notNa: false, sub: (s.timeBy || 'This platform') + ' does not share it', hasDelta: false, color: '#71717a', rot: 'none', delta: '', chip: '#F4F4F5' };
      const [a, b] = arr;
      let d: string, up: boolean;
      if (kind === 'count') { const x = a - b; up = x >= 0; d = Math.abs(x) + (up ? ' more' : ' fewer') + ' than last week'; }
      else if (kind === 'pts') { const x = Math.round((a - b) * 10) / 10; up = x >= 0; d = Math.abs(x) + (up ? '% more' : '% less') + ' than last week'; }
      else { const x = Math.round((a - b) / b * 100); up = x >= 0; d = Math.abs(x) + (up ? '% more' : '% less') + ' than last week'; }
      return { label, value: (kind === 'pts' ? a + '%' : fmt(a) + (unit || '')), na: false, notNa: true, sub: '', hasDelta: !stale, delta: d, color: up ? '#006AFF' : '#B91C1C', rot: up ? 'none' : 'rotate(180deg)', chip: up ? '#EAF2FF' : '#FEECEC' };
    };
    return [row('Posts', s.posts, 'count'), row('Views', s.views, 'pct'), row('Average engagement', s.eng, 'pts'), row('Time spent watching', s.time, 'pct', ' h')];
  }

  pic(t: Talent) {
    return { hasPic: !!t.pic, noPic: !t.pic, pic: t.pic || '', picBg: t.pic ? 'url(' + t.pic + ')' : 'none', initials: initials(t.name), tint: t.tint };
  }

  viewsOf(t: Talent) {
    if (!t.stats) return null;
    const [a, b] = t.stats.views;
    const x = Math.round((a - b) / b * 100);
    return { views: fmt(a), delta: Math.abs(x) + '%', up: x >= 0, color: x >= 0 ? '#006AFF' : '#B91C1C', rot: x >= 0 ? 'none' : 'rotate(180deg)' };
  }

  // Re-exported helpers so view builders only need the app instance.
  helpers = { HOUR, first, fmt, initials, ymd, parseYmd, addDays, dlong, tstr };

  render() {
    const v = buildView(this);
    return (
      <Shell v={v}>
        <LandingScreen v={v} />
        <AuthScreen v={v} />
        <HomeScreen v={v} />
        <TalentsScreen v={v} />
        <TalentFormScreen v={v} />
        <TalentScreen v={v} />
        <PitchScreen v={v} />
        <CalendarScreen v={v} />
        <HistoryScreen v={v} />
        <AccountScreen v={v} />
        <OverlaysScreen v={v} />
      </Shell>
    );
  }
}
