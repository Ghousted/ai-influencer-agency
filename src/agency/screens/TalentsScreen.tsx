// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function TalentsScreen({ v }: { v: any }) {
  const { addTalent, cards, hasTalents, noTalents, r } = v;
  return (
    <>
      {(r.talents) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
              AI talents
            </h1>
            <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={addTalent} className="dc-h38">
              Add AI talent
            </button>
          </div>
          {(noTalents) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                No AI talents yet
              </div>
              <div style={{ font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b", maxWidth: "420px" }}>
                Add the AI talent that you made in the course. Then its numbers show here.
              </div>
              <button style={{ height: "46px", padding: "0 24px", marginTop: "6px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={addTalent}>
                Add AI talent
              </button>
            </div>
            </>
          ) : null}
          {(hasTalents) ? (
            <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "20px" }}>
              {(cards || []).map((c: any, c_i: number) => (
                <Fragment key={c_i}>
                  <button style={{ padding: "0", textAlign: "left", background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", cursor: "pointer", display: "flex", flexDirection: "column", transition: "transform .15s,box-shadow .15s" }} onClick={c.open} className="dc-h39">
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", background: c.tint, display: "flex", alignItems: "center", justifyContent: "center", font: "800 44px 'Plus Jakarta Sans',sans-serif", color: "#006AFF" }}>
                      {(c.hasPic) ? (
                        <>
                        <div style={{ position: "absolute", inset: "0", backgroundImage: c.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                        </>
                      ) : null}
                      {(c.noPic) ? (
                        <>
                        <span>
                          {c.initials}
                        </span>
                        </>
                      ) : null}
                      {(c.lost) ? (
                        <>
                        <span style={{ position: "absolute", top: "12px", left: "12px", height: "28px", padding: "0 10px", borderRadius: "9999px", background: "#fff", color: "#B91C1C", font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}>
                          <span style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#B91C1C" }} />
                          The connection is lost
                        </span>
                        </>
                      ) : null}
                    </div>
                    <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "3px" }}>
                      <div style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                        {c.name}
                      </div>
                      <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                        {c.niche}
                      </div>
                      <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        {c.platforms}
                      </div>
                      {(c.hasV) ? (
                        <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "10px", borderTop: "1px solid #F4F4F5" }}>
                          <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                            {c.views}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "3px", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: c.color }}>
                            <svg style={{ transform: c.rot, display: c.arrow }} width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M7 11.5V2.5M3 6.5l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {c.delta}
                          </span>
                        </div>
                        </>
                      ) : null}
                    </div>
                  </button>
                </Fragment>
              ))}
              <button style={{ minHeight: "300px", border: "2px dashed #CFE0FF", borderRadius: "20px", background: "transparent", font: "700 15px 'Plus Jakarta Sans',sans-serif", color: "#52525b", cursor: "pointer" }} onClick={addTalent} className="dc-h40">
                Add AI talent
              </button>
            </div>
            </>
          ) : null}
        </div>
        </>
      ) : null}
    </>
  );
}
