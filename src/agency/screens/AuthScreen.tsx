// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { InteractiveGrid } from '../InteractiveGrid';

export function AuthScreen({ v }: { v: any }) {
  const { auth, goLogin, goSignup, goStart, r } = v;
  return (
    <>
      {(r.auth) ? (
        <>
        <div style={{ flex: "1", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
          <button style={{ position: "absolute", top: "24px", left: auth.logoLeft, zIndex: "7", display: "flex", alignItems: "center", gap: "10px", border: "none", background: "none", cursor: "pointer", transition: "left 1s ease-in-out .7s" }} onClick={goStart}>
            <span style={{ width: "40px", height: "40px", borderRadius: "11px", background: "#006AFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img style={{ width: "28px", height: "28px", objectFit: "contain" }} src="/assets/logo-a.png" alt="" />
            </span>
            <span style={{ font: "800 17px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
              Influencer Agency
            </span>
          </button>
          <div style={{ position: "relative", flex: "1", width: "100%", minHeight: auth.boxH, background: "#fff", overflow: "hidden" }}>
            <InteractiveGrid cellSize={40} color="#006AFF" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none" }} />
            {(auth.wide) ? (
              <>
              <div style={{ position: "absolute", width: "max(2600px,190vw)", height: "max(2600px,190vw)", top: "-10%", right: auth.circleRight, transform: auth.circleT, borderRadius: "50%", background: "#006AFF", zIndex: "6", transition: "transform 1.8s ease-in-out,right 1.8s ease-in-out", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "0", left: "0", width: "50%", height: "100%", zIndex: "6", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(28px,5vw,64px)", boxSizing: "border-box", pointerEvents: auth.leftPe }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", color: "#fff", transform: `translateX(${auth.leftX})`, transition: "transform .9s ease-in-out .5s" }}>
                  <div style={{ position: "relative", width: "340px", maxWidth: "100%", height: "230px", marginBottom: "12px" }}>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "140px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + -96px)) rotate(-10deg)", zIndex: "1", background: "#fff" }}>
                      <img src="/assets/hero-1.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "140px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + 96px)) rotate(10deg)", zIndex: "1", background: "#fff" }}>
                      <img src="/assets/hero-2.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "160px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + 0px)) rotate(0deg)", zIndex: "2", background: "#fff" }}>
                      <img src="/assets/hero-5.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                  </div>
                  <h2 style={{ margin: "0", font: "800 28px/1.1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                    Are you new here?
                  </h2>
                  <p style={{ margin: "0 0 8px", maxWidth: "30ch", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.88)", textWrap: "pretty" }}>
                    Make an account in two minutes. Then add your first AI talent.
                  </p>
                  <button style={{ height: "44px", padding: "0 28px", borderRadius: "9999px", border: "1.5px solid #fff", background: "transparent", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", transition: "background .2s" }} onClick={goSignup} className="dc-h10">
                    Sign up
                  </button>
                </div>
              </div>
              <div style={{ position: "absolute", top: "0", right: "0", width: "50%", height: "100%", zIndex: "6", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(28px,5vw,64px)", boxSizing: "border-box", pointerEvents: auth.rightPe }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", color: "#fff", transform: `translateX(${auth.rightX})`, transition: "transform .9s ease-in-out .5s" }}>
                  <div style={{ position: "relative", width: "340px", maxWidth: "100%", height: "230px", marginBottom: "12px" }}>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "140px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + -96px)) rotate(-10deg)", zIndex: "1", background: "#fff" }}>
                      <img src="/assets/hero-3.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "140px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + 96px)) rotate(10deg)", zIndex: "1", background: "#fff" }}>
                      <img src="/assets/hero-1.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", left: "50%", bottom: "0", width: "160px", aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 18px 36px rgba(0,30,90,.35)", transform: "translateX(calc(-50% + 0px)) rotate(0deg)", zIndex: "2", background: "#fff" }}>
                      <img src="/assets/hero-4.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    </div>
                  </div>
                  <h2 style={{ margin: "0", font: "800 28px/1.1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                    Do you have an account?
                  </h2>
                  <p style={{ margin: "0 0 8px", maxWidth: "30ch", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.88)", textWrap: "pretty" }}>
                    Log in to see the numbers, ideas and pitches for your AI talents.
                  </p>
                  <button style={{ height: "44px", padding: "0 28px", borderRadius: "9999px", border: "1.5px solid #fff", background: "transparent", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", transition: "background .2s" }} onClick={goLogin} className="dc-h11">
                    Log in
                  </button>
                </div>
              </div>
              </>
            ) : null}
            <div style={{ position: auth.formPos, top: "50%", left: auth.formLeft, width: auth.formW, transform: auth.formT, transition: "left 1s ease-in-out .7s", display: "grid", zIndex: "5", padding: auth.formPad, boxSizing: "border-box" }}>
              <div style={{ gridArea: "1/1", display: "grid", pointerEvents: "none" }}>
                <form noValidate onSubmit={(e) => { e.preventDefault(); auth.login(); }} style={{ gridArea: "1/1", display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "440px", justifySelf: "center", boxSizing: "border-box", padding: "0 clamp(24px,5vw,56px)", opacity: auth.liOp, pointerEvents: auth.liPe, transition: `opacity .25s ease ${auth.fDelay}` }}>
                  <h1 style={{ margin: "0 0 4px", font: "800 30px 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B" }}>
                    Log in
                  </h1>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Email
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} type="email" value={auth.email} onChange={auth.onEmail} placeholder="you@email.com" className="dc-f12" />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Password
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} type="password" value={auth.password} onChange={auth.onPassword} placeholder="Your password" className="dc-f13" />
                  </label>
                  {(r.login) ? (
                    <>
                    {(auth.hasErr) ? (
                      <>
                      <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }} role="alert">
                        {auth.err}
                      </div>
                      </>
                    ) : null}
                    </>
                  ) : null}
                  <button style={{ height: "48px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: auth.busy ? "wait" : "pointer", opacity: auth.busy ? ".7" : "1", boxShadow: "0 4px 10px 1px rgba(0,106,255,.2)", transition: "background .2s,transform .2s" }} type="submit" disabled={auth.busy} className="dc-h14 dc-a15">
                    {auth.loginLabel}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                    <span style={{ flex: "1", height: "1px", background: "#F1F1F3" }} />
                    Or log in with
                    <span style={{ flex: "1", height: "1px", background: "#F1F1F3" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Google" title="Continue with Google" className="dc-h16">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>
                        Google
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Facebook" title="Continue with Facebook" className="dc-h17">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>
                        Facebook
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Apple" title="Continue with Apple" className="dc-h18">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#18181B" aria-hidden="true">
                        <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.38-3.69zM14.1 5.86c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.1 1.77-.96 2.81 1.02.08 2.06-.52 2.69-1.28z" />
                      </svg>
                      <span>
                        Apple
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with TikTok" title="Continue with TikTok" className="dc-h19">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#18181B" />
                      </svg>
                      <span>
                        TikTok
                      </span>
                    </button>
                  </div>
                  <div style={{ font: "500 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#71717A", textAlign: "center" }}>
                    Prototype: Use any email and password to open the demo agency.
                  </div>
                  {(auth.narrow) ? (
                    <>
                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525B" }}>
                      Are you a new user?
                      <button style={{ border: "none", background: "none", padding: "0", font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#006AFF", textDecoration: "underline", cursor: "pointer" }} type="button" onClick={goSignup} className="aia-tap">
                        Sign up
                      </button>
                    </div>
                    </>
                  ) : null}
                </form>
              </div>
              <div style={{ gridArea: "1/1", display: "grid", pointerEvents: "none" }}>
                <form noValidate onSubmit={(e) => { e.preventDefault(); auth.signup(); }} style={{ gridArea: "1/1", display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "440px", justifySelf: "center", boxSizing: "border-box", padding: "0 clamp(24px,5vw,56px)", opacity: auth.suOp, pointerEvents: auth.suPe, transition: `opacity .25s ease ${auth.fDelay}` }}>
                  <h1 style={{ margin: "0 0 4px", font: "800 30px 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B" }}>
                    Sign up
                  </h1>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Name
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} value={auth.name} onChange={auth.onName} placeholder="Mika Santos" className="dc-f20" />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Email
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} type="email" value={auth.email} onChange={auth.onEmail} placeholder="you@email.com" className="dc-f21" />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Password
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} type="password" value={auth.password} onChange={auth.onPassword} placeholder="8 characters or more" className="dc-f22" />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                    Agency name
                    <input style={{ height: "46px", border: "0.667px solid #E4E4E7", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181B", outline: "none" }} value={auth.agency} onChange={auth.onAgency} placeholder="e.g. Mika's Talent House" className="dc-f23" />
                    <span style={{ fontWeight: "500", color: "#71717A" }}>
                      You can change the name later.
                    </span>
                  </label>
                  {(r.signup) ? (
                    <>
                    {(auth.hasErr) ? (
                      <>
                      <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }} role="alert">
                        {auth.err}
                      </div>
                      </>
                    ) : null}
                    </>
                  ) : null}
                  <button style={{ height: "48px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: auth.busy ? "wait" : "pointer", opacity: auth.busy ? ".7" : "1", boxShadow: "0 4px 10px 1px rgba(0,106,255,.2)", transition: "background .2s,transform .2s" }} type="submit" disabled={auth.busy} className="dc-h24 dc-a25">
                    {auth.signupLabel}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                    <span style={{ flex: "1", height: "1px", background: "#F1F1F3" }} />
                    Or sign up with
                    <span style={{ flex: "1", height: "1px", background: "#F1F1F3" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Google" title="Continue with Google" className="dc-h26">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>
                        Google
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Facebook" title="Continue with Facebook" className="dc-h27">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>
                        Facebook
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with Apple" title="Continue with Apple" className="dc-h28">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#18181B" aria-hidden="true">
                        <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.38-3.69zM14.1 5.86c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.1 1.77-.96 2.81 1.02.08 2.06-.52 2.69-1.28z" />
                      </svg>
                      <span>
                        Apple
                      </span>
                    </button>
                    <button style={{ flex: "1", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "0.667px solid #E4E4E7", background: "#fff", borderRadius: "9999px", cursor: "pointer", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B", transition: "border-color .2s,box-shadow .2s,transform .2s" }} type="button" onClick={auth.social} aria-label="Continue with TikTok" title="Continue with TikTok" className="dc-h29">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#18181B" />
                      </svg>
                      <span>
                        TikTok
                      </span>
                    </button>
                  </div>
                  {(auth.narrow) ? (
                    <>
                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525B" }}>
                      Do you have an account?
                      <button style={{ border: "none", background: "none", padding: "0", font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#006AFF", textDecoration: "underline", cursor: "pointer" }} type="button" onClick={goLogin} className="aia-tap">
                        Log in
                      </button>
                    </div>
                    </>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
    </>
  );
}
