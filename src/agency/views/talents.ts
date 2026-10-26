/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChangeEvent } from 'react';
import type { AgencyApp } from '../AgencyApp';
import { PLATFORMS, TCOLORS, draftFromAccounts } from '../logic';
import type { Talent } from '../types';

/** Logo files that exist in /public/assets. Others show the fallback mark. */
const LOGO_FILES: Record<string, string> = {
  TikTok: '/assets/p-tiktok.png',
  Instagram: '/assets/p-instagram.png',
  Facebook: '/assets/p-facebook.png',
};
const logoBg = (pl: string) => (LOGO_FILES[pl] ? 'url(' + LOGO_FILES[pl] + ')' : 'none');

const STEP_LABELS = ['Picture and name', 'Accounts', 'Niche and story', 'Check and save'];
const PIC_MAX = 512;

/** "a, b and c" */
function andList(xs: string[]) {
  return xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
}

/** Reads an image file, scales it down to PIC_MAX px on the long side and returns a JPEG data URL. */
function readPicture(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => {
      const src = String(fr.result || '');
      const img = new Image();
      img.onerror = () => reject(new Error('bad image'));
      img.onload = () => {
        const k = Math.min(1, PIC_MAX / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
        try {
          const cv = document.createElement('canvas');
          cv.width = w;
          cv.height = h;
          const ctx = cv.getContext('2d');
          if (!ctx) { resolve(src); return; }
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(cv.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(src);
        }
      };
      img.src = src;
    };
    fr.readAsDataURL(file);
  });
}

function talentCards(app: AgencyApp) {
  return app.state.talents.map((t: Talent) => {
    const p = app.pic(t);
    const v = app.viewsOf(t);
    const plats = Array.from(new Set(t.accounts.map((a) => a.platform)));
    return {
      ...p,
      tint: p.tint || '#EAF2FF',
      name: t.name,
      niche: t.niche,
      platforms: plats.length ? plats.join(' · ') : 'No account yet',
      lost: t.accounts.some((a) => a.status === 'lost'),
      hasV: !!v,
      views: v ? v.views + ' views' : '',
      delta: v ? v.delta : '',
      color: v ? v.color : '#71717a',
      rot: v ? v.rot : 'none',
      open: () => app.openTalent(t.id),
    };
  });
}

