// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';

export function TalentFormScreen({ v }: { v: any }) {
  const { form, r } = v;
  return (
    <>
      {(r.form) ? (
        <>
        <div style={{ maxWidth: "880px", width: "100%", margin: "0 auto", padding: "28px 24px 64px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <button style={{ alignSelf: "flex-start", height: "36px", display: "flex", alignItems: "center", gap: "4px", padding: "0", border: "none", background: "none", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b", cursor: "pointer" }} onClick={form.cancel}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {form.back}
          </button>
          <h1 style={{ margin: "0", font: "800 28px/1.2 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em" }}>
            {form.title}
          </h1>
          {(form.resumed) ? (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", background: "#EAF2FF", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#006AFF" }} />
              Picking up where you left off
            </div>
            </>
          ) : null}
          {(form.isNew) ? (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "4px 0" }}>
              {(form.steps || []).map((st: any, st_i: number) => (
                <Fragment key={st_i}>
                  <div style={{ display: "flex", alignItems: "center", flex: st.flex, minWidth: "0" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0", border: "none", background: "none", cursor: st.cursor, minWidth: "0" }} onClick={st.go} disabled={st.locked}>
                      <span style={{ width: "34px", height: "34px", borderRadius: "9999px", flexShrink: "0", background: st.bg, color: st.fg, boxShadow: st.ring, font: "800 14px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
                        {st.mark}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "0" }}>
                        <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717a", whiteSpace: "nowrap" }}>
                          Step {st.n}
                        </span>
                        <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: st.labelC, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {st.label}
                        </span>
                      </span>
                    </button>
                    {(st.hasLine) ? (
                      <>
                      <span style={{ flex: "1", minWidth: "16px", height: "2px", margin: "0 14px", borderRadius: "2px", background: st.line }} />
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ height: "4px", borderRadius: "9999px", background: "#EAF2FF", overflow: "hidden", marginTop: "-8px" }}>
              <div style={{ height: "100%", width: form.progress, background: "#006AFF", borderRadius: "9999px", transition: "width .3s" }} />
            </div>
            </>
          ) : null}
          {(form.show1) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "9999px", background: form.s1Bg, color: form.s1Fg, font: "800 13px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                  1
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                    Picture, name and colour
                  </h2>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
                <label style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46", cursor: "pointer" }}>
                  Picture
                  <div style={{ position: "relative", width: "220px", aspectRatio: "4/5", borderRadius: "16px", overflow: "hidden", background: "#FAFAFB", border: "2px dashed #CFE0FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", textAlign: "center", padding: "16px" }} className="dc-h41">
                    {(form.hasPic) ? (
                      <>
                      <div style={{ position: "absolute", inset: "0", backgroundImage: form.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                      </>
                    ) : null}
                    {(form.noPic) ? (
                      <>
                      <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#006AFF" }}>
                        Upload picture
                      </span>
                      </>
                    ) : null}
                  </div>
                  <input style={{ display: "none" }} type="file" accept="image/*" onChange={form.onPic} />
                  {(form.hasPic) ? (
                    <>
                    <span style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#006AFF" }}>
                      Change picture
                    </span>
                    </>
                  ) : null}
                </label>
                <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Name
                    <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} value={form.name} onChange={form.onName} placeholder="e.g. Luna Reyes" />
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Colour
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                      {(form.swatches || []).map((w: any, w_i: number) => (
                        <Fragment key={w_i}>
                          <button style={{ width: "28px", height: "28px", borderRadius: "9999px", border: "none", padding: "0", cursor: "pointer", background: w.hex, boxShadow: w.ring }} onClick={w.pick} aria-label={w.name} title={w.name} />
                        </Fragment>
                      ))}
                      <label style={{ position: "relative", width: "28px", height: "28px", borderRadius: "9999px", cursor: "pointer", background: "conic-gradient(#EF4444,#F59E0B,#10B981,#14B8A6,#006AFF,#8B5CF6,#EC4899,#EF4444)", boxShadow: form.cp.cRing, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }} title="Custom colour">
                        <span style={{ width: "14px", height: "14px", borderRadius: "9999px", background: form.cp.cFill, boxShadow: "0 0 0 2px #fff" }} />
                        <input style={{ position: "absolute", inset: "0", opacity: "0", width: "100%", height: "100%", cursor: "pointer", border: "none", padding: "0" }} type="color" value={form.cp.hex} onChange={form.cp.onPick} />
                      </label>
                      <span style={{ width: "1px", height: "22px", background: "#E4E4E7", margin: "0 2px" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "32px", padding: "0 10px 0 6px", borderRadius: "9999px", background: "#FAFAFB", boxShadow: "0 0 0 1px #E4E4E7" }}>
                        <span style={{ width: "20px", height: "20px", borderRadius: "9999px", background: form.cp.hex }} />
                        <input style={{ width: "70px", border: "none", background: "none", outline: "none", font: "600 13px ui-monospace,'SF Mono',Menlo,monospace", color: "#18181b", textTransform: "uppercase" }} value={form.cp.hexVal} onChange={form.cp.onHex} onBlur={form.cp.onHexBlur} maxLength={7} spellCheck="false" aria-label="Hex colour" />
                      </div>
                      <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a", marginLeft: "4px" }}>
                        {form.colorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : null}
          {(form.show2) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "9999px", background: form.s2Bg, color: form.s2Fg, font: "800 13px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                  2
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                    Connect social media accounts
                  </h2>
                  <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    The app reads the accounts to fill in the niche and character story for you.
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(form.plats || []).map((p: any, p_i: number) => (
                  <Fragment key={p_i}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "12px 0", borderTop: "1px solid #F4F4F5" }}>
                      <div style={{ width: "130px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "26px", height: "26px", backgroundImage: p.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", flexShrink: "0" }} />
                        {(p.noLogo) ? (
                          <>
                          <span style={{ width: "26px", height: "26px", marginLeft: "-36px", borderRadius: "7px", background: "#EF4444", color: "#fff", font: "800 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ▶
                          </span>
                          </>
                        ) : null}
                        <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif" }}>
                          {p.name}
                        </span>
                      </div>
                      {(p.isIdle) ? (
                        <>
                        <div style={{ flex: "1 1 260px", display: "flex", gap: "8px" }}>
                          <input style={{ flex: "1", minWidth: "0", height: "40px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 12px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} value={p.handle} onChange={p.onHandle} placeholder="@handle" />
                          <button style={{ height: "40px", padding: "0 16px", borderRadius: "9999px", border: "none", background: p.btnBg, color: p.btnFg, font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={p.connect}>
                            Connect
                          </button>
                        </div>
                        </>
                      ) : null}
                      {(p.isLoading) ? (
                        <>
                        <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: "10px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                          <span style={{ flex: "1", height: "8px", borderRadius: "9999px", background: "#E4E4E7", animation: "aia-pulse 1.2s ease-in-out infinite" }} />
                          Connecting {p.handle}
                        </div>
                        </>
                      ) : null}
                      {(p.isOn) ? (
                        <>
                        <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ width: "22px", height: "22px", borderRadius: "9999px", background: "#006AFF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7.5l2.6 2.5L11 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span style={{ flex: "1", font: "700 14px 'Plus Jakarta Sans',sans-serif" }}>
                            {p.handle}
                          </span>
                          <button style={{ height: "34px", padding: "0 6px", border: "none", background: "none", color: "#71717a", font: "600 13px 'Plus Jakarta Sans',sans-serif", textDecoration: "underline", cursor: "pointer" }} onClick={p.remove}>
                            Remove
                          </button>
                        </div>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
              <span style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                The app only reads the accounts. It does not post. You can connect more accounts later.
              </span>
            </div>
            </>
          ) : null}
          {(form.show3) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "9999px", background: form.s3Bg, color: form.s3Fg, font: "800 13px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                    3
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                      Niche and character story
                    </h2>
                    <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                      Fill it in from the accounts, then edit it. You can also write it yourself.
                    </span>
                  </div>
                </div>
                {(form.canFill) ? (
                  <>
                  <button style={{ height: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.fill} className="dc-h42">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5l1.6 4.2 4.4.3-3.4 2.8 1.1 4.3L8 10.7l-3.7 2.4 1.1-4.3L2 6l4.4-.3L8 1.5z" fill="currentColor" />
                    </svg>
                    {form.fillLabel}
                  </button>
                  </>
                ) : null}
                {(form.fillOff) ? (
                  <>
                  <button style={{ height: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", borderRadius: "9999px", border: "none", background: "#e4e4e7", color: "#a1a1aa", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "not-allowed" }} disabled={true} title="Connect an account first">
                    Fill in from accounts
                  </button>
                  </>
                ) : null}
              </div>
              {(form.filling) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Reading {form.fillFrom} to write the niche and story.
                  </div>
                  <div style={{ height: "46px", borderRadius: "10px", background: "#E4E4E7", animation: "aia-pulse 1.2s ease-in-out infinite" }} />
                  <div style={{ height: "120px", borderRadius: "10px", background: "#E4E4E7", animation: "aia-pulse 1.2s ease-in-out infinite" }} />
                </div>
                </>
              ) : null}
              {(form.notFilling) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {(form.wasFilled) ? (
                    <>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: "#EAF2FF", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#006AFF" }} />
                      {form.filledNote}
                    </div>
                    </>
                  ) : null}
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Niche
                    <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} value={form.niche} onChange={form.onNiche} placeholder="e.g. Plant-based home cooking" />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Character story
                    <textarea style={{ border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "12px 14px", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#18181b", resize: "vertical" }} value={form.story} onChange={form.onStory} rows={5} placeholder="Who is this AI talent? Where is it from? What does it like?" />
                    <span style={{ fontWeight: "500", color: "#71717a" }}>
                      The app uses the story to find brands and write pitches.
                    </span>
                  </label>
                </div>
                </>
              ) : null}
            </div>
            </>
          ) : null}
          {(form.show4) ? (
            <>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #E4E4E7", boxShadow: "0 1px 2px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", gap: "18px", animation: "aia-in .2s ease-out" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <h2 style={{ margin: "0", font: "800 17px 'Plus Jakarta Sans',sans-serif" }}>
                  Check and save
                </h2>
                <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                  Check the details. You can change all of them later.
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "140px", aspectRatio: "4/5", borderRadius: "16px", flexShrink: "0", backgroundColor: "#FAFAFB", backgroundImage: form.picBg, backgroundSize: "cover", backgroundPosition: "center", boxShadow: `0 0 0 3px #fff,0 0 0 5px ${form.cp.hex}` }} />
                <div style={{ flex: "1 1 280px", minWidth: "0", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "0 0 12px" }}>
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        Name
                      </div>
                      <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                        {form.name}
                      </div>
                    </div>
                    <button style={{ height: "30px", padding: "0 10px", border: "none", background: "none", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.go1}>
                      Edit
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderTop: "1px solid #F4F4F5" }}>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        Accounts
                      </div>
                      {(form.revNoAccs) ? (
                        <>
                        <span style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                          None yet. You can connect them later.
                        </span>
                        </>
                      ) : null}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {(form.revAccs || []).map((ra: any, ra_i: number) => (
                          <Fragment key={ra_i}>
                            <span style={{ height: "30px", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px 0 6px", borderRadius: "9999px", background: "#FAFAFB", boxShadow: "0 0 0 1px #E4E4E7", font: "700 13px 'Plus Jakarta Sans',sans-serif" }}>
                              <span style={{ width: "18px", height: "18px", backgroundImage: ra.logoBg, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
                              {ra.handle}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <button style={{ height: "30px", padding: "0 10px", border: "none", background: "none", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.go2}>
                      Edit
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderTop: "1px solid #F4F4F5" }}>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                        Niche
                      </div>
                      <div style={{ font: "700 15px 'Plus Jakarta Sans',sans-serif" }}>
                        {form.niche}
                      </div>
                      <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#71717a", marginTop: "8px" }}>
                        Character story
                      </div>
                      <div style={{ font: "500 14px/1.55 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                        {form.story}
                      </div>
                    </div>
                    <button style={{ height: "30px", padding: "0 10px", border: "none", background: "none", color: "#006AFF", font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.go3}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : null}
          {(form.isNew) ? (
            <>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <button style={{ height: "46px", padding: "0 6px", border: "none", background: "none", color: "#52525b", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.cancel}>
                Cancel
              </button>
              <div style={{ flex: "1" }} />
              {(form.wzHint) ? (
                <>
                <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                  {form.wzHintText}
                </span>
                </>
              ) : null}
              {(form.canBack) ? (
                <>
                <button style={{ height: "46px", padding: "0 20px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.back1}>
                  Back
                </button>
                </>
              ) : null}
              {(form.nextOn) ? (
                <>
                <button style={{ height: "46px", padding: "0 26px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }} onClick={form.next} className="dc-h43">
                  {form.nextLabel}
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                </>
              ) : null}
              {(form.nextOff) ? (
                <>
                <button style={{ height: "46px", padding: "0 26px", borderRadius: "9999px", border: "none", background: "#e4e4e7", color: "#a1a1aa", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "not-allowed" }} disabled={true}>
                  {form.nextLabel}
                </button>
                </>
              ) : null}
              {(form.saveOn) ? (
                <>
                <button style={{ height: "46px", padding: "0 26px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.save} className="dc-h44">
                  Save AI talent
                </button>
                </>
              ) : null}
            </div>
            </>
          ) : null}
          {(form.isEdit) ? (
            <>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              {(form.isEdit) ? (
                <>
                <button style={{ height: "44px", padding: "0 4px", border: "none", background: "none", font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#B91C1C", cursor: "pointer" }} onClick={form.del}>
                  Delete this AI talent
                </button>
                </>
              ) : null}
              <div style={{ flex: "1" }} />
              {(form.cannotSave) ? (
                <>
                <span style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                  {form.missingText}
                </span>
                </>
              ) : null}
              <button style={{ height: "46px", padding: "0 20px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.cancel}>
                Cancel
              </button>
              {(form.canSave) ? (
                <>
                <button style={{ height: "46px", padding: "0 26px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={form.save} className="dc-h45">
                  Save
                </button>
                </>
              ) : null}
              {(form.cannotSave) ? (
                <>
                <button style={{ height: "46px", padding: "0 26px", borderRadius: "9999px", border: "none", background: "#e4e4e7", color: "#a1a1aa", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "not-allowed" }} disabled={true}>
                  Save
                </button>
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
