// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function PitchScreen({ v }: { v: any }) {
  const { pitch, r } = v;
  return (
    <>
      {(r.pitch) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "28px 24px 64px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {(pitch.none) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif" }}>
                First, select a brand idea
              </div>
              <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                Open an AI talent. Go to Scout. On a brand idea, select Draft pitch.
              </div>
              <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pitch.goTalents}>
                Go to Talents
              </button>
            </div>
            </>
          ) : null}
          {(pitch.exists) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <button style={{ alignSelf: "flex-start", height: "32px", display: "flex", alignItems: "center", gap: "4px", padding: "0", border: "none", background: "none", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b", cursor: "pointer" }} onClick={pitch.back}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {pitch.first}'s Scout
              </button>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                    Pitch to {pitch.brand}
                  </h1>
                  <p style={{ margin: "4px 0 0", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                    For {pitch.talent}. Edit anything, then approve it.
                  </p>
                </div>
                {(pitch.ready) ? (
                  <>
                  <div>
                    {(pitch.notFlagged) ? (
                      <>
                      <button style={{ height: "34px", padding: "0", border: "none", background: "none", color: "#71717a", font: "600 13px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={pitch.flag}>
                        This looks wrong
                      </button>
                      </>
                    ) : null}
                    {(pitch.flagged) ? (
                      <>
                      <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }}>
                        Flagged
                      </span>
                      </>
                    ) : null}
                  </div>
                  </>
                ) : null}
              </div>
              {(pitch.loading) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    The app writes your pitch.
                    {(pitch.long) ? (
                      <>
                      <span>
                        This step takes more time. Keep this page open.
                      </span>
                      </>
                    ) : null}
                  </div>
                  <div style={{ height: "320px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                </div>
                </>
              ) : null}
              {(pitch.bad) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    The app cannot write the pitch now.
                  </div>
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pitch.retry}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
              {(pitch.ready) ? (
                <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start", animation: "aia-in .25s ease-out" }}>
                  <div style={{ flex: "2 1 460px", minWidth: "0", background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                      Pitch
                      <textarea style={{ border: "none", background: "#FAFAFB", borderRadius: "12px", padding: "14px 16px", font: "500 15px/1.6 'Plus Jakarta Sans',sans-serif", color: "#18181b", resize: "vertical" }} value={pitch.text} onChange={pitch.onText} rows={14} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                      Talent profile
                      <textarea style={{ border: "none", background: "#FAFAFB", borderRadius: "12px", padding: "14px 16px", font: "500 15px/1.6 'Plus Jakarta Sans',sans-serif", color: "#18181b", resize: "vertical" }} value={pitch.profile} onChange={pitch.onProfile} rows={4} />
                    </label>
                    {(pitch.noNumbers) ? (
                      <>
                      <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        No account is connected. The pitch does not include numbers.
                      </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ flex: "1 1 280px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "84px" }}>
                    <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        Brand idea
                      </div>
                      <div style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                        {pitch.brand}
                      </div>
                      <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                        {pitch.where}
                      </div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(pitch.isDraft) ? (
                        <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {(pitch.reapprove) ? (
                            <>
                            <div style={{ padding: "10px 12px", borderRadius: "10px", background: "#FEECEC", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                              You changed the pitch. Approve it again.
                            </div>
                            </>
                          ) : null}
                          <button style={{ height: "46px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pitch.approve} className="dc-h53">
                            Approve
                          </button>
                          <button style={{ height: "46px", borderRadius: "9999px", border: "none", background: "#e4e4e7", color: "#a1a1aa", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "not-allowed" }} disabled={true}>
                            Copy
                          </button>
                          <div style={{ font: "500 13px/1.45 'Plus Jakarta Sans',sans-serif", color: "#71717a", textAlign: "center" }}>
                            Approve the pitch. Then Copy becomes available. You send the pitch.
                          </div>
                        </div>
                        </>
                      ) : null}
                      {(pitch.canCopy) ? (
                        <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", background: "#EAF2FF", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#006AFF" }} />
                            {(pitch.isApproved) ? (
                              <>
                              <span>
                                Approved. If you change the pitch, approve it again.
                              </span>
                              </>
                            ) : null}
                            {(pitch.isSent) ? (
                              <>
                              <span>
                                Marked as sent.
                              </span>
                              </>
                            ) : null}
                          </div>
                          <button style={{ height: "46px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#FFFFFF", font: "800 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pitch.copy} className="dc-h54">
                            Copy
                          </button>
                          {(pitch.isApproved) ? (
                            <>
                            <button style={{ width: "100%", height: "46px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pitch.markSent}>
                              I sent it
                            </button>
                            </>
                          ) : null}
                          <div style={{ font: "500 13px/1.45 'Plus Jakarta Sans',sans-serif", color: "#71717a", textAlign: "center" }}>
                            Paste it into your email or app. Then send it.
                          </div>
                        </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                </>
              ) : null}
            </div>
            </>
          ) : null}
        </div>
        </>
      ) : null}
    </>
  );
}