function formView(app: AgencyApp) {
  const f = app.state.form;
  if (!f) return {};
  const isNew = f.mode !== 'edit';
  const isEdit = !isNew;
  const step: number = isNew ? Math.min(4, Math.max(1, f.step || 1)) : 0;
  const editT = isEdit ? app.T(f.id) : undefined;
  const set = (k: string, val: any) => app.setForm(k, val);
  const setStep = (n: number) => { set('step', n); try { window.scrollTo(0, 0); } catch { /* not in a browser */ } };

  // Accounts (new talent only; an existing talent manages them on its page).
  const accs: Record<string, any> = f.accs || {};
  const onAccs = Object.entries<any>(accs).filter(([, a]) => a && a.phase === 'on').map(([platform, a]) => ({ platform, handle: a.handle as string }));
  const anyLoading = Object.values<any>(accs).some((a) => a && a.phase === 'loading');
  const setAcc = (pl: string, val: any) => app.setState((s) => {
    const next = { ...((s.form && s.form.accs) || {}) };
    if (val) next[pl] = val; else delete next[pl];
    return { form: { ...s.form, accs: next } };
  });
  const plats = PLATFORMS.map((pl) => {
    const a = accs[pl] || {};
    const phase = a.phase || 'idle';
    const handle: string = a.handle || '';
    const ready = !!handle.trim();
    return {
      name: pl,
      logoBg: logoBg(pl),
      noLogo: !LOGO_FILES[pl],
      isIdle: phase === 'idle',
      isLoading: phase === 'loading',
      isOn: phase === 'on',
      handle,
      onHandle: (e: ChangeEvent<HTMLInputElement>) => setAcc(pl, { handle: e.target.value, phase: 'idle' }),
      connect: () => { if (ready) app.formConnect(pl); },
      btnBg: ready ? '#006AFF' : '#E4E4E7',
      btnFg: ready ? '#fff' : '#A1A1AA',
      remove: () => setAcc(pl, null),
    };
  });

  // Fill in from accounts. A new talent uses the accounts from step 2; an existing talent uses its own accounts.
  const fillSrc = isNew ? onAccs : (editT ? editT.accounts.map((a) => ({ platform: a.platform as string, handle: a.handle })) : []);
  const filling = !!f.filling;
  const fill = () => {
    if (!fillSrc.length || filling) return;
    if (isNew) { app.formFill(); return; }
    set('filling', true);
    setTimeout(() => {
      const cur = app.state.form;
      if (!cur || cur.mode !== 'edit' || cur.id !== f.id) return;
      const d = draftFromAccounts(cur.name, fillSrc);
      app.setState((s) => (s.form ? { form: { ...s.form, filling: false, filled: fillSrc.map((a) => a.handle).join(', '), niche: d.niche, story: d.story } } : null));
    }, 1600);
  };

  // Rules: Save stays off until name, picture, niche and character story are all filled.
  const name = (f.name || '').trim(), niche = (f.niche || '').trim(), story = (f.story || '').trim();
  const missing: string[] = [];
  if (!name) missing.push('a name');
  if (!f.pic) missing.push('a picture');
  if (!niche) missing.push('a niche');
  if (!story) missing.push('a character story');
  const ok1 = !!name && !!f.pic;
  const ok2 = !anyLoading;
  const ok3 = !!niche && !!story && !filling;
  const allOk = ok1 && ok3 && !anyLoading;
  const gates = [ok1, ok2, ok3];
  const reach = (n: number) => gates.slice(0, n - 1).every(Boolean);

  const steps = STEP_LABELS.map((label, i) => {
    const n = i + 1;
    const cur = n === step, done = n < step;
    const locked = !cur && !done && !reach(n);
    return {
      n, label,
      mark: done ? '✓' : String(n),
      flex: n < 4 ? '1' : '0 0 auto',
      bg: cur ? '#006AFF' : done ? '#EAF2FF' : '#F4F4F5',
      fg: cur ? '#fff' : done ? '#006AFF' : '#A1A1AA',
      ring: cur ? '0 0 0 4px rgba(0,106,255,.15)' : 'none',
      labelC: cur || done ? '#18181b' : '#A1A1AA',
      hasLine: n < 4,
      line: done ? '#006AFF' : '#E4E4E7',
      locked,
      cursor: locked || cur ? 'default' : 'pointer',
      go: () => { if (!locked && !cur) setStep(n); },
    };
  });

  const stepOk = step === 1 ? ok1 : step === 2 ? ok2 : step === 3 ? ok3 : allOk;
  let hint = '';
  if (step === 1 && !ok1) hint = 'Add ' + andList(missing.filter((m) => m === 'a name' || m === 'a picture')) + ' to go on.';
  else if (step === 2 && anyLoading) hint = 'Wait for the account to connect.';
  else if (step === 2 && !onAccs.length) hint = 'You can connect accounts later.';
  else if (step === 3 && filling) hint = 'Wait for the app to fill it in.';
  else if (step === 3 && !ok3) hint = 'Add ' + andList(missing.filter((m) => m === 'a niche' || m === 'a character story')) + ' to go on.';
  else if (step === 4 && !allOk) hint = 'Add ' + andList(missing) + ' to save.';

  const secBg = (ok: boolean) => (ok ? '#006AFF' : '#EAF2FF');
  const secFg = (ok: boolean) => (ok ? '#fff' : '#006AFF');
  const pick = (hex: string) => set('color', hex);
  const color = f.color || '#006AFF';
  const preset = TCOLORS.find(([, h]) => h.toLowerCase() === color.toLowerCase());

  return {
    isNew, isEdit,
    title: isNew ? 'Add AI talent' : 'Edit AI talent',
    back: isNew ? 'AI talents' : (editT ? editT.name : 'Back'),
    cancel: () => (isNew ? app.go('talents') : app.go('talent', { talentId: f.id })),
    resumed: isNew && !!f.resumed,

    // Wizard
    steps,
    progress: (step / 4 * 100) + '%',
    show1: isEdit || step === 1,
    show2: isNew && step === 2,
    show3: isEdit || step === 3,
    show4: isNew && step === 4,
    s1Bg: secBg(ok1), s1Fg: secFg(ok1),
    s2Bg: secBg(onAccs.length > 0), s2Fg: secFg(onAccs.length > 0),
    s3Bg: secBg(!!niche && !!story), s3Fg: secFg(!!niche && !!story),
    canBack: isNew && step > 1,
    back1: () => setStep(Math.max(1, step - 1)),
    next: () => { if (stepOk && step < 4) setStep(step + 1); },
    nextOn: isNew && step < 4 && stepOk,
    nextOff: isNew && step < 4 && !stepOk,
    nextLabel: step === 2 && !onAccs.length ? 'Skip for now' : step === 3 ? 'Check' : 'Next',
    saveOn: isNew && step === 4 && allOk,
    wzHint: isNew && !!hint,
    wzHintText: hint,
    go1: () => setStep(1),
    go2: () => setStep(2),
    go3: () => setStep(3),

    // Step 1
    pic: f.pic || '',
    hasPic: !!f.pic,
    noPic: !f.pic,
    picBg: f.pic ? 'url(' + f.pic + ')' : 'none',
    onPic: (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const file = input.files && input.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { app.toast('Choose a picture file.'); input.value = ''; return; }
      readPicture(file)
        .then((url) => { if (app.state.form) set('pic', url); })
        .catch(() => app.toast('The app could not read this picture. Try another one.'))
        .finally(() => { input.value = ''; });
    },
    name: f.name || '',
    onName: (e: ChangeEvent<HTMLInputElement>) => set('name', e.target.value),
    swatches: app.swatches(color, pick),
    cp: app.picker(color, pick, 'form'),
    colorName: preset ? preset[0] : 'Custom colour',

    // Step 2
    plats,

    // Step 3
    canFill: fillSrc.length > 0 && !filling,
    fillOff: !fillSrc.length && !filling,
    fill,
    fillLabel: f.filled ? 'Fill in again' : 'Fill in from accounts',
    filling,
    notFilling: !filling,
    fillFrom: andList(fillSrc.map((a) => a.handle)),
    wasFilled: !!f.filled && !filling,
    filledNote: 'Filled in from ' + (f.filled || 'your accounts') + '. Check it and change what is wrong.',
    niche: f.niche || '',
    onNiche: (e: ChangeEvent<HTMLInputElement>) => set('niche', e.target.value),
    story: f.story || '',
    onStory: (e: ChangeEvent<HTMLTextAreaElement>) => set('story', e.target.value),

    // Step 4
    revAccs: onAccs.map((a) => ({ logoBg: logoBg(a.platform), handle: a.handle })),
    revNoAccs: !onAccs.length,

    // Save
    canSave: allOk,
    cannotSave: !allOk,
    missingText: missing.length ? 'Add ' + andList(missing) + ' to save.' : (filling ? 'Wait for the app to fill it in.' : ''),
    save: () => { if (allOk) app.saveForm(); },
    del: () => { if (isEdit) app.setState({ ov: { kind: 'delete', tid: f.id } }); },
  };
}

/** AI talents list and the Add / Edit AI talent form. */
export function talentsView(app: AgencyApp) {
  const cards = talentCards(app);
  return {
    cards,
    hasTalents: cards.length > 0,
    noTalents: cards.length === 0,
    addTalent: () => app.openForm('new'),
    form: formView(app),
  };
}
