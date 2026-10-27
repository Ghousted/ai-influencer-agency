// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function CalendarScreen({ v }: { v: any }) {
  const { cal, r } = v;
  return (
    <>
      {(r.calendar) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                Content calendar
              </h1>
              <p style={{ margin: "6px 0 0", font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                The app does not post for you. Post it yourself, then mark it as posted.
              </p>
            </div>
            <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cal.add} className="dc-h55">
              Plan a post
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
            {(cal.filters || []).map((f: any, f_i: number) => (
              <Fragment key={f_i}>
                <button style={{ height: "36px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px 0 6px", borderRadius: "9999px", border: "none", background: f.bg, color: f.fg, boxShadow: "0 0 0 1px #E4E4E7", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={f.go}>
                  {(f.hasPic) ? (
                    <>
                    <span style={{ width: "24px", height: "24px", borderRadius: "9999px", backgroundColor: "#EAF2FF", backgroundImage: f.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px ${f.ring}` }} />
                    </>
                  ) : null}
                  <span style={{ paddingLeft: "6px" }}>
                    {f.label}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "3 1 560px", minWidth: "0", background: "#fff", borderRadius: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 16px", borderBottom: "1px solid #F1F1F3" }}>
                <h2 style={{ margin: "0", flex: "1", font: "800 18px 'Plus Jakarta Sans',sans-serif" }}>
                  {cal.title}
                </h2>
                <button style={{ height: "34px", padding: "0 14px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cal.today}>
                  Today
                </button>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={cal.prev} aria-label="Last month">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={cal.next} aria-label="Next month">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", borderBottom: "1px solid #F1F1F3" }}>
                {(cal.dow || []).map((dw: any, dw_i: number) => (
                  <Fragment key={dw_i}>
                    <div style={{ padding: "8px 10px", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#71717a", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {dw}
                    </div>
                  </Fragment>
                ))}
              </div>
              {(cal.weeks || []).map((wk: any, wk_i: number) => (
                <Fragment key={wk_i}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", borderBottom: "1px solid #F1F1F3" }}>
                    {(wk.days || []).map((d: any, d_i: number) => (
                      <Fragment key={d_i}>
                        <button style={{ minHeight: "104px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px", padding: "6px", border: "none", borderRight: "1px solid #F1F1F3", background: d.cellBg, boxShadow: d.ring, textAlign: "left", cursor: "pointer", overflow: "hidden" }} onClick={d.select} className="dc-h56">
                          <span style={{ width: "24px", height: "24px", borderRadius: "9999px", background: d.numBg, color: d.numColor, font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {d.day}
                          </span>
                          {(d.posts || []).map((p: any, p_i: number) => (
                            <Fragment key={p_i}>
                              <span style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: "0", padding: "3px 6px 3px 3px", borderRadius: "8px", background: p.bg, opacity: p.op }}>
                                <span style={{ width: "16px", height: "16px", borderRadius: "9999px", flexShrink: "0", backgroundColor: p.color, backgroundImage: p.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                                <span style={{ minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#18181b", textDecoration: p.deco }}>
                                  {p.title}
                                </span>
                              </span>
                            </Fragment>
                          ))}
                          {(d.hasMore) ? (
                            <>
                            <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717a", paddingLeft: "4px" }}>
                              {d.more}
                            </span>
                            </>
                          ) : null}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <h2 style={{ margin: "0", font: "800 18px 'Plus Jakarta Sans',sans-serif" }}>
                  {cal.selTitle}
                </h2>
                <button style={{ height: "34px", padding: "0 14px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cal.add}>
                  + Add
                </button>
              </div>
              {(cal.noDay) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "28px 20px", border: "1px dashed #CFE0FF", textAlign: "center", font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                  There are no posts on this day. Plan a post, or pick a content idea from an AI talent&apos;s Content tab.
                </div>
                </>
              ) : null}
              {(cal.dayPosts || []).map((p: any, p_i: number) => (
                <Fragment key={p_i}>
                  <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "12px", animation: "aia-in .2s ease-out" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button style={{ width: "36px", height: "36px", borderRadius: "9999px", border: "none", padding: "0", cursor: "pointer", flexShrink: "0", backgroundColor: "#EAF2FF", backgroundImage: p.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 4px ${p.color}` }} onClick={p.openTalent} title={p.talent} />
                      <div style={{ flex: "1", minWidth: "0" }}>
                        <div style={{ font: "700 13px 'Plus Jakarta Sans',sans-serif" }}>
                          {p.talent}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                          <span style={{ width: "14px", height: "14px", backgroundImage: p.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
                          {p.platform} · {p.time}
                        </div>
                      </div>
                      <span style={{ height: "24px", padding: "0 10px", borderRadius: "9999px", background: p.statusBg, color: p.statusFg, font: "700 11px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                        {p.statusText}
                      </span>
                    </div>
                    <div style={{ font: "800 16px/1.3 'Plus Jakarta Sans',sans-serif", textWrap: "pretty" }}>
                      {p.title}
                    </div>
                    {(p.hasContent) ? (
                      <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ height: "24px", padding: "0 10px", borderRadius: "9999px", background: "#EAF2FF", color: "#006AFF", font: "700 11px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                            {p.format}
                          </span>
                        </div>
                        <div style={{ font: "600 13px/1.45 'Plus Jakarta Sans',sans-serif", color: "#3f3f46", fontStyle: "italic" }}>
                          {p.hook}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", borderRadius: "12px", background: "#FAFAFB", border: "1px solid #F1F1F3", overflow: "hidden" }}>
                          <div style={{ padding: "8px 12px", borderBottom: "1px solid #F1F1F3", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                            {p.promptKind}
                          </div>
                          <div style={{ maxHeight: "150px", overflowY: "auto", padding: "10px 12px", font: "500 11px/1.6 ui-monospace,'SF Mono',Menlo,monospace", color: "#3f3f46", whiteSpace: "pre-wrap", userSelect: "text" }}>
                            {p.prompt}
                          </div>
                        </div>
                      </div>
                      </>
                    ) : null}
                    {(p.noContent) ? (
                      <>
                      <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        No content idea is linked to this post.
                      </div>
                      </>
                    ) : null}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", paddingTop: "10px", borderTop: "1px solid #F4F4F5" }}>
                      <button style={{ height: "34px", padding: "0 4px", border: "none", background: "none", color: "#B91C1C", font: "600 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.remove}>
                        Remove
                      </button>
                      <span style={{ flex: "1" }} />
                      {(p.hasContent) ? (
                        <>
                        <button style={{ height: "34px", padding: "0 12px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.copy}>
                          Copy prompt
                        </button>
                        </>
                      ) : null}
                      <button style={{ height: "34px", padding: "0 12px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.edit}>
                        Edit
                      </button>
                      {(p.isSched) ? (
                        <>
                        <button style={{ height: "34px", padding: "0 14px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.posted} className="dc-h57">
                          Mark as posted
                        </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        </>
      ) : null}
    </>
  );
}
