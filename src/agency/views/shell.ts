import type { AgencyApp } from '../AgencyApp';

/** Routing flags, top bar, toast, landing and auth values. */
export function shellView(app: AgencyApp) {
  const s = app.state;
  const R = s.route;
  const r = {
    start: R === 'start', signup: R === 'signup', login: R === 'login', auth: R === 'signup' || R === 'login',
    home: R === 'home', talents: R === 'talents', form: R === 'form', talent: R === 'talent', pitch: R === 'pitch',
    history: R === 'history', account: R === 'account', calendar: R === 'calendar',
  };
  const navOn: Record<string, boolean> = { home: r.home, talents: r.talents || r.form || r.talent || r.pitch, history: r.history, calendar: r.calendar };
  const nav = ([['Home', 'home'], ['Talents', 'talents'], ['Calendar', 'calendar'], ['History', 'history']] as const).map(([label, k]) => ({
    label,
    go: () => app.go(k),
    bg: navOn[k] ? '#EAF2FF' : 'transparent',
    fg: navOn[k] ? '#006AFF' : '#52525b',
  }));

  const su = r.signup;
  const auth = {
    ...app._authLayout(su),
    name: s.auth.name, email: s.auth.email, password: s.auth.password, agency: s.auth.agency,
    onName: app.authInput('name'), onEmail: app.authInput('email'), onPassword: app.authInput('password'), onAgency: app.authInput('agency'),
    err: s.authErr, hasErr: !!s.authErr,
    login: () => app.submitLogin(),
    signup: () => app.signup(),
    social: () => app.toast('Social sign-in comes later. Use your email for now.'),
  };

  return {
    r, nav, auth,
    signedIn: s.signedIn,
    acctMenu: s.acctMenu,
    agencyName: s.agencyName,
    userName: s.user.name,
    userEmail: s.user.email,
    initial: (s.agencyName || s.user.name || '?').trim()[0]?.toUpperCase() || '?',
    goHome: () => app.go('home'),
    goTalents: () => app.go('talents'),
    goAccount: () => app.go('account'),
    goStart: () => app.go('start'),
    goLogin: () => app.go('login', { authErr: '' }),
    goSignup: () => app.go('signup', { authErr: '' }),
    toggleAcct: () => app.setState((st) => ({ acctMenu: !st.acctMenu })),
    logOut: () => app.logOut(),
    toastShow: !!s.toast,
    toastText: s.toast || '',
  };
}
