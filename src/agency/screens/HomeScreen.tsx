// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function HomeScreen({ v }: { v: any }) {
  const { agencyName, home, r } = v;
  return (
    <>
      {(r.home) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "32px 24px 64px", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                {agencyName}
              </h1>
            </div>
            <button style={{ height: "42px", padding: "0 18px", borderRadius: "9999px", border: "none", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.05),0 0 0 1px #E4E4E7", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={home.add} className="dc-h30">
              Add AI talent
            </button>
          </div>
          {(home.loading) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                The app loads your numbers.
                {(home.long) ? (
                  <>
                  <span>
                    This step takes more time. Keep this page open.
                  </span>
                  </>
                ) : null}
              </div>
              <div style={{ height: "96px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "20px" }}>
                <div style={{ height: "240px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                <div style={{ height: "240px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                <div style={{ height: "240px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
              </div>
            </div>
            </>
          ) : null}
          {(home.bad) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                The app cannot load your numbers.
              </div>
              <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={home.retry}>
                Try again
              </button>
            </div>
            </>
          ) : null}
          {(home.empty) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
              <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                No AI talents yet
              </div>
              <div style={{ font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b", maxWidth: "420px" }}>
                Add the AI talent that you made in the course. Its numbers, ideas and pitches show here.
              </div>
              <button style={{ height: "46px", padding: "0 24px", marginTop: "6px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={home.add} className="dc-h31">
                Add AI talent
              </button>
            </div>
            </>
          ) : null}
          {(home.ready) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "aia-in .25s ease-out" }}>
              {(home.hasStats) ? (
                <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "16px" }}>
                  {(home.totals || []).map((m: any, m_i: number) => (
                    <Fragment key={m_i}>
                      <div style={{ background: "#fff", borderRadius: "20px", padding: "18px 20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                        <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                          {m.label}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                          <span style={{ font: "800 26px/1.1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181b" }}>
                            {m.value}
                          </span>
                          {(m.hasPct) ? (
                            <>
                            <span style={{ display: "flex", alignItems: "center", gap: "3px", height: "24px", padding: "0 8px", borderRadius: "9999px", background: m.chipBg, color: m.chipFg, font: "700 12px 'Plus Jakarta Sans',sans-serif" }}>
                              <svg style={{ transform: m.rot }} width="11" height="11" viewBox="0 0 14 14" fill="none">
                                <path d="M7 11.5V2.5M3 6.5l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {m.pct}
                            </span>
                            </>
                          ) : null}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ height: "6px", borderRadius: "9999px", background: "#006AFF", width: m.nowW }} />
                          <span style={{ height: "6px", borderRadius: "9999px", background: "#E4E4E7", width: m.prevW }} />
                        </div>
                        <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                          {m.prev}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                {(home.hasTimeNote) ? (
                  <>
                  <div style={{ marginTop: "-10px", font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    {home.timeNote}
                  </div>
                  </>
                ) : null}
                </>
              ) : null}
              {(home.hasStats) ? (
                <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                  <div style={{ flex: "2 1 520px", minWidth: "0", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                        {home.chartTitle}
                      </h2>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {(home.legend || []).map((l: any, l_i: number) => (
                          <Fragment key={l_i}>
                            <button style={{ height: "34px", display: "flex", alignItems: "center", gap: "8px", padding: "0 12px 0 5px", border: "none", borderRadius: "9999px", background: l.bg, boxShadow: `0 0 0 1px ${l.bd}`, font: "700 12px 'Plus Jakarta Sans',sans-serif", color: l.fg, cursor: "pointer", transition: "background .15s,opacity .15s" }} onClick={l.toggle} aria-pressed={l.on} title={l.tip} className="dc-h32">
                              <span style={{ width: "24px", height: "24px", borderRadius: "9999px", flexShrink: "0", backgroundColor: "#fff", backgroundImage: l.picBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 4px ${l.ring}`, filter: l.filter }} />
                              {l.name}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ position: "relative", height: "220px", paddingLeft: "44px", paddingBottom: "24px" }}>
                      <div style={{ position: "absolute", left: "0", right: "0", top: "0", bottom: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                        {(home.ticks || []).map((tk: any, tk_i: number) => (
                          <Fragment key={tk_i}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "0" }}>
                              <span style={{ width: "36px", textAlign: "right", font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#a1a1aa" }}>
                                {tk}
                              </span>
                              <span style={{ flex: "1", height: "1px", background: "#F1F1F3" }} />
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        <svg style={{ position: "absolute", inset: "0", width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 600 200" preserveAspectRatio="none">
                          {(home.lines || []).map((ln: any, ln_i: number) => (
                            <Fragment key={ln_i}>
                              <path d={ln.area} fill={ln.color} fillOpacity="0.07" stroke="none" />
                              <path d={ln.d} fill="none" stroke={ln.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                            </Fragment>
                          ))}
                        </svg>
                        {(home.hov.on) ? (
                          <>
                          <span style={{ position: "absolute", top: "0", bottom: "0", left: home.hov.x, width: "0", borderLeft: "1.5px dashed #A1A1AA", pointerEvents: "none" }} />
                          </>
                        ) : null}
                        {(home.lines || []).map((ln: any, ln_i: number) => (
                          <Fragment key={ln_i}>
                            {(ln.pts || []).map((pt: any, pt_i: number) => (
                              <Fragment key={pt_i}>
                                <span style={{ position: "absolute", left: pt.x, top: pt.y, width: pt.sz, height: pt.sz, transform: "translate(-50%,-50%)", borderRadius: "9999px", background: pt.fill, border: `2.5px solid ${ln.color}`, boxSizing: "border-box", pointerEvents: "none", transition: "width .12s,height .12s" }} />
                              </Fragment>
                            ))}
                          </Fragment>
                        ))}
                        <div style={{ position: "absolute", inset: "-8px 0", display: "flex" }} onMouseLeave={home.hovOff}>
                          {(home.cols || []).map((hc: any, hc_i: number) => (
                            <Fragment key={hc_i}>
                              <div style={{ flex: hc.flex, height: "100%", cursor: "crosshair" }} onMouseEnter={hc.enter} onClick={hc.enter} />
                            </Fragment>
                          ))}
                        </div>
                        {(home.hov.on) ? (
                          <>
                          <div style={{ position: "absolute", top: "0", left: home.hov.x, transform: home.hov.tx, zIndex: "3", minWidth: "190px", background: "#18181b", color: "#fff", borderRadius: "14px", padding: "12px 14px", boxShadow: "0 12px 30px rgba(0,0,0,.25)", pointerEvents: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#A1A1AA" }}>
                              {home.hov.day}
                            </div>
                            {(home.hov.rows || []).map((hr: any, hr_i: number) => (
                              <Fragment key={hr_i}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ width: "20px", height: "20px", borderRadius: "9999px", flexShrink: "0", backgroundColor: hr.color, backgroundImage: hr.picBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", boxShadow: `0 0 0 2px ${hr.color}` }} />
                                  <span style={{ flex: "1", font: "600 13px 'Plus Jakarta Sans',sans-serif" }}>
                                    {hr.name}
                                  </span>
                                  <span style={{ font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                                    {hr.v}
                                  </span>
                                </div>
                              </Fragment>
                            ))}
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,.14)", font: "700 12px 'Plus Jakarta Sans',sans-serif" }}>
                              <span style={{ color: "#A1A1AA" }}>
                                Total
                              </span>
                              <span>
                                {home.hov.total}
                              </span>
                            </div>
                          </div>
                          </>
                        ) : null}
                        {(home.noLines) ? (
                          <>
                          <div style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {home.noPlatforms ? 'No platform numbers yet.' : 'Press a platform above to show its line.'}
                          </div>
                          </>
                        ) : null}
                      </div>
                      <div style={{ position: "absolute", left: "44px", right: "0", bottom: "0", height: "18px" }}>
                        {(home.days || []).map((d: any, d_i: number) => (
                          <Fragment key={d_i}>
                            <span style={{ position: "absolute", left: d.x, transform: "translateX(-50%)", font: "600 11px 'Plus Jakarta Sans',sans-serif", color: d.labelColor }}>
                              {d.label}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: "1 1 280px", minWidth: "0", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                      Engagement by AI talent
                    </h2>
                    <div style={{ flex: "1", minHeight: "200px", display: "flex", alignItems: "stretch", gap: "14px", paddingTop: "6px" }}>
                      {(home.eng || []).map((e: any, e_i: number) => (
                        <Fragment key={e_i}>
                          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }} title={e.tip}>
                            <div style={{ flex: "1", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "5px", borderBottom: "1px solid #E4E4E7" }}>
                              <div style={{ width: "40%", maxWidth: "36px", height: e.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
                                <span style={{ marginTop: "-20px", font: "800 12px 'Plus Jakarta Sans',sans-serif", color: "#18181b", whiteSpace: "nowrap" }}>
                                  {e.value}
                                </span>
                                <span style={{ flex: "1", width: "100%", marginTop: "4px", borderRadius: "8px 8px 0 0", background: e.color }} />
                              </div>
                              <div style={{ width: "22%", maxWidth: "20px", height: e.ph, borderRadius: "6px 6px 0 0", background: e.color, opacity: ".28" }} />
                            </div>
                            <span style={{ width: "28px", height: "28px", borderRadius: "9999px", flexShrink: "0", backgroundColor: "#EAF2FF", backgroundImage: e.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 3.5px ${e.color}` }} />
                            <span style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                              {e.first}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#18181b" }} />
                        This week
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#18181b", opacity: ".28" }} />
                        Last week
                      </span>
                    </div>
                  </div>
                </div>
                </>
              ) : null}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px", alignItems: "stretch" }}>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                      AI talents
                    </h2>
                    <button style={{ border: "none", background: "none", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#006AFF", cursor: "pointer" }} onClick={home.seeAll}>
                      See all
                    </button>
                  </div>
                  {(home.rows || []).map((t: any, t_i: number) => (
                    <Fragment key={t_i}>
                      <button style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={t.open} className="dc-h33">
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", overflow: "hidden", flexShrink: "0", background: t.tint, display: "flex", alignItems: "center", justifyContent: "center", font: "800 15px 'Plus Jakarta Sans',sans-serif", color: "#006AFF" }}>
                          {(t.hasPic) ? (
                            <>
                            <div style={{ width: "100%", height: "100%", backgroundImage: t.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                            </>
                          ) : null}
                          {(t.noPic) ? (
                            <>
                            <span>
                              {t.initials}
                            </span>
                            </>
                          ) : null}
                        </div>
                        <div style={{ flex: "1", minWidth: "0" }}>
                          <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                            {t.name}
                          </div>
                          <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {t.views}
                          </div>
                          {(t.hasNumbers) ? (
                            <>
                            <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a", marginTop: "2px" }}>
                              {t.numbers}
                            </div>
                            </>
                          ) : null}
                        </div>
                        {(t.hasV) ? (
                          <>
                          <span style={{ display: "flex", alignItems: "center", gap: "3px", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: t.color }}>
                            <svg style={{ transform: t.rot }} width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M7 11.5V2.5M3 6.5l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t.delta}
                          </span>
                          </>
                        ) : null}
                      </button>
                    </Fragment>
                  ))}
                  {(home.alerts || []).map((a: any, a_i: number) => (
                    <Fragment key={a_i}>
                      <button style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", padding: "10px 12px", border: "none", borderRadius: "12px", background: "#FEECEC", textAlign: "left", cursor: "pointer", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} onClick={a.open}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#B91C1C", flexShrink: "0" }} />
                        {a.text}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                      Ideas for you
                    </h2>
                    <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                      {home.ideasCount}
                    </span>
                  </div>
                  {(home.ideas || []).map((i: any, i_i: number) => (
                    <Fragment key={i_i}>
                      <button style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={i.open} title={i.talent} className="dc-h34">
                        <span style={{ width: "32px", height: "32px", borderRadius: "9999px", flexShrink: "0", backgroundColor: "#EAF2FF", backgroundImage: i.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 2px #fff,0 0 0 3.5px ${i.color}` }} />
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ font: "700 14px/1.35 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                            {i.title}
                          </span>
                          <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {i.kind}
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {(home.noIdeas) ? (
                    <>
                    <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                      Connect an account. Then ideas to grow each AI talent show here.
                    </div>
                    </>
                  ) : null}
                </div>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2 style={{ margin: "0 0 10px", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                    Brands and pitches
                  </h2>
                  {(home.hasPitches) ? (
                    <>
                    <div style={{ display: "flex", gap: "3px", height: "10px", marginBottom: "10px" }}>
                      {(home.pipe || []).map((pp: any, pp_i: number) => (
                        <Fragment key={pp_i}>
                          <div style={{ flex: pp.n, background: pp.color, borderRadius: "9999px" }} />
                        </Fragment>
                      ))}
                    </div>
                    </>
                  ) : null}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ background: "#FAFAFB", borderRadius: "12px", padding: "10px 12px" }}>
                      <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                        {home.pc.draft}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#CFE0FF" }} />
                        Draft
                      </div>
                    </div>
                    <div style={{ background: "#FAFAFB", borderRadius: "12px", padding: "10px 12px" }}>
                      <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                        {home.pc.approved}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#4F8BFF" }} />
                        Approved
                      </div>
                    </div>
                    <div style={{ background: "#FAFAFB", borderRadius: "12px", padding: "10px 12px" }}>
                      <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                        {home.pc.sent}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#006AFF" }} />
                        Sent
                      </div>
                    </div>
                  </div>
                  {(home.todo || []).map((p: any, p_i: number) => (
                    <Fragment key={p_i}>
                      <button style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={p.open} className="dc-h35">
                        <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                          {p.text}
                        </span>
                        <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                          {p.sub}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {(home.hasBrands) ? (
                    <>
                    <button style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={home.goScout} className="dc-h36">
                      <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                        {home.brandText}
                      </span>
                      <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        {home.brandSub}
                      </span>
                    </button>
                    </>
                  ) : null}
                  {(home.hasFlags) ? (
                    <>
                    <button style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 8px", margin: "0 -8px", border: "none", background: "none", borderRadius: "12px", textAlign: "left", cursor: "pointer" }} onClick={home.goFlagged} className="dc-h37">
                      <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                        {home.flagText}
                      </span>
                      <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        Look at them in History
                      </span>
                    </button>
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
    </>
  );
}
