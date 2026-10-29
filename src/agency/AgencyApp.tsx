'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// App controller, ported from the design prototype's logic class.
// State lives here; each screen reads a plain view model built in ./views.
import { Component, type ChangeEvent } from 'react';
import {
  HOUR, MONTHS, PLATFORMS, TCOLORS, TINTS, addDays, demoData, dlong, draftFromAccounts, first, fmt,
  combineStats, dailyByPlatform, genBrands, metricCards, viewsOf, genContent, genPrompt, initials, moreContent, moreIdeas, parseYmd, pitchText,
  seedCalendar, starterIdeas, tstr, uid, ymd,
} from './logic';
import type { Account, ContentIdea, Idea, Job, Pitch, Platform, Route, ScheduledPost, Simulate, Talent, TalentTab } from './types';
import { deleteSavedAccount, loadAccount, loadState, saveAccount, saveState } from './persist';
import * as backend from './backend';
import { copyText } from './clipboard';
import { supabase } from './supabase';
import { loadData, Syncer } from './sync';
import { AgentCallError, accounts, agents, serverStatus, type AccountRead, type AgentErrorCode } from './api';
import { realOnly } from './logic';
import { Shell } from './Shell';
import { buildView } from './views';
import { errorText, isProblem } from './errors';
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
  /** Platform picked for the views-each-day charts ('' = all platforms). */
  homePlat?: string;
  anPlat?: string;
  /** Free-form UI state used by individual screens. */
  ui: Record<string, any>;
  /** Signed in through Supabase (not the local demo). */
  cloud?: boolean;
  userId?: string | null;
  authBusy?: boolean;
};

/** Platforms that connect through their own login page instead of by handle. */
const LOGIN_PLATFORMS: Platform[] = ['Instagram', 'Facebook', 'TikTok'];

/** The tid a login page carries when it was opened from the new AI talent form (the talent has no id yet). */
const FORM_TID = 'new-talent';
const WAITING_KEY = 'aia-waiting-login';
/** The ids of the demo agency's AI talents (demoData). */
const DEMO_IDS = ['luna', 'paolo', 'bea'];

