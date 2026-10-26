// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function HistoryScreen({ v }: { v: any }) {
  const { hist, r } = v;
  return (
    <>
      {(r.history) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
            History
          </h1>
          <div style={{ display: "flex", gap: "28px", borderBottom: "1px solid #E4E4E7" }}>
            {(hist.tabs || []).map((tb: any, tb_i: number) => (
              <Fragment key={tb_i}>
                <button style={{ height: "44px", padding: "0", border: "none", borderBottom: `2px solid ${tb.line}`, marginBottom: "-1px", background: "none", color: tb.color, font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={tb.go}>
                  {tb.label}
                </button>
              </Fragment>
            ))}
          </div>
          {(hist.empty) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "40px 24px", textAlign: "center", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              {hist.emptyText}
            </div>
            </>
          ) : null}
          {(hist.has) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "6px 20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", overflowX: "auto" }}>
              <div style={{ minWidth: "720px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2.6fr) minmax(0,1.2fr) 110px 100px 150px", gap: "14px", padding: "12px 0", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                  <span>
                    Item
                  </span>
                  <span>
                    AI talent
                  </span>
                  <span>
                    Type
                  </span>
                  <span>
                    Status
                  </span>
                  <span>
                    Date
                  </span>
                </div>
                {(hist.rows || []).map((h: any, h_i: number) => (
                  <Fragment key={h_i}>
                    <button style={{ width: "100%", display: "grid", gridTemplateColumns: "minmax(0,2.6fr) minmax(0,1.2fr) 110px 100px 150px", gap: "14px", alignItems: "center", padding: "13px 8px", margin: "0 -8px", border: "none", borderTop: "1px solid #F4F4F5", background: "none", textAlign: "left", cursor: "pointer", borderRadius: "10px" }} onClick={h.open} className="dc-h58">
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                        <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                          {h.title}
                        </span>
                        {(h.hasNote) ? (
                          <>
                          <span style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {h.noteText}
                          </span>
                          </>
                        ) : null}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                        <span style={{ width: "28px", height: "28px", borderRadius: "9999px", flexShrink: "0", backgroundColor: "#EAF2FF", backgroundImage: h.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 3.5px ${h.tColor}` }} />
                        <span style={{ minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                          {h.talent}
                        </span>
                      </span>
                      <span style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                        {h.type}
                      </span>
                      <span style={{ font: "700 13px 'Plus Jakarta Sans',sans-serif", color: h.statusColor }}>
                        {h.status}
                      </span>
                      <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        {h.dateText}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            </>
          ) : null}
        </div>
        </>
      ) : null}
    </>
  );
}
