// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function AccountScreen({ v }: { v: any }) {
  const { acct, agencyName, initial, logOut, r } = v;
  return (
    <>
      {(r.account) ? (
        <>
        <div style={{ maxWidth: "1000px", width: "100%", margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "64px", height: "64px", borderRadius: "9999px", background: "#006AFF", color: "#fff", font: "800 26px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
              {initial}
            </span>
            <div style={{ flex: "1", minWidth: "0" }}>
              <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                Account
              </h1>
              <div style={{ font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                {acct.name} · {agencyName}
              </div>
            </div>
            <button style={{ height: "42px", padding: "0 18px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={logOut}>
              Log out
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px" }}>
            {(acct.stats || []).map((st: any, st_i: number) => (
              <Fragment key={st_i}>
                <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", border: "1px solid #E4E4E7" }}>
                  <div style={{ font: "800 24px 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                    {st.v}
                  </div>
                  <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    {st.l}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Profile
                </h2>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Name
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b", minWidth: "0" }} value={acct.nameV} onChange={acct.onName} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Email
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b", minWidth: "0" }} type="email" value={acct.emailV} onChange={acct.onEmail} />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={acct.saveProfile}>
                    Save
                  </button>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Agency
                </h2>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Agency name
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input style={{ flex: "1", height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b", minWidth: "0" }} value={acct.val} onChange={acct.onVal} />
                    <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={acct.save}>
                      Rename
                    </button>
                  </div>
                </label>
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Password
                </h2>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Current password
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b", minWidth: "0" }} type="password" value={acct.pw0} onChange={acct.onPw0} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  New password
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b", minWidth: "0" }} type="password" value={acct.pw1} onChange={acct.onPw1} />
                  <span style={{ fontWeight: "500", color: "#71717a" }}>
                    8 characters or more.
                  </span>
                </label>
                {(acct.pwErr) ? (
                  <>
                  <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }} role="alert">
                    {acct.pwErrText}
                  </div>
                  </>
                ) : null}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={acct.savePw}>
                    Change password
                  </button>
                </div>
              </div>
            </div>
            <div style={{ flex: "1 1 340px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                    Connected accounts
                  </h2>
                  <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    {acct.accCount}
                  </span>
                </div>
                {(acct.noAccs) ? (
                  <>
                  <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                    There are no connected accounts. Open an AI talent to connect one.
                  </div>
                  </>
                ) : null}
                {(acct.accs || []).map((ac: any, ac_i: number) => (
                  <Fragment key={ac_i}>
                    <button style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={ac.open} className="dc-h59">
                      <span style={{ position: "relative", width: "34px", height: "34px", flexShrink: "0" }}>
                        <span style={{ position: "absolute", inset: "0", borderRadius: "9999px", backgroundColor: "#EAF2FF", backgroundImage: ac.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 3.5px ${ac.color}` }} />
                        <span style={{ position: "absolute", right: "-6px", bottom: "-6px", width: "18px", height: "18px", borderRadius: "9999px", backgroundColor: "#fff", backgroundImage: ac.logoBg, backgroundSize: "14px", backgroundRepeat: "no-repeat", backgroundPosition: "center", boxShadow: "0 0 0 1px #E4E4E7" }} />
                      </span>
                      <span style={{ flex: "1", minWidth: "0" }}>
                        <span style={{ display: "block", font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                          {ac.handle}
                        </span>
                        <span style={{ display: "block", font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                          {ac.sub}
                        </span>
                      </span>
                      <span style={{ height: "24px", padding: "0 10px", borderRadius: "9999px", background: ac.stBg, color: ac.stFg, font: "700 11px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                        {ac.status}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Notifications
                </h2>
                {(acct.notifs || []).map((nf: any, nf_i: number) => (
                  <Fragment key={nf_i}>
                    <button style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0", border: "none", background: "none", textAlign: "left", cursor: "pointer" }} onClick={nf.toggle} role="switch" aria-checked={nf.on}>
                      <span style={{ flex: "1", minWidth: "0" }}>
                        <span style={{ display: "block", font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                          {nf.label}
                        </span>
                        <span style={{ display: "block", font: "500 12px/1.4 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                          {nf.sub}
                        </span>
                      </span>
                      <span style={{ width: "42px", height: "24px", borderRadius: "9999px", background: nf.track, position: "relative", flexShrink: "0", transition: "background .15s" }}>
                        <span style={{ position: "absolute", top: "3px", left: nf.knob, width: "18px", height: "18px", borderRadius: "9999px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .15s" }} />
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px", borderColor: "#F5C2C2" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Delete account
                </h2>
                <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                  This deletes your agency, all AI talents, their connected accounts, ideas, pitches and history. This cannot be undone.
                </div>
                <div>
                  <button style={{ height: "42px", padding: "0 18px", borderRadius: "9999px", border: "1px solid #F5C2C2", background: "#fff", color: "#B91C1C", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={acct.del} className="dc-h60">
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
    </>
  );
}