const PERSISTED = ['signedIn', 'user', 'agencyName', 'talents', 'pitches', 'posts', 'draft'] as const;
const ACCOUNT_KEYS = ['user', 'agencyName', 'talents', 'pitches', 'posts', 'draft'] as const;
/** One screen, as kept in browser history. */
type Nav = { route: Route; talentId: string | null; tab: TalentTab; pitchId: string | null };

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
  /** True when the server has an OpenRouter key: signed-in students get the real agents. */
  private _agentsOn = false;
  /** Platforms the server reads for real (from /api/health). */
  private _live: Platform[] = [];
  /** The server's answer on agents and platforms. Until it comes, signed-in actions wait for it. */
  private _status: Promise<void> = Promise.resolve();
  private _statusKnown = true;
  /** A platform login page just sent the student back (?connected=… or ?connect_error=…). */
  private _return: { platform: Platform; tid: string; re: string | null; ref: string | null; error: string | null } | null = null;
  /** Login tabs send their result on this channel (see tabPage in the connect callback). */
  private _bc?: BroadcastChannel;
  /**
   * The login this tab opened in a new tab. Other app tabs ignore its result, so the account is added once.
   * `sent` is the talent id the login page sends back; `tid` is where the account goes (a new talent saved
   * while its login was still open gets the account). `n` counts logins started for the same account.
   * Kept in sessionStorage, so a reload of this tab still takes the result.
   */
  private _waitingMem: { platform: Platform; tid: string; sent: string; n: number } | null = null;
  private get _waiting() {
    if (this._waitingMem) return this._waitingMem;
    try { return JSON.parse(sessionStorage.getItem(WAITING_KEY) || 'null'); } catch { return null; }
  }
  private set _waiting(w: { platform: Platform; tid: string; sent: string; n: number } | null) {
    this._waitingMem = w;
    try { if (w) sessionStorage.setItem(WAITING_KEY, JSON.stringify(w)); else sessionStorage.removeItem(WAITING_KEY); } catch { /* storage blocked */ }
  }
  private _onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (this.state.ov) this.setState({ ov: null });
    else if (this.state.acctMenu || this.state.colorOpen) this.setState({ acctMenu: false, colorOpen: false });
  };

  /** Save what is waiting when the tab is hidden or closed; ask before closing while a save is not done. */
  private _onHide = () => { if (document.visibilityState === 'hidden') this._sync?.flush(); };
  private _onUnload = (e: BeforeUnloadEvent) => {
    if (!this._sync?.dirty) return;
    this._sync.flush();
    e.preventDefault();
    e.returnValue = '';
  };
  private _onOnline = () => { this._sync?.flush(); };

  /**
   * Another tab may have changed the agency, signed out, or signed in someone else. When this tab comes
   * back into view (at most every 30 s), check the session and load the agency again. Changes made in
   * this tab are saved first; if the student changes something while it loads, this tab keeps its copy.
   */
  private _lastLoad = 0;
  private _onShow = () => { if (document.visibilityState === 'visible') this.reloadFromCloud(); };
  async reloadFromCloud() {
    const sync = this._sync;
    if (!this.state.cloud || !sync || Date.now() - this._lastLoad < 30000) return;
    this._lastLoad = Date.now();
    const uid = await backend.sessionUserId();
    if (this._sync !== sync) return;
    if (!uid) { this.sessionEnded(); return; }
    if (uid !== this.state.userId) { window.location.reload(); return; }
    if (!(await sync.flush())) return;
    const before = this.state;
    const d = await loadData();
    const s = this.state;
    if (!d || this._sync !== sync || s.talents !== before.talents || s.pitches !== before.pitches || s.posts !== before.posts) return;
    sync.stop();
    this._sync = new Syncer({ ...d, draft: this.withDraft(s).draft }, (m) => this.toast(m));
    const talents = d.talents.map(realOnly);
    const gone = (s.route === 'talent' && !talents.some((t) => t.id === s.talentId)) || (s.route === 'pitch' && !d.pitches.some((p) => p.id === s.pitchId));
    const route: Route = gone ? (s.route === 'pitch' ? 'history' : 'talents') : s.route;
    this.setState({ talents, pitches: d.pitches, posts: d.posts, route });
  }

  componentDidMount() {
    addEventListener('visibilitychange', this._onHide);
    addEventListener('beforeunload', this._onUnload);
    addEventListener('online', this._onOnline);
    addEventListener('visibilitychange', this._onShow);
    addEventListener('focus', this._onShow);
    this._nr = () => {
      const n = innerWidth < 870;
      if (n !== !!this.state.narrow) this.setState({ narrow: n });
    };
    addEventListener('resize', this._nr);
    addEventListener('keydown', this._onKey);
    try { this._restore = (window.history.state as { aia?: Nav } | null)?.aia || null; } catch { /* not in a browser */ }
    addEventListener('popstate', this._onPop);
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

    this._return = this.readReturn();
    try {
      this._bc = new BroadcastChannel('aia-connect');
      this._bc.onmessage = (e) => this.tabReturn(e.data);
    } catch { /* no BroadcastChannel: logins run in this tab */ }
    const demo = (this.props.startAt ?? 'Start page') === 'Signed in';
    if (demo) {
      // ?demo is a look around: it is never saved over the agency kept in this browser.
      this._demoRun = true;
      this._hydrated = true;
      this.login();
    } else if (supabase()) {
      backend.currentProfile().then((r) => {
        this._hydrated = true;
        if (!r.ok) { this.setState({ route: 'login', authErr: r.error + ' Log in again to retry.' }); return; }
        if (r.data) this.enterCloud(r.data);
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
    this.syncHistory();
    if (this.state.cloud) {
      const s = this.withDraft(this.state);
      this._sync?.schedule({ talents: s.talents, pitches: s.pitches, posts: s.posts, draft: s.draft });
    } else {
      if (!this._demoRun) saveState(this.withDraft(this.state), PERSISTED);
    }
  }

  componentWillUnmount() {
    removeEventListener('popstate', this._onPop);
    if (this._nr) removeEventListener('resize', this._nr);
    removeEventListener('keydown', this._onKey);
    removeEventListener('visibilitychange', this._onHide);
    removeEventListener('beforeunload', this._onUnload);
    removeEventListener('online', this._onOnline);
    removeEventListener('visibilitychange', this._onShow);
    removeEventListener('focus', this._onShow);
    this._bc?.close();
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

  /**
   * Show a message at the bottom. A problem stays until the student closes it; other messages stay long
   * enough to read. `action` adds a button, such as Undo.
   */
  toast(text: string, action?: { label: string; run: () => void }) {
    clearTimeout(this._tt);
    this.toastAction = action || null;
    this.setState({ toast: text });
    if (isProblem(text)) return;
    const ms = Math.min(8000, Math.max(action ? 6000 : 2800, text.length * 60));
    this._tt = setTimeout(() => this.closeToast(), ms);
  }
  toastAction: { label: string; run: () => void } | null = null;
  closeToast() {
    clearTimeout(this._tt);
    this.toastAction = null;
    this.setState({ toast: null });
  }

  /** The platform this tab waits on in a login tab for this talent, if any. */
  waitingLogin(tid: string) {
    const w = this._waiting;
    return w && w.tid === tid ? w.platform : null;
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

  /**
   * Run an agent. Signed-in students with an OpenRouter key get the real agent through /api/agents;
   * everyone else (local demo, ?simulate) gets the mock agent through runJob.
   */
  agentJob<T>(key: string, call: () => Promise<T>, apply: (result: T) => void, mock: () => void): void {
    if (this.state.cloud && !this._statusKnown) { this._status.then(() => this.agentJob(key, call, apply, mock)); return; }
    if (!this._agentsOn) { this.runJob(key, mock); return; }
    this.liveJob(key, call, apply, mock, (code) => { if (code === 'no_key') this._agentsOn = false; });
  }

  /**
   * Run a real server call for a signed-in student, with the same loading, slow, failed and stalled
   * states as runJob. Signed out, under ?simulate, or when the server is not set up for it
   * (`no_key`, `not_configured`), the mock runs instead.
   */
  async liveJob<T>(key: string, call: () => Promise<T>, apply: (result: T) => void, mock: () => void, onError?: (code: AgentErrorCode, message: string) => void) {
    const sim = this.props.simulate ?? 'normal';
    if (!this.state.cloud || sim !== 'normal') { this.runJob(key, mock); return; }
    this.clearJob(key);
    const set = (p: Partial<Job>) => this.setState((s) => ({ jobs: { ...s.jobs, [key]: { ...(s.jobs[key] || { phase: 'idle' }), ...p } } }));
    set({ phase: 'loading', long: false });
    this.timers[key].push(setTimeout(() => set({ long: true }), 8000));
    try {
      const result = await call();
      if (this.job(key).phase !== 'loading') return;
      this.clearJob(key);
      apply(result);
      set({ phase: 'done', long: false });
    } catch (e) {
      this.clearJob(key);
      const code = e instanceof AgentCallError ? e.code : 'server';
      if (code === 'unauthorized') { this.sessionEnded(); return; }
      onError?.(code, e instanceof Error ? e.message : '');
      if (code === 'no_key' || code === 'not_configured') { this.runJob(key, mock); return; }
      if (code === 'needs_account') { set({ phase: 'done', long: false }); return; }
      set({ phase: code === 'timeout' ? 'stalled' : 'failed', long: false, msg: errorText(code) });
    }
  }

  /** The server no longer knows this login (expired or signed out elsewhere): ask the student to log in again. */
  sessionEnded() {
    if (!this.state.cloud) return;
    this.logOut(false);
    this.setState({ route: 'login', authErr: 'Your session ended. Log in again.' });
  }

  /** Show the message for a failed call, or send the student to Log in when the session ended. */
  private callFailed(e: unknown, what?: string) {
    const code = e instanceof AgentCallError ? e.code : 'server';
    if (code === 'unauthorized') { this.sessionEnded(); return; }
    this.toast(errorText(code, what));
  }

  /** New items from an agent, with fresh ids, leaving out titles the talent already has. */
  private freshIdeas(t: Talent, list: { title: string; why: string }[]): Idea[] {
    const used = new Set(t.ideas.map((i) => i.title.toLowerCase()));
    let open = t.ideas.filter((i) => i.status === 'new').length;
    const out: Idea[] = [];
    for (const x of list) {
      if (open >= 5 || used.has(x.title.toLowerCase())) continue;
      out.push({ id: uid('i'), status: 'new', flagged: false, date: Date.now(), title: x.title, why: x.why });
      open++;
    }
    return out;
  }

  /**
   * Browser history: each screen change is one history entry, so Back and Forward move between screens,
   * and a reload comes back to the same screen (the browser keeps history.state across a reload).
   */
  private _lastNav = '';
  private _popping = false;
  private _restore: Nav | null = null;
  private _onPop = (e: PopStateEvent) => {
    const n = (e.state as { aia?: Nav } | null)?.aia;
    if (!n) return;
    this._popping = true;
    this.goNav(n);
  };

  /** Open a screen from history. A talent tab loads its ideas, as when the student opens it. */
  private goNav(n: Nav) {
    const patch = this.navPatch(n);
    this.setState(patch, () => { if (patch.route === 'talent' && patch.talentId) this.ensure(patch.talentId, patch.tab); });
  }

  /** The state for a saved screen. A talent or pitch that is gone opens its list; screens that need a login need one. */
  private navPatch(n: Nav): Pick<AppState, 'route' | 'talentId' | 'tab' | 'pitchId' | 'acctMenu' | 'ov'> {
    const s = this.state;
    const out = ['start', 'signup', 'login'];
    const at = (route: Route) => ({ route, talentId: s.talentId, tab: s.tab, pitchId: s.pitchId, acctMenu: false, ov: null });
    if (!s.signedIn) return at(out.includes(n.route) ? n.route : 'start');
    if (out.includes(n.route)) return at('home');
    if (n.route === 'talent' && !this.T(n.talentId)) return at('talents');
    if (n.route === 'pitch' && !s.pitches.some((p) => p.id === n.pitchId)) return at('history');
    if (n.route === 'form' && !s.form) return at('talents');
    return { route: n.route, talentId: n.talentId, tab: n.tab, pitchId: n.pitchId, acctMenu: false, ov: null };
  }


  /** Write the current screen into browser history (a new entry, or the same one after Back or a reload). */
  private syncHistory() {
    const s = this.state;
    if (this._restore && this._hydrated) {
      if (!s.signedIn) this._restore = null;
      else if (this.job('home').phase === 'done') {
        const r = this._restore;
        this._restore = null;
        this._popping = true;
        this.goNav(r);
        return;
      }
    }
    const nav: Nav = { route: s.route, talentId: s.talentId, tab: s.tab, pitchId: s.pitchId };
    const key = JSON.stringify(nav);
    if (key === this._lastNav) return;
    const replace = !this._lastNav || this._popping;
    this._lastNav = key;
    this._popping = false;
    try {
      if (replace) window.history.replaceState({ ...window.history.state, aia: nav }, '');
      else window.history.pushState({ aia: nav }, '');
    } catch { /* not in a browser */ }
  }

  // ---- Navigation ------------------------------------------------------------
  go(route: Route, extra?: Partial<AppState> & { _saved?: boolean }) {
    // Until the agency has loaded, nothing made on other screens could be saved, and the load would replace it.
    if (this.state.cloud && !this._sync && route !== 'home' && route !== 'account') {
      this.setState({ route: 'home', acctMenu: false });
      this.toast(this.job('home').phase === 'loading' ? 'Your agency is still loading.' : 'Your agency did not load. Press Try again.');
      return;
    }
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
    this._sync?.stop();
    this._sync = undefined;
    this.setState({
      signedIn: true, cloud: true, userId: p.userId, authBusy: false,
      user: { name: p.name, email: p.email }, agencyName: p.agencyName,
      talents: [], pitches: [], posts: [], draft: p.draft || null,
      route: 'home', authErr: '', auth: { name: '', email: '', password: '', agency: '' },
      jobs: { ...this.state.jobs, home: { phase: 'loading', long: false } },
    });
    // Re-render, because the new AI talent form shows a login or a handle box by what the server reads.
    this._statusKnown = false;
    this._status = serverStatus().then((st) => { this._agentsOn = st.agents; this._live = st.live; this._statusKnown = true; this.forceUpdate(); });
    const data = await loadData();
    if (!data) {
      this.setState((s) => ({ jobs: { ...s.jobs, home: { phase: 'failed' } } }));
      return;
    }
    // One-time import: an agency made in this browser before sign-in moves into the database.
    const local = loadAccount(p.email) as Partial<AppState> | null;
    // The demo agency (Luna, Paolo, Bea) is never imported as the student's own.
    const importLocal = !data.talents.length && !!local?.talents?.length && !local.talents.every((t) => DEMO_IDS.includes((t as Talent).id));
    const loaded = importLocal
      ? { talents: local!.talents as Talent[], pitches: (local!.pitches as Pitch[]) || [], posts: (local!.posts as ScheduledPost[]) || [] }
      : data;
    // Older versions gave some accounts made-up numbers. Signed in, only real numbers stay.
    const start = { ...loaded, talents: loaded.talents.map(realOnly) };
    // Keep the browser copy until the first save reaches the database, so a failed save or a closed tab loses nothing.
    let imported = !importLocal;
    const sync = new Syncer(importLocal ? { talents: [], pitches: [], posts: [], draft: null } : { ...data, draft: p.draft }, (m) => this.toast(m), () => {
      if (imported) return;
      imported = true;
      deleteSavedAccount(p.email);
      if (this._sync === sync) this.toast('Your AI talents from this browser are now saved to your account.');
    });
    this._sync = sync;
    this._lastLoad = Date.now();
    this.setState((s) => ({ ...start, jobs: { ...s.jobs, home: { phase: 'done' } } }), () => {
      this.finishReturn();
      this.movePicturesToStorage();
      this.refreshStale();
    });
  }

  /** Older talents kept their picture inline. Move each one to the storage bucket once. */
  async movePicturesToStorage() {
    for (const t of this.state.talents) {
      if (!t.pic || !t.pic.startsWith('data:')) continue;
      const r = await backend.uploadPicture(t.pic);
      if (r.ok) this.upd(t.id, (x) => (x.pic === t.pic ? { ...x, pic: r.data } : x));
    }
  }

  /** Home "Try again": reload the agency from the database, or rerun the demo load. */
  retryHome() {
    if (!this.state.cloud) { this.runJob('home'); return; }
    backend.currentProfile().then((r) => {
      if (!r.ok) { this.toast(r.error); return; }
      if (r.data) this.enterCloud(r.data); else this.logOut(false);
    });
  }

  async submitLogin() {
    const a = this.state.auth;
    this._demoRun = false;
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
    this._demoRun = false;
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
    if (this.state.cloud && keepAccount && this._sync) {
      // Save anything still waiting first. If that fails, stay signed in so nothing is lost.
      const sync = this._sync;
      sync.flush().then((ok) => {
        if (this._sync !== sync) return;
        if (ok) this.logOut(false);
        else this.toast('The app could not save your last change, so you are still logged in. Check your connection and try again.');
      });
      return;
    }
    Object.keys(this.timers).forEach((k) => this.clearJob(k));
    if (this.state.cloud) {
      this._sync?.stop();
      this._sync = undefined;
      backend.signOut();
    } else if (keepAccount && this.state.signedIn && !this._demoRun) {
      saveAccount(this.state.user.email, this.withDraft(this.state), ACCOUNT_KEYS);
    }
    this.setState({ signedIn: false, cloud: false, userId: null, authBusy: false, route: 'start', user: { name: 'Mika Santos', email: 'mika.santos@email.com' }, agencyName: "Mika's Talent House", talents: [], pitches: [], posts: [], draft: null, form: null, ov: null, acctMenu: false, jobs: {}, ui: {}, renameVal: '', editedAfterApprove: false, histTab: 'all', calMonth: null, calSel: null, calFilter: null });
  }
  /** Delete the agency and everything in it, then log out. */
  async deleteAccount() {
    const email = this.state.user.email;
    if (this.state.cloud) {
      // Saving stays on until the delete succeeds, so a failed delete loses nothing.
      this.toast('Deleting your account…');
      const r = await backend.deleteAccount();
      if (!r.ok) { this.toast(r.error); return; }
      this._sync?.stop();
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
    this.refreshStale(id);
    if (tab === 'grow' && !t.growLoaded && t.accounts.some((a) => a.mode === 'live') && this.job('grow-' + id).phase !== 'loading') {
      if (t.ideas.some((i) => i.status === 'new')) this.runJob('grow-' + id, () => this.upd(id, (x) => ({ ...x, growLoaded: true })));
      else this.moreIdeas(id);
    }
    if (tab === 'content' && !t.contentLoaded && this.job('content-' + id).phase !== 'loading') {
      if (t.content && t.content.length) this.runJob('content-' + id, () => this.upd(id, (x) => ({ ...x, contentLoaded: true })));
      else this.moreContentIdeas(id);
    }
    if (tab === 'scout' && !t.scoutLoaded && this.job('scout-' + id).phase !== 'loading') this.scoutBrands(id);
  }

  moreIdeas(id: string) {
    const t0 = this.T(id);
    if (!t0) return;
    this.agentJob('grow-' + id, () => agents.grow(t0), (r) => this.upd(id, (t) => {
      const add = this.freshIdeas(t, r.ideas);
      if (!add.length) setTimeout(() => this.toast('There are no new ideas now. Try again after your next post.'), 0);
      return { ...t, growLoaded: true, few: r.few, ideas: add.concat(t.ideas) };
    }), () => this.upd(id, (t) => {
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

  /** Scout: brand ideas that fit the talent. Works without a connected account. */
  scoutBrands(id: string) {
    const t0 = this.T(id);
    if (!t0) return;
    this.agentJob('scout-' + id, () => agents.scout(t0), (r) => this.upd(id, (t) => {
      const used = new Set(t.brands.map((b) => b.name.toLowerCase()));
      const add = r.brands.filter((b) => !used.has(b.name.toLowerCase())).map((b) => ({ id: uid('b'), flagged: false, ...b }));
      return { ...t, scoutLoaded: true, brands: t.brands.concat(add) };
    }), () => this.upd(id, (x) => ({ ...x, scoutLoaded: true, brands: x.brands.length ? x.brands : genBrands(x).map((b) => ({ ...b, flagged: false })) })));
  }

  moreContentIdeas(id: string) {
    const t0 = this.T(id);
    if (!t0) return;
    this.agentJob('content-' + id, () => agents.content(t0), (r) => this.upd(id, (t) => {
      const used = new Set((t.content || []).map((c) => c.title.toLowerCase()));
      const add: ContentIdea[] = r.ideas.filter((c) => !used.has(c.title.toLowerCase())).map((c, i) => ({ id: uid('c'), status: 'new' as const, flagged: false, date: Date.now() - i * 1000, ...c }));
      if (!add.length) setTimeout(() => this.toast('There are no new content ideas now. Try again after your next post.'), 0);
      return { ...t, contentLoaded: true, content: add.concat(t.content || []) };
    }), () => this.upd(id, (t) => {
      const used = new Set((t.content || []).map((c) => c.title));
      const add: ContentIdea[] = (t.content && t.content.length ? moreContent(t) : genContent(t)).filter((c) => !used.has(c.title)).map((c) => ({ id: uid('c'), status: 'new' as const, flagged: false, date: Date.now(), ...c }));
      if (!add.length) setTimeout(() => this.toast('There are no new content ideas now. Try again after your next post.'), 0);
      return { ...t, contentLoaded: true, content: add.concat(t.content || []) };
    }));
  }

  // ---- Calendar ----------------------------------------------------------------
  openSchedule(opts?: { postId?: string; tid?: string; cid?: string; date?: string }) {
    const o = opts || {};
    const T = this.state.talents;
    // A post needs an AI talent: with none, the form could never be saved.
    if (!T.length) { this.toast('Add an AI talent first. Then you can plan its posts.', { label: 'Add AI talent', run: () => this.openForm('new') }); return; }
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
    const at = this.state.posts.findIndex((x) => x.id === pid);
    const c0 = p && p.contentId ? (this.T(p.talentId)?.content || []).find((c) => c.id === p.contentId) : undefined;
    this.setState((s) => ({
      posts: patch ? s.posts.map((x) => (x.id === pid ? { ...x, ...patch } : x)) : s.posts.filter((x) => x.id !== pid),
      talents: p && p.contentId ? s.talents.map((t) => (t.id !== p.talentId ? t : { ...t, content: (t.content || []).map((c) => (c.id !== p.contentId ? c : { ...c, status: patch && patch.status === 'posted' ? 'posted' as const : patch ? c.status : 'new' as const, date: Date.now() })) })) : s.talents,
    }));
    if (!msg) return;
    // Undo puts the post (and its content idea) back as they were.
    this.toast(msg, p ? { label: 'Undo', run: () => {
      this.setState((s) => {
        const posts = s.posts.some((x) => x.id === pid) ? s.posts.map((x) => (x.id === pid ? p : x)) : [...s.posts.slice(0, at), p, ...s.posts.slice(at)];
        const talents = c0 ? s.talents.map((t) => (t.id !== p.talentId ? t : { ...t, content: (t.content || []).map((c) => (c.id === c0.id ? c0 : c)) })) : s.talents;
        return { posts, talents };
      });
      this.toast('Undone.');
    } } : undefined);
  }

  // ---- Content and Grow ------------------------------------------------------------
  setContent(tid: string, cid: string, status: ContentIdea['status']) {
    const c0 = (this.T(tid)?.content || []).find((c) => c.id === cid);
    this.upd(tid, (t) => ({ ...t, content: (t.content || []).map((c) => (c.id === cid ? { ...c, status, date: Date.now() } : c)) }));
    const undo = c0 ? { label: 'Undo', run: () => { this.upd(tid, (t) => ({ ...t, content: (t.content || []).map((c) => (c.id === cid ? c0 : c)) })); this.toast('Undone.'); } } : undefined;
    this.toast(status === 'planned' ? 'Added to your plan.' : status === 'posted' ? 'Marked as posted.' : 'Dismissed. You can bring it back from History.', undo);
  }

  /** Copy, then say "Copied" or tell the student to copy the text by hand. */
  private async copyAndTell(text: string, done: string) {
    const ok = await copyText(text);
    this.toast(ok ? done : 'The app could not copy the text. Select the text and copy it yourself.');
  }

  copyPrompt(t: Talent, c: ContentIdea) {
    const p = genPrompt(t, c);
    this.copyAndTell(p.text, p.kind + ' copied. Paste it into your video tool.');
  }

  copyBrief(c: ContentIdea) {
    const txt = c.title + '\n' + c.format + ' · ' + c.platform + ' · ' + c.length + '\nHook: ' + c.hook + '\n' + c.beats.map((b, i) => (i + 1) + '. ' + b).join('\n') + '\nPost: ' + c.when;
    this.copyAndTell(txt, 'Brief copied.');
  }

  setIdea(tid: string, iid: string, status: 'done' | 'dismissed') {
    const i0 = this.T(tid)?.ideas.find((i) => i.id === iid);
    this.upd(tid, (t) => ({ ...t, ideas: t.ideas.map((i) => (i.id === iid ? { ...i, status, date: Date.now() } : i)) }));
    const undo = i0 ? { label: 'Undo', run: () => { this.upd(tid, (t) => ({ ...t, ideas: t.ideas.map((i) => (i.id === iid ? i0 : i)) })); this.toast('Undone.'); } } : undefined;
    this.toast(status === 'done' ? 'Marked as done.' : 'Dismissed. You can bring it back from History.', undo);
  }

  /** History: bring a dismissed growth or content idea back to its tab. */
  restoreIdea(tid: string, id: string, kind: 'idea' | 'content') {
    this.upd(tid, (t) => (kind === 'idea'
      ? { ...t, ideas: t.ideas.map((i) => (i.id === id ? { ...i, status: 'new' as const, date: Date.now() } : i)) }
      : { ...t, content: (t.content || []).map((c) => (c.id === id ? { ...c, status: 'new' as const, date: Date.now() } : c)) }));
    this.toast('The idea is back.');
  }

  // ---- Pitch ----------------------------------------------------------------------
  draftPitch(tid: string, bid: string) {
    const ex = this.state.pitches.find((p) => p.talentId === tid && p.brandId === bid);
    if (ex) { this.go('pitch', { pitchId: ex.id }); return; }
    const t = this.T(tid)!;
    const b = t.brands.find((x) => x.id === bid)!;
    const id = uid('p');
    // Write once the new pitch is in state: writePitch reads it from there.
    this.setState((s) => ({ pitches: [{ id, talentId: tid, brandId: bid, brandName: b.name, status: 'writing' as const, flagged: false, date: Date.now(), pitch: '', profile: '' }, ...s.pitches] }), () => this.writePitch(id));
    this.go('pitch', { pitchId: id });
  }

  writePitch(id: string) {
    const p0 = this.state.pitches.find((x) => x.id === id);
    const t0 = p0 && this.T(p0.talentId);
    const b0 = t0 && t0.brands.find((x) => x.id === p0!.brandId);
    if (!p0 || !t0 || !b0) return;
    const sender = { name: this.state.user.name, agency: this.state.agencyName };
    this.agentJob('pitch-' + id, () => agents.pitch(t0, b0, sender), (r) => this.updPitch(id, { pitch: r.pitch, profile: r.profile, status: 'draft', date: Date.now() }), () => this.setState((s) => ({
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
    // A sent pitch is the record of what went to the brand, so it stays as it was.
    if (p.status === 'sent') return;
    const patch: Partial<Pitch> = { [field]: val };
    if (p.status === 'approved') { patch.status = 'draft'; this.setState({ editedAfterApprove: true }); }
    this.updPitch(id, patch);
  }

  copyPitch(p: Pitch) {
    this.copyAndTell(p.pitch + '\n\n---\nTalent profile\n' + p.profile, 'Copied. Paste it into your email or app. Then send it.');
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
    this.setState((s) => ({ ov: { kind: 'connect', tid, platform: a ? a.platform : (plat || PLATFORMS[0]), chosen: !!plat, handle: '', reId: reAcc || null }, jobs: { ...s.jobs, connect: { phase: 'idle' } } }));
  }

  /**
   * The talent with a new account list, and its numbers worked out again. Real reads add up
   * (combineStats); a talent with only simulated accounts keeps its simulated numbers.
   */
  withAccounts(t: Talent, accounts: Account[]): Talent {
    const live = accounts.some((a) => a.mode === 'live');
    return { ...t, accounts, stats: combineStats(accounts) || (live && this.simulated ? t.stats : null) };
  }

  /** Local demo or ?simulate: accounts and agents may be simulated. Signed in, every number is real. */
  get simulated() {
    return !this.state.cloud || (this.props.simulate ?? 'normal') !== 'normal';
  }

  /** The account fields from a real read. */
  private readFields(r: AccountRead): Pick<Account, 'handle' | 'ref' | 'mode' | 'status' | 'readAt' | 'updated' | 'stats' | 'top' | 'recent'> {
    return { handle: r.handle, ref: r.ref, mode: 'live', status: 'ok', readAt: Date.now(), updated: 0, stats: r.stats, top: r.top || [], recent: r.recent || [] };
  }

  /**
   * Connect (or reconnect) the account in the connect overlay. YouTube is read by its handle; Instagram and
   * Facebook go through their login page first, which comes back with one ref or more (Facebook: one per Page).
   */
  connectNow() {
    const o = this.state.ov;
    if (!o) return;
    if (LOGIN_PLATFORMS.includes(o.platform) && !o.ref) { this.startLogin(o); return; }
    const t0 = this.T(o.tid);
    const re = o.reId ? t0?.accounts.find((a) => a.id === o.reId) : undefined;
    // Refs from a login page win, then a handle typed in the overlay; a reconnect without either reads the same account again.
    const typed = (o.handle || '').trim();
    const reads: { handle?: string; ref?: string }[] = o.ref
      ? String(o.ref).split(',').map((ref) => ({ ref }))
      : [typed ? { handle: typed } : re?.ref ? { ref: re.ref } : { handle: re?.handle || '' }];
    if (this.state.cloud && o.platform === 'YouTube' && !reads[0].handle && !reads[0].ref) return;
    // Closing the overlay while it connects cancels the connect.
    const open = () => this.state.ov?.kind === 'connect';
    this.liveJob('connect', () => Promise.all(reads.map((by) => accounts.read(o.platform, by))), (rs) => {
      if (!open()) return;
      // Facebook returns every Page the student ever shared with the app, so the student picks this talent's Page.
      if (rs.length > 1) { this.setState((s) => ({ ov: { ...s.ov, pick: rs } })); return; }
      this.addReads(o, rs);
    }, () => { if (open()) this.mockConnect(o); }, () => {
      // After a login page, Try again must open the login page again, not repeat this read.
      if (o.ref && open()) this.setState((s) => ({ ov: { ...s.ov, ref: null } }));
    });
  }

  /** Add (or update) the accounts from real reads on the overlay's talent, then close the overlay. */
  private addReads(o: any, rs: AccountRead[]) {
    this.upd(o.tid, (t) => {
      let accs = t.accounts;
      rs.forEach((r, i) => {
        // A reconnect updates its account; connecting an account the talent already has updates it instead of adding a copy.
        const target = (i === 0 && o.reId) || accs.find((a) => a.platform === o.platform && a.ref === r.ref)?.id;
        accs = target
          ? accs.map((a) => (a.id === target ? { ...a, ...this.readFields(r) } : a))
          : accs.concat([{ id: uid('a'), platform: o.platform, ...this.readFields(r) }]);
      });
      // The real Grow agent writes the first ideas when the Grow tab opens.
      return { ...this.withAccounts(t, accs), few: rs.every((r) => r.few), growLoaded: t.ideas.length ? t.growLoaded : false };
    });
    this.setState({ ov: null });
    this.toast((o.reId ? 'Reconnected ' : 'Connected ') + o.platform + ' ' + rs.map((r) => r.handle).join(' and ') + '.');
  }

  /** The student picked which of the returned accounts (Facebook Pages) belongs to this talent. */
  pickAccount(i: number) {
    const o = this.state.ov;
    const r = o?.pick?.[i];
    if (!r) return;
    if (o.tid === FORM_TID) { this.setFormAcc(o.platform, { handle: r.handle, phase: 'on', read: r, readAt: Date.now() }); this.setState({ ov: null }); return; }
    this.addReads(o, [r]);
  }

  /**
   * Send the browser to a platform's login page. Saves pending changes first, because the app reloads
   * when the platform sends the student back.
   */
  private startLogin(o: any) {
    if (this.state.cloud && !this._statusKnown) { this._status.then(() => this.startLogin(o)); return; }
    // Signed out, under ?simulate, or a platform the server does not read: the simulated connect.
    if (!this.loginPlatform(o.platform)) { this.runJob('connect', () => this.mockConnect(o)); return; }
    this.setState({ ov: null });
    this.goLogin(o.platform, o.tid, o.reId || null, this.loginTab());
  }

  /**
   * Connect (or Reconnect) one platform on the Accounts tab. Instagram and Facebook open their login tab
   * at once, with no dialog. YouTube needs a handle, so it and the simulated platforms use the connect dialog.
   */
  connectAccount(tid: string, platform: Platform, reAcc: string | null = null) {
    if (!this.loginPlatform(platform)) { this.openConnect(tid, reAcc, platform); return; }
    this.goLogin(platform, tid, reAcc, this.loginTab());
  }

  /**
   * Send a platform's login page to `tab` (opened during the click), or to this tab when the browser
   * blocked the new one. Saves pending changes first, because a login in this tab reloads the app.
   */
  private async goLogin(pl: Platform, tid: string, reId: string | null, tab: Window | null) {
    try {
      // This tab may leave for the login page, so everything must be saved first.
      if (this._sync && !(await this._sync.flush())) {
        tab?.close();
        this.toast('The app could not save your last change. Check your connection, then try again.');
        return;
      }
      const r = await accounts.startLogin(pl, tid, reId, !!tab);
      if (!tab) { window.location.assign(r.url); return; }
      // A second Log in for the same account replaces the first one's login cookie (see tabReturn).
      const prev = this._waiting;
      const n = prev && prev.platform === pl && prev.sent === tid ? prev.n + 1 : 1;
      this._waiting = { platform: pl, tid: n > 1 && prev ? prev.tid : tid, sent: tid, n };
      tab.location.href = r.url;
      this.toast('Log in to ' + pl + ' in the new tab.');
    } catch (e) {
      tab?.close();
      const code = e instanceof AgentCallError ? e.code : 'server';
      if (code === 'unauthorized') { this.sessionEnded(); return; }
      this.toast(code === 'wrong_origin' && e instanceof Error ? e.message : "I couldn't open the " + pl + ' login page. ' + errorText(code));
    }
  }

  /** The message for a login page that came back without an account. */
  private loginError(pl: Platform, error: string | null) {
    return error === 'denied' ? pl + ' was not connected. You can try again.'
      : error === 'no_pages' ? 'No Facebook Page was shared. Try again and pick a Page you manage.'
      : "I couldn't connect " + pl + '. Try again.';
  }

  /**
   * A new tab for a platform's login page, so this tab keeps its place. It must open during the click,
   * or the browser blocks it. Null when blocked: the login then runs in this tab.
   */
  private loginTab(): Window | null {
    try {
      const tab = window.open('', '_blank');
      // The login page must not be able to move this tab.
      if (tab) tab.opener = null;
      return tab;
    } catch {
      return null;
    }
  }

  /** The result from a login tab: finish the connect in this tab, as after a login in this tab. */
  private tabReturn(d: any) {
    const w = this._waiting;
    if (!w || !d || typeof d !== 'object') return;
    const platform = (d.connected || d.platform) as Platform;
    if (platform !== w.platform || d.tid !== w.sent) return;
    // The student pressed Log in twice: the first login tab ends with "expired"; the second one counts.
    if (d.connect_error === 'expired' && w.n > 1) { this._waiting = { ...w, n: w.n - 1 }; return; }
    this._waiting = null;
    const ref = d.connected && typeof d.ref === 'string' ? d.ref : null;
    this._return = { platform, tid: w.tid, re: typeof d.re === 'string' ? d.re : null, ref, error: ref ? null : d.connect_error || 'failed' };
    this.finishReturn();
  }

  /** Read and forget the ?connected=… or ?connect_error=… that a platform login page sent back. */
  private readReturn(): AgencyApp['_return'] {
    try {
      const q = new URLSearchParams(window.location.search);
      const connected = q.get('connected');
      const error = q.get('connect_error');
      const platform = (connected || q.get('platform')) as Platform | null;
      const tid = q.get('tid');
      if (!platform || !tid || (!connected && !error)) return null;
      const ref = connected ? q.get('ref') : null;
      const out = { platform, tid, re: q.get('re'), ref, error: ref ? null : error || 'failed' };
      for (const k of ['connected', 'connect_error', 'platform', 'tid', 're', 'ref']) q.delete(k);
      const rest = q.toString();
      window.history.replaceState(null, '', window.location.pathname + (rest ? '?' + rest : ''));
      return out;
    } catch {
      return null;
    }
  }

  /** After the agency loads: finish the connect that a platform login page sent back, on the talent's Accounts tab. */
  private finishReturn() {
    const r = this._return;
    this._return = null;
    if (!r) return;
    if (r.tid === FORM_TID) { this.finishFormReturn(r); return; }
    const t = this.T(r.tid);
    if (!t) { this.toast("I couldn't find that AI talent. Connect the account again."); return; }
    const reId = r.re && t.accounts.some((a) => a.id === r.re) ? r.re : null;
    this.openTalent(t.id, 'accounts');
    if (r.error || !r.ref) { this.toast(this.loginError(r.platform, r.error)); return; }
    const o = { kind: 'connect', tid: t.id, platform: r.platform, chosen: true, handle: '', reId };
    this.toast('Connecting ' + r.platform + '…');
    Promise.all(r.ref.split(',').map((ref) => accounts.read(r.platform, { ref }))).then((rs) => {
      // Facebook returns every Page the student shared with the app, so the student picks this talent's Page.
      if (rs.length > 1) { this.setState((s) => ({ ov: { ...o, pick: rs }, jobs: { ...s.jobs, connect: { phase: 'idle' } } })); return; }
      this.addReads(o, rs);
    }, (e) => this.callFailed(e, 'that ' + r.platform + ' account'));
  }

  /**
   * Back from a login page opened in the new AI talent form: read the account into step 2. After a login
   * in a new tab the form is still open; after a login in this tab, the form comes back from the draft.
   */
  private finishFormReturn(r: NonNullable<AgencyApp['_return']>) {
    const here = this.state.route === 'form' && this.state.form?.mode === 'new';
    if (!here && !this.state.draft) { this.toast("I couldn't find the AI talent you were adding. Start it again."); return; }
    if (!here) this.openForm('new');
    this.setState((s) => (s.form ? { form: { ...s.form, step: 2, resumed: false } } : null));
    const pl = r.platform;
    if (r.error || !r.ref) { this.toast(this.loginError(pl, r.error)); return; }
    this.setFormAcc(pl, { handle: '', phase: 'loading' });
    Promise.all(r.ref.split(',').map((ref) => accounts.read(pl, { ref }))).then((rs) => {
      if (rs.length === 1) { this.setFormAcc(pl, { handle: rs[0].handle, phase: 'on', read: rs[0], readAt: Date.now() }); return; }
      // Facebook returns every Page the student shared with the app, so the student picks this talent's Page.
      this.setFormAcc(pl, null);
      this.setState((s) => ({ ov: { kind: 'connect', tid: FORM_TID, platform: pl, handle: '', reId: null, pick: rs }, jobs: { ...s.jobs, connect: { phase: 'idle' } } }));
    }, (e) => {
      this.setFormAcc(pl, null);
      this.callFailed(e, 'that ' + pl + ' account');
    });
  }

  /** The prototype's simulated connect: made-up numbers and starter ideas. Signed in, the account is added by handle instead. */
  private mockConnect(o2: any) {
    if (!this.simulated) { this.handleConnect(o2); return; }
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

  /**
   * Signed in, accounts read more than a day ago are read again in the background, so "this week" stays
   * this week and an expired login shows up without a click. Each account is tried once per session.
   */
  refreshStale(tid?: string) {
    if (!this.state.cloud || (this.props.simulate ?? 'normal') !== 'normal') return;
    const old = Date.now() - 24 * HOUR;
    for (const t of this.state.talents) {
      if (tid && t.id !== tid) continue;
      for (const a0 of t.accounts) {
        if (a0.mode !== 'live' || a0.status !== 'ok' || !a0.ref || !a0.readAt || a0.readAt > old || this._staleTried.has(a0.id)) continue;
        this._staleTried.add(a0.id);
        this.liveJob('refresh-' + a0.id, () => accounts.read(a0.platform, { ref: a0.ref }), (r) => {
          this.upd(t.id, (x) => ({ ...this.withAccounts(x, x.accounts.map((a) => (a.id === a0.id ? { ...a, ...this.readFields(r) } : a))), few: r.few }));
        }, () => {}, (code) => {
          // The account is gone or its access stopped: keep its last good numbers and ask for Reconnect.
          if (code === 'not_found' || code === 'reconnect') this.upd(t.id, (x) => ({ ...x, accounts: x.accounts.map((a) => (a.id === a0.id ? { ...a, status: 'lost' as const } : a)) }));
        });
      }
    }
  }
  private _staleTried = new Set<string>();
  private _demoRun = false;

  refreshAccount(tid: string, aid: string) {
    const a0 = this.T(tid)?.accounts.find((x) => x.id === aid);
    if (!a0) return;
    const mock = () => {
      this.upd(tid, (t) => ({ ...t, accounts: t.accounts.map((a) => (a.id === aid ? { ...a, updated: 0 } : a)) }));
      this.toast('Numbers updated.');
    };
    // Accounts from before the real connect have no ref, so they stay simulated.
    if (!a0.ref) { this.runJob('refresh-' + aid, mock); return; }
    this.liveJob('refresh-' + aid, () => accounts.read(a0.platform, { ref: a0.ref }), (r) => {
      this.upd(tid, (t) => ({ ...this.withAccounts(t, t.accounts.map((a) => (a.id === aid ? { ...a, ...this.readFields(r) } : a))), few: r.few }));
      this.toast('Numbers updated.');
    }, mock, (code) => {
      // The account is gone or its access stopped: keep its last good numbers and ask for Reconnect.
      if (code === 'not_found' || code === 'reconnect') this.upd(tid, (t) => ({ ...t, accounts: t.accounts.map((a) => (a.id === aid ? { ...a, status: 'lost' as const } : a)) }));
      else if (code !== 'no_key' && code !== 'not_configured') this.toast(errorText(code, 'that ' + a0.platform + ' account'));
    });
  }

  disconnectAccount(tid: string, aid: string) {
    const t = this.T(tid);
    const a = t?.accounts.find((x) => x.id === aid);
    this.upd(tid, (x) => this.withAccounts(x, x.accounts.filter((y) => y.id !== aid)));
    if (this.state.cloud && a) this.forgetUnused([a], tid);
    this.setState({ ov: null });
    if (a) this.toast(a.platform + ' ' + a.handle + ' was removed.');
  }

  /** The server forgets a login platform's token once no other talent uses that account. `tid` is the talent losing them. */
  private forgetUnused(gone: Account[], tid: string) {
    for (const a of gone) {
      if (!LOGIN_PLATFORMS.includes(a.platform) || !a.ref) continue;
      const used = this.state.talents.some((x) => x.id !== tid && x.accounts.some((y) => y.platform === a.platform && y.ref === a.ref));
      if (!used) accounts.forget(a.platform, a.ref).catch(() => {});
    }
  }

  deleteTalent() {
    const id = this.state.ov.tid;
    const t = this.T(id)!;
    this.setState((s) => ({ talents: s.talents.filter((x) => x.id !== id), pitches: s.pitches.filter((p) => p.talentId !== id), posts: s.posts.filter((p) => p.talentId !== id), ov: null }));
    if (this.state.cloud) {
      backend.removePicture(t.pic);
      this.forgetUnused(t.accounts, id);
    }
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

  /** Throw away the kept new-talent draft and start an empty form. */
  startOverForm() {
    this.setState({ draft: null, form: { mode: 'new', name: '', niche: '', story: '', pic: null, color: this.nextColor(), resumed: false, step: 1 } });
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

  /** Signed in, a platform the server cannot read: keep the account by its handle, with no numbers. */
  private handleConnect(o: any) {
    const t = this.T(o.tid);
    const re = o.reId ? t?.accounts.find((a) => a.id === o.reId) : undefined;
    const typed = (o.handle || '').trim();
    const raw = typed || re?.handle || '';
    if (!raw) { this.toast('Type the ' + o.platform + ' handle first.'); return; }
    const handle = raw[0] === '@' ? raw : '@' + raw;
    this.upd(o.tid, (x) => this.withAccounts(x, re
      ? x.accounts.map((a) => (a.id === re.id ? { ...a, handle, mode: 'handle' as const, status: 'ok' as const } : a))
      : x.accounts.concat([{ id: uid('a'), platform: o.platform, handle, mode: 'handle', status: 'ok' }])));
    this.setState({ ov: null });
    this.toast('The app cannot read ' + o.platform + ' yet, so ' + handle + ' is added by handle, with no numbers.');
  }

  /** Whether this platform connects through its login page here (signed in, and the server reads it). */
  loginPlatform(pl: string) {
    return !!this.state.cloud && (this.props.simulate ?? 'normal') === 'normal'
      && LOGIN_PLATFORMS.includes(pl as Platform) && this._live.includes(pl as Platform);
  }

  /** Set (or with null, clear) one account row of the new AI talent form. */
  setFormAcc(pl: string, v: any) {
    this.setState((s) => {
      if (!s.form) return null;
      const accs = { ...(s.form.accs || {}) };
      if (v) accs[pl] = v; else delete accs[pl];
      return { form: { ...s.form, accs } };
    });
  }

  /**
   * Open a platform's login page from the new AI talent form, in a new tab. The login tab sends its result
   * back (tabReturn), and the account goes into step 2. If the browser blocks the tab, the login runs in
   * this tab and the form comes back from the draft (finishFormReturn).
   */
  private formLogin(pl: Platform) {
    const tab = this.loginTab();
    this.setState((s) => (s.form ? { form: { ...s.form, accs: { ...(s.form.accs || {}), [pl]: { handle: '', phase: 'loading' } } } } : null), async () => {
      // Without a new tab the browser leaves this page; goLogin saves the draft first.
      await this.goLogin(pl, FORM_TID, null, tab);
      this.setFormAcc(pl, null);
    });
  }

  formConnect(pl: string) {
    if (this.state.cloud && !this._statusKnown) { this._status.then(() => this.formConnect(pl)); return; }
    if (this.loginPlatform(pl)) { this.formLogin(pl as Platform); return; }
    const f = this.state.form;
    const acc = (f.accs || {})[pl] || {};
    const h = (acc.handle || '').trim();
    if (!h) return;
    const handle = h[0] === '@' ? h : '@' + h;
    const setAcc = (v: any) => this.setFormAcc(pl, v);
    setAcc({ handle, phase: 'loading' });
    const mock = () => {
      if (this.simulated) { setTimeout(() => setAcc({ handle, phase: 'on' }), 1100); return; }
      setAcc({ handle, phase: 'on', byHandle: true });
      this.toast('The app cannot read ' + pl + ' yet, so ' + handle + ' is added by handle, with no numbers.');
    };
    if (this.simulated) { mock(); return; }
    // Signed in: read the account for real. The numbers are kept until the talent is saved.
    accounts.read(pl as Account['platform'], { handle }).then(
      (r) => setAcc({ handle: r.handle, phase: 'on', read: r, readAt: Date.now() }),
      (e) => {
        const code = e instanceof AgentCallError ? e.code : 'server';
        if (code === 'no_key' || code === 'not_configured') { mock(); return; }
        setAcc({ handle, phase: 'idle' });
        this.callFailed(e, pl + ' ' + handle);
      },
    );
  }

  /**
   * Fill in the niche and character story from the accounts (new talent: step 2's accounts; edit: the talent's own).
   * Signed in with the real agents, the Profile agent reads the accounts' bios and posts. Otherwise the
   * prototype's text stands in.
   */
  formFill(src: { platform: string; handle: string; ref?: string }[]) {
    const f = this.state.form;
    if (!f || !src.length || f.filling) return;
    // The student can leave the form while it fills; the answer then goes nowhere.
    const same = (cur: any) => !!cur && cur.mode === f.mode && cur.id === f.id;
    const done = (d: { niche: string; story: string }) => this.setState((s) => (same(s.form)
      ? { form: { ...s.form, filling: false, filled: src.map((a) => a.handle).join(', '), niche: d.niche, story: d.story } } : null));
    const mock = () => setTimeout(() => done(draftFromAccounts(f.name, src)), 1600);
    this.setForm('filling', true);
    if (!this.state.cloud || !this._agentsOn || (this.props.simulate ?? 'normal') !== 'normal') { mock(); return; }
    // Fill in again must give a new story, not the one on screen.
    const avoid = f.filled && f.story ? [f.story] : [];
    agents.profile((f.name || '').trim() || 'This AI talent', src as { platform: Platform; handle: string; ref?: string }[], avoid).then(done, (e) => {
      const code = e instanceof AgentCallError ? e.code : 'server';
      if (code === 'no_key') { this._agentsOn = false; mock(); return; }
      this.setState((s) => (same(s.form) ? { form: { ...s.form, filling: false } } : null));
      if (code === 'unauthorized') { this.sessionEnded(); return; }
      this.toast(code === 'timeout' ? 'Filling it in took too long. Try again.' : "I couldn't fill it in from the accounts. " + errorText(code));
    });
  }

  setForm(k: string, v: any) { this.setState((s) => ({ form: { ...s.form, [k]: v } })); }

  async saveForm() {
    if (this.state.ui.formSaving) return;
    let f = this.state.form;
    // Signed in: the picture goes to the storage bucket, and the talent keeps only its URL.
    if (this.state.cloud && typeof f.pic === 'string' && f.pic.startsWith('data:')) {
      this.setUi({ formSaving: true });
      this.toast('Uploading the picture…');
      const r = await backend.uploadPicture(f.pic);
      this.setUi({ formSaving: false });
      if (!r.ok) { this.toast(r.error); return; }
      f = { ...f, pic: r.data };
    }
    if (f.mode === 'edit') {
      const oldPic = this.T(f.id)?.pic;
      this.upd(f.id, (t) => ({ ...t, name: f.name.trim(), niche: f.niche.trim(), story: f.story.trim(), pic: f.pic, color: f.color || t.color }));
      if (this.state.cloud && oldPic && oldPic !== f.pic) backend.removePicture(oldPic);
      this.go('talent', { talentId: f.id, _saved: true });
      this.toast('Saved.');
      return;
    }
    const onAccs = Object.entries<any>(f.accs || {}).filter(([, a]) => a.phase === 'on');
    const fAccs: Account[] = onAccs.map(([platform, a]) => ({ id: uid('a'), platform: platform as any, ...(a.read ? { ...this.readFields(a.read), readAt: a.readAt } : { handle: a.handle, mode: a.byHandle ? 'handle' as const : 'live' as const, status: 'ok' as const, updated: 0 }) }));
    const real = combineStats(fAccs);
    const few = onAccs.some(([, a]) => a.read) ? onAccs.some(([, a]) => a.read?.few) : true;
    const t: Talent = { id: uid('t'), name: f.name.trim(), niche: f.niche.trim(), story: f.story.trim(), pic: f.pic, color: f.color || this.nextColor(), tint: TINTS[this.state.talents.length % TINTS.length], accounts: fAccs, stats: real || (fAccs.length && this.simulated ? { posts: [6, 4], views: [5200, 4100], eng: [6.1, 5.5], time: [40, 31], taken: MONTHS[new Date().getMonth()] + ' ' + new Date().getDate() } : null), ideas: [], brands: [], few, growLoaded: false, scoutLoaded: false };
    // Signed in with real agents: Scout writes the brand ideas when the Scout tab opens.
    t.brands = this.state.cloud && this._agentsOn ? [] : genBrands(t).map((b) => ({ ...b, flagged: false }));
    if (fAccs.length && !(real && this._agentsOn)) t.ideas = starterIdeas(t).map((x, i) => ({ id: uid('i'), status: 'new' as const, flagged: false, date: Date.now() - i * 60000, ...x }));
    this.setState((s) => ({ talents: s.talents.concat([t]), draft: null }));
    // A login tab still open for this form: its account goes to the saved talent.
    const w = this._waiting;
    if (w && w.sent === FORM_TID) this._waiting = { ...w, tid: t.id };
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
    const SL = ['Morning', 'Noon', 'Evening', 'Night'];
    const split = (tot: number, k: number) => {
      const ws = Array.from({ length: k }, () => 0.6 + rnd());
      const sm = ws.reduce((a, b) => a + b, 0);
      return ws.map((w) => Math.round(tot * w / sm));
    };
    const LOGO: Record<string, string> = { TikTok: '/assets/p-tiktok.png', Instagram: '/assets/p-instagram.png', Facebook: '/assets/p-facebook.png', YouTube: '/assets/p-youtube.png' };
    // A talent with real and simulated accounts uses the real ones only.
    const anyRead = t.accounts.some((a) => a.mode === 'live' && a.stats);
    const live = t.accounts.filter((a) => a.mode === 'live' && (!anyRead || a.stats));
    const handle = t.accounts.filter((a) => a.mode === 'handle');
    const shades = [col, col + '99', col + '55', col + '33'];
    // Accounts read for real have their own numbers and posts. Simulated accounts get made-up ones.
    const real = live.length > 0 && live.every((a) => a.stats);
    // Accounts read before the app kept posts have none until their next read.
    const stale = real && !live.some((a) => a.recent);
    const posts = real ? live.flatMap((a) => a.recent || []) : [];

    // Views each day, for all platforms or the one picked in the dropdown.
    const dayIx = (ms: number) => (new Date(ms).getDay() + 6) % 7;
    const daily = dailyByPlatform(t);
    const labels = daily.labels;
    const plat = daily.lines.some((l) => l.platform === this.state.anPlat) ? this.state.anPlat! : '';
    const on = daily.lines.filter((l) => !plat || l.platform === plat);
    const now = labels.map((_, i) => on.reduce((n, l) => n + l.now[i], 0));
    const prev = labels.map((_, i) => on.reduce((n, l) => n + l.prev[i], 0));
    const platPick = {
      has: daily.lines.length > 1, value: plat,
      opts: [{ v: '', label: 'All platforms' }, ...daily.lines.map((l) => ({ v: l.platform, label: l.platform }))],
      change: (e: ChangeEvent<HTMLSelectElement>) => this.setState({ anPlat: e.target.value }),
    };
    const peak = Math.max(...now, ...prev, 10);
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
    const dayNote = stale ? 'Refresh the accounts to see the views of each day.'
      : real && !now[bi] ? 'No views on posts from the last 7 days yet.'
      : real ? 'Best day: ' + labels[bi] + '. Posts from that day got ' + fmt(now[bi]) + ' views.'
      : 'Best day: ' + labels[bi] + ', with ' + fmt(now[bi]) + ' views.';

    const byViews = real ? [...live].sort((a, b) => b.stats!.views[0] - a.stats!.views[0]) : live;
    const pv = real ? byViews.map((a) => a.stats!.views[0]) : live.length ? split(t.stats.views[0], live.length).sort((a, b) => b - a) : [];
    const pvTotal = pv.reduce((n, v) => n + v, 0);
    const plats = byViews.map((a, i) => ({ name: a.platform, sub: a.handle + (a.status === 'lost' ? ' · last good numbers' : ''), logoBg: LOGO[a.platform] ? 'url(' + LOGO[a.platform] + ')' : 'none', views: fmt(pv[i]), pct: (pvTotal ? Math.round(pv[i] / pvTotal * 100) : 0) + '%', share: pv[i], bar: shades[i % 4] }));
    const row = (i: number, p: { title: string; format: string; platform: string }, views: number, max: number, eng: number) => ({
      rank: i + 1, rankBg: i === 0 ? col : '#F4F4F5', rankFg: i === 0 ? '#fff' : '#52525b', title: p.title, meta: p.format + ' · ' + p.platform,
      logoBg: LOGO[p.platform] ? 'url(' + LOGO[p.platform] + ')' : 'none', views: fmt(views) + ' views', w: (max ? views / max * 100 : 0).toFixed(0) + '%', eng: eng.toFixed(1) + '%',
    });
    let topPosts;
    if (real) {
      const best = live.flatMap((a) => (a.top || []).map((p) => ({ ...p, platform: a.platform as string }))).sort((a, b) => b.views - a.views).slice(0, 4);
      topPosts = best.map((p, i) => row(i, p, p.views, best[0].views, p.eng));
    } else {
      // Simulated accounts have no posts, so the prototype shows made-up ones.
      const pool = [{ title: 'A day in my life', format: 'Short video' }, { title: 'Answering your questions', format: 'Reel' }, { title: '3 things I tried this week', format: 'Carousel' }, { title: 'Behind the scenes', format: 'Short video' }];
      const tv = split(Math.round(t.stats.views[0] * 0.62), 4).sort((a, b) => b - a);
      topPosts = pool.map((p, i) => row(i, { ...p, platform: live[i % Math.max(1, live.length)]?.platform || 'TikTok' }, tv[i], tv[0], t.stats!.eng[0] + (1.6 - i * 0.7) + rnd() * 0.4));
    }

    // Best time to post: real accounts show the average views of the posts made in each day and time
    // slot (the last 14 days). An empty cell had no post.
    const slot = (ms: number) => { const h = new Date(ms).getHours(); return h >= 5 && h < 11 ? 0 : h < 15 ? 1 : h < 21 ? 2 : 3; };
    let cellV: number[][], cellN: number[][];
    if (real) {
      cellV = SL.map(() => DN.map(() => 0));
      cellN = SL.map(() => DN.map(() => 0));
      for (const p of posts) { cellV[slot(p.at)][dayIx(p.at)] += p.views; cellN[slot(p.at)][dayIx(p.at)] += 1; }
      cellV = cellV.map((r, ri) => r.map((v, ci) => (cellN[ri][ci] ? v / cellN[ri][ci] : 0)));
    } else {
      const base = [0.35, 0.5, 1, 0.7];
      const dayB = [0.75, 0.7, 0.8, 0.95, 0.9, 1, 0.85];
      cellV = SL.map((_, r) => DN.map((__, c) => base[r] * dayB[c] * (0.75 + rnd() * 0.5)));
      cellN = SL.map(() => DN.map(() => 1));
    }
    let best = { v: 0, r: 0, c: 0 };
    cellV.forEach((r, ri) => r.forEach((v, ci) => { if (cellN[ri][ci] && v > best.v) best = { v, r: ri, c: ci }; }));
    const heat = SL.map((l, r) => ({
      label: l,
      cells: DN.map((d, c) => {
        const a = best.v ? cellV[r][c] / best.v : 0;
        const hex = Math.round(18 + a * 237).toString(16).padStart(2, '0');
        const isB = !!best.v && r === best.r && c === best.c;
        const n = cellN[r][c];
        const tip = !real ? d + ' ' + l.toLowerCase() + ': ' + Math.round(a * 100) + '% of peak'
          : n ? d + ' ' + l.toLowerCase() + ': ' + fmt(Math.round(cellV[r][c])) + ' views on average (' + n + (n === 1 ? ' post)' : ' posts)')
          : d + ' ' + l.toLowerCase() + ': no posts';
        // A tap (touch) or Enter (keyboard) shows the tip as a message, because a title tooltip needs a mouse.
        return { bg: n ? col + hex : '#F4F4F5', ring: isB ? '0 0 0 2px #fff,0 0 0 4px ' + col : 'none', tip, tap: () => this.toast(tip + '.') };
      }),
    }));
    const bestText = stale ? 'Refresh the accounts to see this' : !best.v ? 'Not enough posts yet' : DN[best.c] + ' ' + SL[best.r].toLowerCase();

    // Engagement breakdown this week. Real accounts count each kind; a platform that does not share one counts 0.
    let parts: [string, number][];
    if (real) {
      const wk = posts.filter((p) => p.at > Date.now() - 7 * 24 * HOUR);
      const sum = (k: 'likes' | 'comments' | 'shares' | 'saves') => wk.reduce((n, p) => n + p[k], 0);
      parts = [['Likes', sum('likes')], ['Comments', sum('comments')], ['Shares', sum('shares')], ['Saves', sum('saves')]];
    } else {
      const tot = Math.round(t.stats.views[0] * t.stats.eng[0] / 100);
      parts = ([['Likes', 0.72], ['Comments', 0.12], ['Shares', 0.09], ['Saves', 0.07]] as [string, number][]).map(([l, f]) => [l, Math.round(tot * f)]);
    }
    const totEng = parts.reduce((n, [, v]) => n + v, 0);
    const eng = parts.map(([label, v], i) => ({ label, n: totEng ? v / totEng : 0, v: fmt(v), pct: (totEng ? Math.round(v / totEng * 100) : 0) + '%', bg: shades[i] }));
    return {
      color: col, ticks: [fmt(top), fmt(Math.round(top / 2)), '0'], nowD, prevD, area: nowD + ' L' + X(6).toFixed(1) + ' 200 L' + X(0).toFixed(1) + ' 200 Z',
      chartTitle: real ? 'Views by the day posted' : 'Views each day',
      pts: now.map((v, d) => ({ x: (X(d) / 600 * 100).toFixed(2) + '%', y: (Y(v) / 200 * 100).toFixed(2) + '%', tip: labels[d] + ': ' + fmt(v) + ' views (last week ' + fmt(prev[d]) + ')', tap: () => this.toast(labels[d] + ': ' + fmt(v) + ' views, last week ' + fmt(prev[d]) + '.') })),
      days: labels.map((l, d) => ({ l, x: (X(d) / 600 * 100).toFixed(2) + '%', c: d === bi ? col : '#71717a' })),
      dayNote, platPick,
      plats, hasHandleOnly: handle.length > 0, handleNote: handle.map((a) => a.platform).join(', ') + ' is added by handle, so it shares no numbers.',
      top: topPosts, noTop: !topPosts.length, topEmpty: real && !live.some((a) => a.top) ? 'Refresh the accounts to see this week\'s top posts.' : 'No posts this week yet.',
      dowL: DN.map((d) => d[0]), heat, best: bestText,
      heatSub: real ? 'Average views of your posts, by when they went up' : 'When the audience watches most',
      eng, engTotal: fmt(totEng) + ' total this week',
    };
  }


  metricCards(t: Talent) { return metricCards(t); }

  pic(t: Talent) {
    return { hasPic: !!t.pic, noPic: !t.pic, pic: t.pic || '', picBg: t.pic ? 'url(' + t.pic + ')' : 'none', initials: initials(t.name), tint: t.tint };
  }

  viewsOf(t: Talent) { return viewsOf(t); }


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
