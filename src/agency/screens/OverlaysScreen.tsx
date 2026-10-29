// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * The overlay is portaled to <body>: Shell's <main> is its own stacking context (z-index 1),
 * so a z-index inside it cannot rise above the sticky top bar (z-index 20).
 */
export function OverlaysScreen({ v }: { v: any }) {
  if (!v.ovl.show || typeof document === 'undefined') return null;
  return createPortal(<OverlaysBody v={v} />, document.body);
}

/**
 * A dialog: focus moves into it and back to the button that opened it, Tab stays inside it, and the
 * page behind does not scroll. Escape and a click outside close it (AgencyApp, the backdrop).
 */
function useDialog(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const box = ref.current;
    const focusables = () => [...(box?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),textarea,select,[href],[tabindex]:not([tabindex="-1"])') || [])].filter((e) => e.offsetParent);
    // The first field, or else the first button (the close button) gets the focus.
    (focusables().find((e) => e.matches('input,textarea,select')) || focusables()[0])?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [ref]);
}

function OverlaysBody({ v }: { v: any }) {
  const { ovl } = v;
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref);
  return (
    <>
      {(ovl.show) ? (
        <>
        <div ref={ref} role="dialog" aria-modal="true" aria-label={ovl.label} style={{ position: "fixed", inset: "0", zIndex: "50", display: "flex" }}>
          <div style={{ position: "absolute", inset: "0", background: "rgba(6,14,31,.45)" }} onClick={ovl.close} />
          {(ovl.isConnect) ? (
            <>
            <div style={{ position: "relative", margin: "auto", width: "min(460px,92vw)", background: "#fff", borderRadius: "22px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,.25)", animation: "aia-in .2s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div>
                  <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                    {ovl.c.title}
                  </div>
                  <div style={{ font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                    For {ovl.c.talent}
                  </div>
                </div>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "none", background: "#F4F4F5", font: "700 16px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", color: "#3f3f46" }} onClick={ovl.close} aria-label="Close">
                  ×
                </button>
              </div>
              {(ovl.c.idle) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {(ovl.c.pickPlatform) ? (
                    <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {(ovl.c.platforms || []).map((pl: any, pl_i: number) => (
                        <Fragment key={pl_i}>
                          <button style={{ height: "46px", borderRadius: "12px", border: "none", background: pl.bg, color: pl.color, font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pl.go}>
                            {pl.label}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    </>
                  ) : null}
                  {(ovl.c.askHandle) ? (
                    <>
                    <input style={{ height: "44px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif" }} value={ovl.c.handle} onChange={ovl.c.onHandle} placeholder="@handle" />
                    </>
                  ) : null}
                  <div style={{ font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                    The app only reads the numbers. The app does not post or send items.
                  </div>
                  <button style={{ height: "48px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", opacity: ovl.c.connectOff }} onClick={ovl.c.connect} className="dc-h61">
                    Connect {ovl.c.platform}
                  </button>
                  {(ovl.c.fallback) ? (
                    <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "14px", borderTop: "1px solid #F4F4F5" }}>
                      <div style={{ font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525b" }}>
                        If the account does not connect, add it by its handle. The app then shows &quot;Numbers not available&quot;.
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input style={{ flex: "1", minWidth: "0", height: "44px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif" }} value={ovl.c.handle} onChange={ovl.c.onHandle} placeholder="@handle" />
                        <button style={{ height: "44px", padding: "0 16px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", opacity: ovl.c.handleOff }} onClick={ovl.c.addHandle}>
                          Add by handle
                        </button>
                      </div>
                    </div>
                    </>
                  ) : null}
                </div>
                </>
              ) : null}
              {(ovl.c.picking) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46", paddingBottom: "4px" }}>
                    {ovl.c.pickTitle}
                  </div>
                  {(ovl.c.picks || []).map((pk: any, pk_i: number) => (
                    <Fragment key={pk_i}>
                      <button style={{ height: "46px", borderRadius: "12px", border: "none", background: "#F4F4F5", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", textAlign: "left", padding: "0 16px" }} onClick={pk.go}>
                        {pk.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {(ovl.c.loading) ? (
                <>
                <div style={{ padding: "22px 0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: "100%", height: "6px", borderRadius: "9999px", background: "#EAF2FF", overflow: "hidden" }}>
                    <div style={{ width: "60%", height: "100%", background: "#006AFF", borderRadius: "9999px", animation: "aia-pulse 1.2s ease-in-out infinite" }} />
                  </div>
                  <div style={{ font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                    Connecting {ovl.c.platform}.
                    {(ovl.c.long) ? (
                      <>
                      <span>
                        This step takes more time. Keep this page open.
                      </span>
                      </>
                    ) : null}
                  </div>
                </div>
                </>
              ) : null}
              {(ovl.c.bad) ? (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "12px", background: "#FEECEC", font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "#B91C1C" }} />
                    {ovl.c.err}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input style={{ flex: "1", minWidth: "0", height: "44px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif" }} value={ovl.c.handle} onChange={ovl.c.onHandle} placeholder="@handle" />
                    <button style={{ height: "44px", padding: "0 16px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", opacity: ovl.c.handleOff }} onClick={ovl.c.addHandle}>
                      Add by handle
                    </button>
                  </div>
                  <button style={{ height: "48px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.c.connect}>
                    Try again
                  </button>
                </div>
                </>
              ) : null}
            </div>
            </>
          ) : null}
          {(ovl.isDelete) ? (
            <>
            <div style={{ position: "relative", margin: "auto", width: "min(440px,92vw)", background: "#fff", borderRadius: "22px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,.25)", animation: "aia-in .2s ease-out" }}>
              <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                Delete {ovl.d.name}?
              </div>
              <div style={{ font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                {ovl.d.first}&apos;s connected accounts and history will be deleted too. This cannot be undone.
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.close}>
                  Cancel
                </button>
                <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#B91C1C", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.d.confirm}>
                  Delete
                </button>
              </div>
            </div>
            </>
          ) : null}
          {(ovl.isSchedule) ? (
            <>
            <div style={{ position: "relative", marginLeft: "auto", width: "min(440px,100vw)", height: "100%", overflowY: "auto", background: "#fff", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "18px", boxShadow: "-10px 0 40px rgba(0,0,0,.18)", animation: "aia-in .2s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                  {ovl.sc.title}
                </div>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "none", background: "#F4F4F5", font: "700 16px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", color: "#3f3f46" }} onClick={ovl.close} aria-label="Close">
                  ×
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                AI talent
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(ovl.sc.talents || []).map((x: any, x_i: number) => (
                    <Fragment key={x_i}>
                      <button style={{ height: "40px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px 0 6px", border: "none", borderRadius: "9999px", background: x.bg, boxShadow: x.ring, font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#18181b", cursor: "pointer" }} onClick={x.go}>
                        <span style={{ width: "28px", height: "28px", borderRadius: "9999px", backgroundColor: x.color, backgroundImage: x.picBg, backgroundSize: "cover", backgroundPosition: "center" }} />
                        {x.name}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                Content idea
                <select style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 12px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} value={ovl.sc.cid} onChange={ovl.sc.onIdea}>
                  {(ovl.sc.ideas || []).map((i: any, i_i: number) => (
                    <Fragment key={i_i}>
                      <option value={i.v}>
                        {i.label}
                      </option>
                    </Fragment>
                  ))}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                Post title
                <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 14px", font: "500 15px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} value={ovl.sc.titleV} onChange={ovl.sc.onTitle} placeholder="e.g. Sinigang in 60 seconds" />
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                Platform
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(ovl.sc.plats || []).map((pl: any, pl_i: number) => (
                    <Fragment key={pl_i}>
                      <button style={{ height: "38px", padding: "0 16px", borderRadius: "9999px", border: `1px solid ${pl.bd}`, background: pl.bg, color: pl.fg, font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={pl.go}>
                        {pl.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <label style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Date
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 12px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} type="date" value={ovl.sc.date} onChange={ovl.sc.onDate} />
                </label>
                <label style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                  Time
                  <input style={{ height: "46px", border: "none", background: "#FAFAFB", borderRadius: "10px", padding: "0 12px", font: "500 14px 'Plus Jakarta Sans',sans-serif", color: "#18181b" }} type="time" value={ovl.sc.time} onChange={ovl.sc.onTime} />
                </label>
              </div>
              <div style={{ flex: "1" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: "1", height: "46px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.close}>
                  Cancel
                </button>
                {(ovl.sc.canSave) ? (
                  <>
                  <button style={{ flex: "1", width: "100%", height: "46px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.sc.save}>
                    {ovl.sc.saveLabel}
                  </button>
                  </>
                ) : null}
                {(ovl.sc.cannotSave) ? (
                  <>
                  <button style={{ flex: "1", width: "100%", height: "46px", borderRadius: "9999px", border: "none", background: "#e4e4e7", color: "#a1a1aa", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "not-allowed" }} disabled={true}>
                    {ovl.sc.saveLabel}
                  </button>
                  </>
                ) : null}
              </div>
            </div>
            </>
          ) : null}
          {(ovl.isDelAcct) ? (
            <>
            <div style={{ position: "relative", margin: "auto", width: "min(440px,92vw)", background: "#fff", borderRadius: "22px", padding: "26px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,.25)", animation: "aia-in .2s ease-out" }}>
              <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                {ovl.da.title}
              </div>
              <div style={{ font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                {ovl.da.body}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.close}>
                  Cancel
                </button>
                <button style={{ height: "44px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#B91C1C", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.delAcct}>
                  {ovl.da.btn}
                </button>
              </div>
            </div>
            </>
          ) : null}
          {(ovl.isDismiss) ? (
            <>
            <div style={{ position: "relative", marginLeft: "auto", width: "min(400px,100vw)", height: "100%", background: "#fff", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "-10px 0 40px rgba(0,0,0,.18)", animation: "aia-in .2s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                  Dismiss this idea?
                </div>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "none", background: "#F4F4F5", font: "700 16px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", color: "#3f3f46" }} onClick={ovl.close} aria-label="Close">
                  ×
                </button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#FAFAFB", font: "600 14px/1.45 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                {ovl.dm.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                Why?
                <span style={{ fontWeight: "500", color: "#71717a" }}>
                  Optional. This helps the app give better ideas.
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(ovl.dm.reasons || []).map((rs: any, rs_i: number) => (
                    <Fragment key={rs_i}>
                      <button style={{ height: "36px", padding: "0 14px", borderRadius: "9999px", border: `1px solid ${rs.bd}`, background: rs.bg, color: rs.fg, font: "700 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={rs.go}>
                        {rs.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                Note
                <span style={{ fontWeight: "500", color: "#71717a" }}>
                  Optional
                </span>
                <textarea style={{ border: "none", background: "#FAFAFB", borderRadius: "12px", padding: "12px 14px", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", resize: "vertical" }} value={ovl.dm.note} onChange={ovl.dm.onNote} rows={4} placeholder="Example: The numbers in this idea are not correct" />
              </label>
              {(ovl.dm.isWrong) ? (
                <>
                <div style={{ padding: "10px 14px", borderRadius: "12px", background: "#FEECEC", font: "600 13px/1.45 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                  The app also flags this idea. History shows it in the Flagged list.
                </div>
                </>
              ) : null}
              <div style={{ font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                The app will not show this idea again.
              </div>
              <div style={{ flex: "1" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: "1", height: "46px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.close}>
                  Cancel
                </button>
                <button style={{ flex: "1", height: "46px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.dm.submit}>
                  Dismiss
                </button>
              </div>
            </div>
            </>
          ) : null}
          {(ovl.isFlag) ? (
            <>
            <div style={{ position: "relative", marginLeft: "auto", width: "min(400px,100vw)", height: "100%", background: "#fff", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "-10px 0 40px rgba(0,0,0,.18)", animation: "aia-in .2s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ font: "800 20px 'Plus Jakarta Sans',sans-serif" }}>
                  This looks wrong
                </div>
                <button style={{ width: "34px", height: "34px", borderRadius: "9999px", border: "none", background: "#F4F4F5", font: "700 16px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", color: "#3f3f46" }} onClick={ovl.close} aria-label="Close">
                  ×
                </button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#FAFAFB", font: "600 14px/1.45 'Plus Jakarta Sans',sans-serif", color: "#18181b" }}>
                {ovl.f.label}
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3f3f46" }}>
                What is wrong?
                <span style={{ fontWeight: "500", color: "#71717a" }}>
                  Optional
                </span>
                <textarea style={{ border: "none", background: "#FAFAFB", borderRadius: "12px", padding: "12px 14px", font: "500 15px/1.5 'Plus Jakarta Sans',sans-serif", resize: "vertical" }} value={ovl.f.note} onChange={ovl.f.onNote} rows={5} placeholder="Example: This brand sells only in Japan" />
              </label>
              <div style={{ font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#71717a" }}>
                History shows flagged items in a separate list.
              </div>
              <div style={{ flex: "1" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: "1", height: "46px", borderRadius: "9999px", border: "1px solid #E4E4E7", background: "#fff", color: "#18181b", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.close}>
                  Cancel
                </button>
                <button style={{ flex: "1", height: "46px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={ovl.f.submit}>
                  Flag it
                </button>
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
