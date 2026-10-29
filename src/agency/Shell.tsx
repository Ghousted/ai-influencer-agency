/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, type ReactNode } from 'react';

/** Signed-in top bar, page background and toast, from the design file. */
export function Shell({ v, children }: { v: any; children: ReactNode }) {
  const { signedIn, goHome, nav, toggleAcct, initial, agencyName, acctMenu, userName, userEmail, goAccount, logOut, toastShow, toastText, toastProblem, toastClose, hasToastAction, toastActionLabel, toastActionRun } = v;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {signedIn ? (
        <>
          <div style={{ position: 'fixed', inset: '0', zIndex: '0', pointerEvents: 'none', backgroundColor: '#FAFAFB', backgroundImage: 'linear-gradient(#EDF2FA 1px,transparent 1px),linear-gradient(90deg,#EDF2FA 1px,transparent 1px)', backgroundSize: '44px 44px', backgroundPosition: '-1px -1px' }} />
          <div style={{ position: 'sticky', top: '0', zIndex: '20', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid #E4E4E7', color: '#18181b' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '28px' }} className="aia-topbar">
              <button style={{ display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', padding: '0', cursor: 'pointer', color: '#18181b' }} onClick={goHome} className="aia-home" aria-label="Influencer Agency home">
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#006AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                  <img style={{ width: '25px', height: '25px', objectFit: 'contain' }} src="/assets/logo-a.png" alt="" />
                </span>
                <span className="aia-brand" style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                  Influencer Agency
                </span>
              </button>
              <nav className="aia-nav" style={{ display: 'flex', gap: '4px', flex: '1' }}>
                {(nav || []).map((n: any, i: number) => (
                  <Fragment key={i}>
                    <button style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '9999px', background: n.bg, color: n.fg, font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: 'pointer' }} onClick={n.go} aria-current={n.on ? 'page' : undefined} className="dc-hover-blue">
                      {n.label}
                    </button>
                  </Fragment>
                ))}
              </nav>
              <div style={{ position: 'relative' }}>
                <button style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px 0 5px', border: 'none', borderRadius: '9999px', background: '#fff', boxShadow: '0 0 0 1px #E4E4E7', color: '#18181b', font: "600 13px 'Plus Jakarta Sans',sans-serif", cursor: 'pointer' }} onClick={toggleAcct} aria-expanded={!!acctMenu} aria-label="Account menu" className="aia-acct">
                  <span style={{ width: '30px', height: '30px', borderRadius: '9999px', background: '#006AFF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    {initial}
                  </span>
                  <span className="aia-agency" style={{ whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {agencyName}
                  </span>
                  <svg className="aia-chev" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {acctMenu ? (
                  <div style={{ position: 'absolute', right: '0', top: '48px', width: '250px', background: '#fff', color: '#18181b', borderRadius: '16px', boxShadow: '0 8px 30px rgba(24,24,27,.18)', padding: '8px', display: 'flex', flexDirection: 'column', animation: 'aia-in .15s ease-out' }}>
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif" }}>{userName}</div>
                      <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: '#71717a' }}>{userEmail}</div>
                    </div>
                    <div style={{ height: '1px', background: '#F0F0F3', margin: '0 4px 6px' }} />
                    <button style={{ height: '42px', textAlign: 'left', padding: '0 12px', border: 'none', background: 'none', borderRadius: '10px', font: "600 14px 'Plus Jakarta Sans',sans-serif", color: '#18181b', cursor: 'pointer' }} onClick={goAccount} className="dc-hover-soft">
                      Account
                    </button>
                    <button style={{ height: '42px', textAlign: 'left', padding: '0 12px', border: 'none', background: 'none', borderRadius: '10px', font: "600 14px 'Plus Jakarta Sans',sans-serif", color: '#18181b', cursor: 'pointer' }} onClick={logOut} className="dc-hover-soft">
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
      <main style={{ position: 'relative', zIndex: '1', flex: '1', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {/* Outside <main> so it stacks above overlays, which render into document.body. */}
      {toastShow ? (
        <div role={toastProblem ? 'alert' : 'status'} style={{ position: 'fixed', left: '50%', bottom: '28px', transform: 'translateX(-50%)', zIndex: '60', display: 'flex', alignItems: 'center', gap: '14px', background: '#18181b', color: '#fff', padding: '12px 12px 12px 18px', borderRadius: '12px', font: "600 14px 'Plus Jakarta Sans',sans-serif", boxShadow: '0 8px 24px rgba(0,0,0,.2)', animation: 'aia-in .2s ease-out', maxWidth: '90vw' }}>
          <span style={{ paddingRight: hasToastAction || toastProblem ? '0' : '6px' }}>{toastText}</span>
          {hasToastAction ? (
            <button style={{ border: 'none', background: 'none', color: '#7FB2FF', font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: 'pointer', padding: '4px 6px', whiteSpace: 'nowrap' }} onClick={toastActionRun}>
              {toastActionLabel}
            </button>
          ) : null}
          {toastProblem ? (
            <button style={{ border: 'none', background: 'none', color: '#A1A1AA', font: "700 18px/1 'Plus Jakarta Sans',sans-serif", cursor: 'pointer', padding: '2px 6px' }} onClick={toastClose} aria-label="Close message">
              ×
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
