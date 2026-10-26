// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function TalentScreen({ v }: { v: any }) {
  const { cur, goTalents, r } = v;
  return (
    <>
      {(r.talent) ? (
        <>
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "28px 24px 64px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <button style={{ alignSelf: "flex-start", height: "32px", display: "flex", alignItems: "center", gap: "4px", padding: "0", border: "none", background: "none", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b", cursor: "pointer" }} onClick={goTalents}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Talents
          </button>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "20px", overflow: "hidden", flexShrink: "0", background: cur.tint, display: "flex", alignItems: "center", justifyContent: "center", font: "800 26px 'Plus Jakarta Sans',sans-serif", color: "#006AFF", position: "relative" }}>
              {(cur.hasPic) ? (
                <>
                <div style={{ position: "absolute", inset: "0", backgroundImage: cur.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                </>
              ) : null}
              {(cur.noPic) ? (
                <>
                <span>
                  {cur.initials}
                </span>
                </>
              ) : null}
            </div>
            <div style={{ flex: "1 1 240px", minWidth: "0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ margin: "0", font: "800 28px/1.15 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
                  {cur.name}
                </h1>
                <div style={{ position: "relative" }}>
                  <button style={{ width: "22px", height: "22px", borderRadius: "9999px", border: "none", padding: "0", cursor: "pointer", background: cur.color, boxShadow: "0 0 0 2px #fff,0 0 0 3px #E4E4E7", display: "block" }} onClick={cur.toggleColor} aria-label="Change colour" title="Colour" aria-expanded={cur.colorOpen} />
                  {(cur.colorOpen) ? (
                    <>
                    <div style={{ position: "absolute", left: "-8px", top: "32px", zIndex: "10", background: "#fff", border: "1px solid #E4E4E7", borderRadius: "14px", boxShadow: "0 8px 30px rgba(24,24,27,.12)", padding: "12px", display: "flex", flexDirection: "column", gap: "12px", width: "212px" }}>
                      <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                        Colour
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,28px)", gap: "10px" }}>
                        {(cur.swatches || []).map((w: any, w_i: number) => (
                          <Fragment key={w_i}>
                            <button style={{ width: "28px", height: "28px", borderRadius: "9999px", border: "none", padding: "0", cursor: "pointer", background: w.hex, boxShadow: w.ring }} onClick={w.pick} aria-label={w.name} title={w.name} />
                          </Fragment>
                        ))}
                        <label style={{ position: "relative", width: "28px", height: "28px", borderRadius: "9999px", cursor: "pointer", background: "conic-gradient(#EF4444,#F59E0B,#10B981,#14B8A6,#006AFF,#8B5CF6,#EC4899,#EF4444)", boxShadow: cur.cp.cRing, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }} title="Custom colour">
                          <span style={{ width: "14px", height: "14px", borderRadius: "9999px", background: cur.cp.cFill, boxShadow: "0 0 0 2px #fff" }} />
                          <input style={{ position: "absolute", inset: "0", opacity: "0", width: "100%", height: "100%", cursor: "pointer", border: "none", padding: "0" }} type="color" value={cur.cp.hex} onChange={cur.cp.onPick} />
                        </label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 10px 0 6px", borderRadius: "9999px", background: "#FAFAFB", boxShadow: "0 0 0 1px #E4E4E7" }}>
                        <span style={{ width: "20px", height: "20px", borderRadius: "9999px", background: cur.cp.hex }} />
                        <input style={{ width: "70px", border: "none", background: "none", outline: "none", font: "600 13px ui-monospace,'SF Mono',Menlo,monospace", color: "#18181b", textTransform: "uppercase" }} value={cur.cp.hexVal} onChange={cur.cp.onHex} onBlur={cur.cp.onHexBlur} maxLength={7} spellCheck="false" aria-label="Hex colour" />
                      </div>
                    </div>
                    </>
                  ) : null}
                </div>
              </div>
              <div style={{ font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#52525b", marginTop: "4px" }}>
                {cur.niche}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ height: "40px", padding: "0 18px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.edit} className="dc-h46">
                Edit
              </button>
              <button style={{ height: "40px", padding: "0 18px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#B91C1C", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.del} className="dc-h47">
                Delete
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "28px", borderBottom: "1px solid #E4E4E7" }}>
            {(cur.tabs || []).map((tb: any, tb_i: number) => (
              <Fragment key={tb_i}>
                <button style={{ height: "44px", padding: "0", border: "none", borderBottom: `2px solid ${tb.line}`, marginBottom: "-1px", background: "none", color: tb.color, font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={tb.go}>
                  {tb.label}
                </button>
              </Fragment>
            ))}
          </div>
          {(cur.isOverview) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "aia-in .2s ease-out" }}>
              {(cur.noAccounts) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif" }}>
                    Connect an account. Then the app can read your numbers.
                  </div>
                  <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                    TikTok, Instagram, YouTube or Facebook.
                  </div>
                  <button style={{ height: "46px", padding: "0 24px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.connect}>
                    Connect account
                  </button>
                </div>
                </>
              ) : null}
              {(cur.lost) ? (
                <>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "14px", background: "#FEECEC" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#B91C1C", flexShrink: "0" }} />
                  <span style={{ flex: "1 1 260px", font: "600 14px/1.45 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                    {cur.lostText}
                  </span>
                  <button style={{ height: "38px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.reconnectLost}>
                    Reconnect
                  </button>
                </div>
                </>
              ) : null}
              {(cur.handleOnly) ? (
                <>
                <div style={{ padding: "14px 16px", borderRadius: "14px", background: "#F4F4F5", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Numbers are not available. Accounts that you add by handle do not share numbers. Connect the account to see the numbers.
                </div>
                </>
              ) : null}
              {(cur.hasMetrics) ? (
                <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
                  {(cur.metrics || []).map((m: any, m_i: number) => (
                    <Fragment key={m_i}>
                      <div style={{ background: "#fff", borderRadius: "20px", padding: "18px 20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                          {m.label}
                        </span>
                        <span style={{ font: m.na ? "700 18px 'Plus Jakarta Sans',sans-serif" : "800 28px 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: m.na ? "#71717a" : "#18181b" }}>
                          {m.value}
                        </span>
                        {(m.na) ? (
                          <>
                          <span style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {m.sub}
                          </span>
                          </>
                        ) : null}
                        {(m.hasDelta) ? (
                          <>
                          <span style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "4px", height: "26px", padding: "0 10px", borderRadius: "9999px", background: m.chip, color: m.color, font: "700 12px 'Plus Jakarta Sans',sans-serif" }}>
                            <svg style={{ transform: m.rot }} width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M7 11.5V2.5M3 6.5l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {m.delta}
                          </span>
                          </>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ flex: "2 1 460px", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                        Views each day
                      </h2>
                      <div style={{ display: "flex", gap: "14px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "16px", height: "3px", borderRadius: "2px", background: cur.an.color }} />
                          This week
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "16px", height: "0", borderTop: "2px dashed #A1A1AA" }} />
                          Last week
                        </span>
                      </div>
                    </div>
                    <div style={{ position: "relative", height: "200px", paddingLeft: "44px", paddingBottom: "22px" }}>
                      <div style={{ position: "absolute", left: "0", right: "0", top: "0", bottom: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                        {(cur.an.ticks || []).map((tk: any, tk_i: number) => (
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
                          <path d={cur.an.prevD} fill="none" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                          <path d={cur.an.area} fill={cur.an.color} fillOpacity="0.08" />
                          <path d={cur.an.nowD} fill="none" stroke={cur.an.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        </svg>
                        {(cur.an.pts || []).map((pt: any, pt_i: number) => (
                          <Fragment key={pt_i}>
                            <span style={{ position: "absolute", left: pt.x, top: pt.y, width: "10px", height: "10px", margin: "-5px 0 0 -5px", borderRadius: "9999px", background: "#fff", border: `2.5px solid ${cur.an.color}`, boxSizing: "border-box" }} title={pt.tip} />
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ position: "absolute", left: "44px", right: "0", bottom: "0", height: "16px" }}>
                        {(cur.an.days || []).map((d: any, d_i: number) => (
                          <Fragment key={d_i}>
                            <span style={{ position: "absolute", left: d.x, transform: "translateX(-50%)", font: "600 11px 'Plus Jakarta Sans',sans-serif", color: d.c }}>
                              {d.l}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                      {cur.an.dayNote}
                    </div>
                  </div>
                  <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                    <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                      Views by platform
                    </h2>
                    <div style={{ display: "flex", height: "12px", borderRadius: "9999px", overflow: "hidden", gap: "2px" }}>
                      {(cur.an.plats || []).map((p: any, p_i: number) => (
                        <Fragment key={p_i}>
                          <span style={{ flex: p.share, background: p.bar }} />
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {(cur.an.plats || []).map((p: any, p_i: number) => (
                        <Fragment key={p_i}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderTop: "1px solid #F4F4F5" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: p.bar, flexShrink: "0" }} />
                            <span style={{ width: "22px", height: "22px", backgroundImage: p.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", flexShrink: "0" }} />
                            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                              <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif" }}>
                                {p.name}
                              </span>
                              <span style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                                {p.sub}
                              </span>
                            </span>
                            <span style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
                              <span style={{ font: "800 14px 'Plus Jakarta Sans',sans-serif" }}>
                                {p.views}
                              </span>
                              <span style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                                {p.pct}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {(cur.an.hasHandleOnly) ? (
                      <>
                      <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        {cur.an.handleNote}
                      </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ flex: "2 1 460px", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                      <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                        Top posts this week
                      </h2>
                      <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        By views
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {(cur.an.top || []).map((p: any, p_i: number) => (
                        <Fragment key={p_i}>
                          <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) minmax(90px,160px) 64px", gap: "12px", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F4F4F5" }}>
                            <span style={{ width: "28px", height: "28px", borderRadius: "9999px", background: p.rankBg, color: p.rankFg, font: "800 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {p.rank}
                            </span>
                            <span style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.title}
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                                <span style={{ width: "14px", height: "14px", backgroundImage: p.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
                                {p.meta}
                              </span>
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                                {p.views}
                              </span>
                              <span style={{ height: "6px", borderRadius: "9999px", background: "#F4F4F5" }}>
                                <span style={{ display: "block", height: "100%", width: p.w, borderRadius: "9999px", background: cur.an.color }} />
                              </span>
                            </span>
                            <span style={{ textAlign: "right", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }} title="Engagement">
                              {p.eng}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                        Best time to post
                      </h2>
                      <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        When the audience watches most
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7,minmax(0,1fr))", gap: "4px", alignItems: "center" }}>
                      <span />
                      {(cur.an.dowL || []).map((dl: any, dl_i: number) => (
                        <Fragment key={dl_i}>
                          <span style={{ textAlign: "center", font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {dl}
                          </span>
                        </Fragment>
                      ))}
                      {(cur.an.heat || []).map((hr: any, hr_i: number) => (
                        <Fragment key={hr_i}>
                          <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {hr.label}
                          </span>
                          {(hr.cells || []).map((c: any, c_i: number) => (
                            <Fragment key={c_i}>
                              <span style={{ aspectRatio: "1/1", borderRadius: "6px", background: c.bg, boxShadow: c.ring }} title={c.tip} />
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#FAFAFB", font: "600 13px 'Plus Jakarta Sans',sans-serif" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: cur.an.color }} />
                      Best: {cur.an.best}
                    </div>
                  </div>
                </div>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                      Engagement breakdown
                    </h2>
                    <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                      {cur.an.engTotal}
                    </span>
                  </div>
                  <div style={{ display: "flex", height: "14px", borderRadius: "9999px", overflow: "hidden", gap: "2px" }}>
                    {(cur.an.eng || []).map((e: any, e_i: number) => (
                      <Fragment key={e_i}>
                        <span style={{ flex: e.n, background: e.bg }} />
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px" }}>
                    {(cur.an.eng || []).map((e: any, e_i: number) => (
                      <Fragment key={e_i}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: e.bg }} />
                            {e.label}
                          </span>
                          <span style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.01em" }}>
                            {e.v}
                          </span>
                          <span style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {e.pct}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                </>
              ) : null}
              {(cur.hasAccounts) ? (
                <>
                </>
              ) : null}
            </div>
            </>
          ) : null}
          {(cur.isAccounts) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", animation: "aia-in .2s ease-out" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "8px 20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 0" }}>
                  <h2 style={{ margin: "0", font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                    Social media accounts
                  </h2>
                </div>
                {(cur.platRows || []).map((p: any, p_i: number) => (
                  <Fragment key={p_i}>
                    <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #F4F4F5", padding: "14px 0", gap: "10px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                        <span style={{ width: "36px", height: "36px", flexShrink: "0", backgroundImage: p.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", filter: p.filter }} />
                        {(p.noLogo) ? (
                          <>
                          <span style={{ width: "36px", height: "36px", marginLeft: "-48px", borderRadius: "10px", background: p.ytBg, color: "#fff", font: "800 14px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                            ▶
                          </span>
                          </>
                        ) : null}
                        <div style={{ flex: "1 1 160px", minWidth: "0" }}>
                          <div style={{ font: "700 15px 'Plus Jakarta Sans',sans-serif" }}>
                            {p.name}
                          </div>
                          <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                            {p.sub}
                          </div>
                        </div>
                        {(p.isOn) ? (
                          <>
                          <span style={{ height: "28px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", borderRadius: "9999px", background: p.badgeBg, color: p.badgeFg, font: "700 12px 'Plus Jakarta Sans',sans-serif" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "9999px", background: p.badgeFg }} />
                            {p.badge}
                          </span>
                          </>
                        ) : null}
                        {(p.isOff) ? (
                          <>
                          <button style={{ height: "36px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.connect} className="dc-h48">
                            Connect
                          </button>
                          </>
                        ) : null}
                      </div>
                      {(p.accs || []).map((a: any, a_i: number) => (
                        <Fragment key={a_i}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginLeft: "48px", padding: "10px 12px", borderRadius: "12px", background: "#FAFAFB" }}>
                            <div style={{ flex: "1 1 180px", minWidth: "0" }}>
                              <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif" }}>
                                {a.handle}
                              </div>
                              <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: a.subColor }}>
                                {a.sub}
                              </div>
                            </div>
                            {(a.canRefresh) ? (
                              <>
                              <button style={{ height: "32px", padding: "0 12px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={a.refresh}>
                                Refresh
                              </button>
                              </>
                            ) : null}
                            {(a.canReconnect) ? (
                              <>
                              <button style={{ height: "32px", padding: "0 12px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={a.reconnect}>
                                Reconnect
                              </button>
                              </>
                            ) : null}
                            <button style={{ height: "32px", padding: "0 6px", border: "none", background: "none", color: "#71717a", font: "600 12px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={a.disconnect}>
                              Disconnect
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                The app only reads the numbers. It does not post or send items.
              </div>
            </div>
            </>
          ) : null}
          {(cur.isGrow) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "aia-in .2s ease-out" }}>
              {(cur.grow.needsAccount) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif" }}>
                    Connect an account. Then the app can read your numbers.
                  </div>
                  <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b", maxWidth: "420px" }}>
                    Each growth idea uses a real number. Connect one account or more.
                  </div>
                  <button style={{ height: "46px", padding: "0 24px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.connect}>
                    Connect account
                  </button>
                </div>
                </>
              ) : null}
              {(cur.grow.loading) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Reading {cur.first}&apos;s numbers to write ideas.
                    {(cur.grow.long) ? (
                      <>
                      <span>
                        This step takes more time. Keep this page open.
                      </span>
                      </>
                    ) : null}
                  </div>
                  <div style={{ height: "86px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                  <div style={{ height: "86px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                  <div style={{ height: "86px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                </div>
                </>
              ) : null}
              {(cur.grow.bad) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    The app cannot write ideas now.
                  </div>
                  {(cur.grow.stalled) ? (
                    <>
                    <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                      The step took too much time. The app stopped it.
                    </div>
                    </>
                  ) : null}
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.grow.retry}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
              {(cur.grow.empty) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    There are no ideas
                  </div>
                  <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b", maxWidth: "440px" }}>
                    3 to 5 ideas to grow {cur.first}&apos;s views and engagement will appear here. Each one is based on a real number.
                  </div>
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.grow.more}>
                    Show ideas
                  </button>
                </div>
                </>
              ) : null}
              {(cur.grow.ready) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <p style={{ margin: "0", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                      These ideas help you grow views and engagement. Mark each idea Done, or dismiss it.
                    </p>
                    <button style={{ height: "38px", padding: "0 16px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.grow.more}>
                      Show new ideas
                    </button>
                  </div>
                  {(cur.grow.few) ? (
                    <>
                    <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#EAF2FF", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                      {cur.grow.fewText}
                    </div>
                    </>
                  ) : null}
                  {(cur.grow.ideas || []).map((i: any, i_i: number) => (
                    <Fragment key={i_i}>
                      <div style={{ background: "#fff", borderRadius: "18px", padding: "18px 20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 20px", opacity: i.op, animation: "aia-in .25s ease-out" }}>
                        <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ font: "700 16px/1.35 'Plus Jakarta Sans',sans-serif" }}>
                            {i.title}
                          </div>
                          <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                            {i.why}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {(i.flagged) ? (
                            <>
                            <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }}>
                              Flagged
                            </span>
                            </>
                          ) : null}
                          {(!i.flagged) ? (
                            <>
                            <button style={{ height: "34px", padding: "0", border: "none", background: "none", color: "#71717a", font: "600 13px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={i.flag}>
                              This looks wrong
                            </button>
                            </>
                          ) : null}
                          {(i.isNew) ? (
                            <>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button style={{ height: "38px", padding: "0 16px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={i.dismiss}>
                                Dismiss
                              </button>
                              <button style={{ height: "38px", padding: "0 18px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={i.done}>
                                Done
                              </button>
                            </div>
                            </>
                          ) : null}
                          {(i.isDone) ? (
                            <>
                            <span style={{ height: "30px", padding: "0 12px", borderRadius: "9999px", background: "#EAF2FF", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                              Done
                            </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
            </div>
            </>
          ) : null}
          {(cur.isContent) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "aia-in .2s ease-out" }}>
              {(cur.content.loading) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Reading {cur.first}&apos;s story and numbers to write content ideas.
                    {(cur.content.long) ? (
                      <>
                      <span>
                        This step takes more time. Keep this page open.
                      </span>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,320px),1fr))", gap: "16px" }}>
                    <div style={{ height: "280px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ height: "280px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ height: "280px", borderRadius: "20px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                  </div>
                </div>
                </>
              ) : null}
              {(cur.content.bad) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    The app cannot write content ideas now.
                  </div>
                  {(cur.content.stalled) ? (
                    <>
                    <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                      The step took too much time. The app stopped it.
                    </div>
                    </>
                  ) : null}
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.content.retry}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
              {(cur.content.empty) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    There are no content ideas
                  </div>
                  <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b", maxWidth: "440px" }}>
                    Ideas for {cur.first}&apos;s next posts will appear here, each with a hook and the steps to film it.
                  </div>
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.content.more}>
                    Show content ideas
                  </button>
                </div>
                </>
              ) : null}
              {(cur.content.ready) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <p style={{ margin: "0", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                        Ideas for what {cur.first} can post next. Plan an idea on the calendar, post it yourself, then mark it as posted.
                      </p>
                    </div>
                    <button style={{ height: "38px", padding: "0 16px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.content.more}>
                      Show new ideas
                    </button>
                  </div>
                  {(cur.content.noAccount) ? (
                    <>
                    <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#EAF2FF", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                      These ideas use only the niche and the character story. Connect an account to get ideas based on numbers.
                    </div>
                    </>
                  ) : null}
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "stretch", overflowX: "auto", scrollSnapType: "x mandatory", scrollPadding: "0 2px", padding: "2px 2px 12px", scrollbarWidth: "none", overscrollBehaviorX: "contain" }} ref={cur.content.railRef}>
                      {(cur.content.items || []).map((c: any, c_i: number) => (
                        <Fragment key={c_i}>
                          <div style={{ flex: "0 0 min(340px,86%)", scrollSnapAlign: "start", background: "#fff", borderRadius: "20px", padding: "18px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "14px", opacity: c.op, animation: "aia-in .25s ease-out" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ width: "24px", height: "24px", backgroundImage: c.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", flexShrink: "0" }} title={c.platform} />
                              <span style={{ height: "26px", padding: "0 10px", borderRadius: "9999px", background: "#EAF2FF", color: "#006AFF", font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                                {c.format}
                              </span>
                              <span style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                                {c.length}
                              </span>
                              <span style={{ flex: "1" }} />
                              {(c.isPlanned) ? (
                                <>
                                <span style={{ height: "26px", padding: "0 10px", borderRadius: "9999px", background: "#006AFF", color: "#fff", font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                                  In plan
                                </span>
                                </>
                              ) : null}
                              {(c.isPosted) ? (
                                <>
                                <span style={{ height: "26px", padding: "0 10px", borderRadius: "9999px", background: "#F4F4F5", color: "#52525b", font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center" }}>
                                  Posted
                                </span>
                                </>
                              ) : null}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <div style={{ font: "800 17px/1.3 'Plus Jakarta Sans',sans-serif", color: "#18181b", textWrap: "pretty" }}>
                                {c.title}
                              </div>
                              <div style={{ font: "600 14px/1.45 'Plus Jakarta Sans',sans-serif", color: "#3f3f46", fontStyle: "italic" }}>
                                {c.hook}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", borderRadius: "14px", background: "#FAFAFB", border: "1px solid #F1F1F3", overflow: "hidden" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 8px 8px 12px", borderBottom: "1px solid #F1F1F3" }}>
                                <span style={{ flex: "1", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                                  {c.promptKind}
                                </span>
                                <button style={{ height: "30px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 12px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={c.copyPrompt} className="dc-h49">
                                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                    <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
                                    <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.6" />
                                  </svg>
                                  Copy prompt
                                </button>
                              </div>
                              <div style={{ maxHeight: "168px", overflowY: "auto", padding: "10px 12px", font: "500 12px/1.6 ui-monospace,'SF Mono',Menlo,monospace", color: "#3f3f46", whiteSpace: "pre-wrap", userSelect: "text" }}>
                                {c.prompt}
                              </div>
                            </div>
                            <div style={{ font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                              <span style={{ fontWeight: "700", color: "#18181b" }}>
                                Why:
                              </span>
                              {c.why}
                            </div>
                            {(c.hasSched) ? (
                              <>
                              <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", border: "none", borderRadius: "12px", background: "#EAF2FF", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", textAlign: "left" }} onClick={c.seeCal}>
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                                  <rect x="2" y="3" width="12" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M2 6.5h12M5.5 1.8v2.4M10.5 1.8v2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span style={{ flex: "1" }}>
                                  {c.schedText}
                                </span>
                                <span>
                                  See in calendar
                                </span>
                              </button>
                              </>
                            ) : null}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6.2" stroke="#006AFF" strokeWidth="1.6" />
                                <path d="M8 4.8V8l2.2 1.4" stroke="#006AFF" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                              Best time: {c.when}
                            </div>
                            <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #F4F4F5", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                              {(c.flagged) ? (
                                <>
                                <span style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }}>
                                  Flagged
                                </span>
                                </>
                              ) : null}
                              {(!c.flagged) ? (
                                <>
                                <button style={{ height: "34px", padding: "0", border: "none", background: "none", color: "#71717a", font: "600 13px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={c.flag}>
                                  This looks wrong
                                </button>
                                </>
                              ) : null}
                              <span style={{ flex: "1" }} />
                              {(c.isNew) ? (
                                <>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button style={{ height: "36px", padding: "0 14px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={c.dismiss}>
                                    Dismiss
                                  </button>
                                  <button style={{ height: "36px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={c.plan} className="dc-h50">
                                    Plan
                                  </button>
                                </div>
                                </>
                              ) : null}
                              {(c.isPlanned) ? (
                                <>
                                <button style={{ height: "36px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={c.posted} className="dc-h51">
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
            </div>
            </>
          ) : null}
          {(cur.isScout) ? (
            <>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "aia-in .2s ease-out" }}>
              <p style={{ margin: "0", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                Brands that fit {cur.first}&apos;s niche and story, and where to approach each. I only suggest. Nothing is sent.
              </p>
              {(cur.scout.loading) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Looking for brands that fit {cur.first}.
                    {(cur.scout.long) ? (
                      <>
                      <span>
                        This step takes more time. Keep this page open.
                      </span>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
                    <div style={{ height: "200px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ height: "200px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ height: "200px", borderRadius: "18px", background: "#E4E4E7", animation: "aia-pulse 1.4s ease-in-out infinite" }} />
                  </div>
                </div>
                </>
              ) : null}
              {(cur.scout.bad) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    The app cannot find brand ideas now.
                  </div>
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.scout.retry}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
              {(cur.scout.empty) ? (
                <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
                  <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif" }}>
                    Scout has no brand ideas for {cur.first} yet.
                  </div>
                  <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    Ask Scout to look again for brands that fit {cur.first}&apos;s niche.
                  </div>
                  <button style={{ height: "42px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={cur.scout.retry}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
              {(cur.scout.ready) ? (
                <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
                  {(cur.scout.brands || []).map((b: any, b_i: number) => (
                    <Fragment key={b_i}>
                      <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "12px", animation: "aia-in .25s ease-out" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EAF2FF", color: "#006AFF", display: "flex", alignItems: "center", justifyContent: "center", font: "800 16px 'Plus Jakarta Sans',sans-serif", flexShrink: "0" }}>
                            {b.initial}
                          </div>
                          <div style={{ flex: "1", minWidth: "0" }}>
                            <div style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif" }}>
                              {b.name}
                            </div>
                            <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                              {b.what}
                            </div>
                          </div>
                          {(b.hasStatus) ? (
                            <>
                            <span style={{ height: "26px", padding: "0 10px", borderRadius: "9999px", background: "#F4F4F5", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46", display: "flex", alignItems: "center" }}>
                              {b.status}
                            </span>
                            </>
                          ) : null}
                        </div>
                        <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                          <span style={{ fontWeight: "700", color: "#18181b" }}>
                            Why:
                          </span>
                          {b.why}
                        </div>
                        <div style={{ font: "500 14px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                          <span style={{ fontWeight: "700", color: "#18181b" }}>
                            How to contact:
                          </span>
                          {b.where}
                        </div>
                        <div style={{ flex: "1" }} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", paddingTop: "12px", borderTop: "1px solid #F4F4F5" }}>
                          {(b.notFlagged) ? (
                            <>
                            <button style={{ height: "34px", padding: "0", border: "none", background: "none", color: "#71717a", font: "600 13px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={b.flag}>
                              This looks wrong
                            </button>
                            </>
                          ) : null}
                          {(b.flagged) ? (
                            <>
                            <span style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C" }}>
                              Flagged
                            </span>
                            </>
                          ) : null}
                          <button style={{ height: "40px", padding: "0 18px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={b.draft} className="dc-h52">
                            {b.label}
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
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
