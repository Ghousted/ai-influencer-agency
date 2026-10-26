// Generated from the Claude Design file "AI Influencer Agency.dc.html".
// Markup and inline styles are kept as designed; values come from the view model `v`.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, type CSSProperties } from 'react';
import { InteractiveGrid } from '../InteractiveGrid';

export function LandingScreen({ v }: { v: any }) {
  const { goLogin, goSignup, r } = v;
  return (
    <>
      {(r.start) ? (
        <>
        <div style={{ position: "fixed", inset: "0", zIndex: "0", background: "#FFFFFF", pointerEvents: "none" }} data-land="1">
          <InteractiveGrid fixed cellSize={40} color="#006AFF" style={{ animation: "landFade 1.6s ease .1s both", position: "absolute", inset: "0", pointerEvents: "none" }} />
        </div>
        <div style={{ position: "relative", zIndex: "1" }}>
          <div style={{ position: "relative", height: "100vh", minHeight: "620px", background: "transparent" }} data-hero-track="1">
            <div style={{ position: "sticky", top: "0", height: "100vh", minHeight: "620px", background: "transparent", color: "#18181B", display: "flex", flexDirection: "column", overflow: "hidden" }} data-grid-scope="1">
              <div style={{ position: "relative", zIndex: "2", maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }} className="aia-land-top">
                <div style={{ animation: "landDown .8s cubic-bezier(.2,.8,.2,1) 1.5s both", display: "flex", alignItems: "center", gap: "12px" }} data-land="1">
                  <span style={{ width: "48px", height: "48px", background: "#006AFF", WebkitMask: "url(/assets/logo-a.png) center/contain no-repeat", mask: "url(/assets/logo-a.png) center/contain no-repeat", display: "inline-block" }} className="aia-land-logo" role="img" aria-label="" />
                  <span style={{ font: "800 18px/1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B" }} className="aia-land-brand">
                    Influencer Agency
                  </span>
                </div>
                <div style={{ animation: "landDown .8s cubic-bezier(.2,.8,.2,1) 1.6s both", display: "flex", alignItems: "center", gap: "10px" }} data-land="1">
                  <button style={{ height: "40px", padding: "0 18px", borderRadius: "9999px", border: "1px solid #71717A", background: "transparent", color: "#18181B", font: "700 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={goLogin} className="dc-h0">
                    Log in
                  </button>
                  <button style={{ height: "40px", padding: "0 20px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#FFFFFF", font: "800 14px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", boxShadow: "none" }} onClick={goSignup} className="dc-h1">
                    Sign up
                  </button>
                </div>
              </div>
              <div style={{ position: "relative", zIndex: "1", maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "0 24px", flex: "1 1 0", minHeight: "240px", display: "flex", boxSizing: "border-box" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "calc((100vh - 230px) * 2.1)", margin: "0 auto", height: "100%" }}>
                  <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-4deg)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ animation: "landRing 1s cubic-bezier(.2,.8,.2,1) .6s both", position: "absolute", width: "118%", aspectRatio: "1/1", borderRadius: "50%", border: "1px solid rgba(79,139,255,.22)", transform: "rotateX(68deg)" }} data-land="1" />
                    <div style={{ position: "relative" }}>
                      <span style={{ animation: "landLogo 1.1s cubic-bezier(.34,1.45,.5,1) .25s both", position: "relative", display: "block", width: "clamp(240px,27vw,380px)", aspectRatio: "382/336", filter: "drop-shadow(0 30px 50px rgba(24,24,27,.08))", background: "#006AFF", WebkitMask: "url(/assets/logo-a.png) center/contain no-repeat", mask: "url(/assets/logo-a.png) center/contain no-repeat" }} role="img" aria-label="AI Influencer Agency" data-land="1" />
                      <span style={{ animation: "landPop .6s cubic-bezier(.34,1.45,.5,1) 1.00s both", position: "absolute", right: "-14%", top: "-16%", width: "clamp(34px,4vw,62px)", aspectRatio: "1/1", background: "#006AFF", clipPath: "polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)", filter: ")" }} data-land="1" />
                      <span style={{ animation: "landPop .6s cubic-bezier(.34,1.45,.5,1) 1.12s both", position: "absolute", right: "-24%", top: "14%", width: "clamp(14px,1.6vw,24px)", aspectRatio: "1/1", background: "#D6E6FF", clipPath: "polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)", filter: ")" }} data-land="1" />
                      <span style={{ animation: "landPop .6s cubic-bezier(.34,1.45,.5,1) 1.24s both", position: "absolute", left: "-12%", bottom: "-6%", width: "clamp(18px,2vw,30px)", aspectRatio: "1/1", background: "#ffffff", clipPath: "polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)", filter: ")" }} data-land="1" />
                    </div>
                  </div>
                  <div style={{ "--lx": "-260px", "--ly": "-80px", animation: "landCard 1s cubic-bezier(.34,1.45,.5,1) 0.82s both", position: "absolute", left: "4%", top: "4%", width: "21%", transform: "perspective(500px) rotateY(0deg) rotate(-7deg)", aspectRatio: "3/4", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08),0 0 0 1px rgba(24,24,27,0.08)", background: "#F4F4F5", transition: "transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s" } as CSSProperties} data-land="1" className="dc-h2">
                    <img src="/assets/hero-1.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: "0", borderRadius: "inherit", background: "conic-gradient(from var(--angle),#006AFF,#4F8BFF,#006AFF,#CFE0FF,#9CC2FF,#006AFF)", mixBlendMode: "screen", opacity: "var(--foil,0)", transition: "opacity .35s", animation: "foil-spin 4s linear infinite", pointerEvents: "none" }} />
                  </div>
                  <div style={{ "--lx": "-260px", "--ly": "140px", animation: "landCard 1s cubic-bezier(.34,1.45,.5,1) 1.06s both", position: "absolute", left: "12%", top: "50%", width: "22%", transform: "perspective(500px) rotateY(0deg) rotate(4deg)", aspectRatio: "1/1", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08),0 0 0 1px rgba(24,24,27,0.08)", background: "#F4F4F5", transition: "transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s" } as CSSProperties} data-land="1" className="dc-h3">
                    <img src="/assets/hero-2.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: "0", borderRadius: "inherit", background: "conic-gradient(from var(--angle),#006AFF,#4F8BFF,#006AFF,#CFE0FF,#9CC2FF,#006AFF)", mixBlendMode: "screen", opacity: "var(--foil,0)", transition: "opacity .35s", animation: "foil-spin 4s linear infinite", pointerEvents: "none" }} />
                  </div>
                  <div style={{ "--lx": "260px", "--ly": "-80px", animation: "landCard 1s cubic-bezier(.34,1.45,.5,1) 0.94s both", position: "absolute", left: "72%", top: "0%", width: "20%", transform: "perspective(500px) rotateY(0deg) rotate(6deg)", aspectRatio: "3/4", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08),0 0 0 1px rgba(24,24,27,0.08)", background: "#F4F4F5", transition: "transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s" } as CSSProperties} data-land="1" className="dc-h4">
                    <img src="/assets/hero-3.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: "0", borderRadius: "inherit", background: "conic-gradient(from var(--angle),#006AFF,#4F8BFF,#006AFF,#CFE0FF,#9CC2FF,#006AFF)", mixBlendMode: "screen", opacity: "var(--foil,0)", transition: "opacity .35s", animation: "foil-spin 4s linear infinite", pointerEvents: "none" }} />
                  </div>
                  <div style={{ "--lx": "260px", "--ly": "140px", animation: "landCard 1s cubic-bezier(.34,1.45,.5,1) 1.18s both", position: "absolute", left: "64%", top: "52%", width: "21%", transform: "perspective(500px) rotateY(0deg) rotate(-4deg)", aspectRatio: "1/1", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08),0 0 0 1px rgba(24,24,27,0.08)", background: "#F4F4F5", transition: "transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s" } as CSSProperties} data-land="1" className="dc-h5">
                    <img src="/assets/hero-4.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: "0", borderRadius: "inherit", background: "conic-gradient(from var(--angle),#006AFF,#4F8BFF,#006AFF,#CFE0FF,#9CC2FF,#006AFF)", mixBlendMode: "screen", opacity: "var(--foil,0)", transition: "opacity .35s", animation: "foil-spin 4s linear infinite", pointerEvents: "none" }} />
                  </div>
                  <div style={{ "--lx": "0px", "--ly": "-200px", animation: "landCard 1s cubic-bezier(.34,1.45,.5,1) 0.70s both", position: "absolute", left: "29%", top: "-3%", width: "14%", transform: "perspective(500px) rotateY(0deg) rotate(5deg)", aspectRatio: "15/16", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08),0 0 0 1px rgba(24,24,27,0.08)", background: "#F4F4F5", transition: "transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s" } as CSSProperties} data-land="1" className="dc-h6">
                    <img src="/assets/hero-5.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: "0", borderRadius: "inherit", background: "conic-gradient(from var(--angle),#006AFF,#4F8BFF,#006AFF,#CFE0FF,#9CC2FF,#006AFF)", mixBlendMode: "screen", opacity: "var(--foil,0)", transition: "opacity .35s", animation: "foil-spin 4s linear infinite", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>
              <div style={{ position: "relative", zIndex: "2", maxWidth: "760px", width: "100%", margin: "0 auto", padding: "12px 24px 48px", flexShrink: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
                <h1 style={{ animation: "landUp .9s cubic-bezier(.2,.8,.2,1) 1.25s both", margin: "0", font: "800 clamp(32px,4.6vw,54px)/1.06 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em", textWrap: "balance" }} data-land="1" data-grid-avoid="1">
                  Manage your AI talents as a small agency.
                </h1>
                <p style={{ animation: "landUp .9s cubic-bezier(.2,.8,.2,1) 1.4s both", margin: "0", font: "500 18px/1.5 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty" }} data-land="1" data-grid-avoid="1">
                  See the numbers, growth ideas, brand ideas and pitches for all your AI talents on one screen.
                </p>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", height: "300vh", color: "#18181B" }} data-tl-track="1">
            <div style={{ position: "sticky", top: "0", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(40px,5vw,80px)", height: "min(62vh,560px)", padding: "0 5vw", width: "max-content", willChange: "transform" }} data-tl-slider="1" className="aia-tl-slider">
                <div style={{ flexShrink: "0", height: "100%", aspectRatio: "4/5", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(24,24,27,.08)", background: "#F4F4F5" }}>
                  <img src="/assets/hero-5.jpeg" alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                </div>
                <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "stretch" }}>
                  <div style={{ position: "absolute", left: "0", right: "0", top: "50%", display: "flex", alignItems: "center", transform: "translateY(-50%)" }}>
                    <span style={{ flexShrink: "0", width: "clamp(10px,.8vw,14px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF" }} />
                    <span style={{ flex: "1", height: "1px", background: "rgba(24,24,27,.10)", position: "relative" }}>
                      <span style={{ position: "absolute", left: "0", top: "0", height: "1px", width: "100%", background: "#006AFF", transform: "scaleX(0)", transformOrigin: "0 50%" }} data-tl-line="1" />
                    </span>
                    <span style={{ flexShrink: "0", width: "clamp(10px,.8vw,14px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF" }} />
                  </div>
                  <div style={{ flexShrink: "0", width: "clamp(220px,20vw,320px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(16px,2vw,28px) clamp(24px,3vw,48px) clamp(16px,2vw,28px) 0", boxSizing: "border-box" }} className="aia-tl-head">
                    <h2 style={{ margin: "0", font: "800 clamp(36px,4.2vw,64px)/0.98 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.04em", color: "#18181B" }}>
                      How it works
                    </h2>
                    <p style={{ margin: "0", font: "600 clamp(15px,1.3vw,20px) 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                      4 steps
                    </p>
                  </div>
                  <div style={{ position: "relative", flexShrink: "0", width: "clamp(300px,30vw,460px)", height: "50%", alignSelf: "flex-start", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingBottom: "28px", boxSizing: "border-box" }} className="aia-tl-step">
                    <span style={{ position: "absolute", left: "0", top: "0", transformOrigin: "50% 100%", width: "1px", height: "100%", background: "#006AFF", transform: "scaleY(0)" }} data-tl-stem="0" />
                    <span style={{ position: "absolute", left: "0", top: "0", width: "clamp(12px,1vw,16px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF", transform: "translate(-50%,-50%) scale(0)" }} data-tl-dot="0" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 0 0 clamp(20px,2.4vw,36px)" }}>
                      <div style={{ overflow: "hidden" }}>
                        <h3 style={{ margin: "0", font: "800 clamp(26px,2.6vw,40px)/1.05 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em", color: "#18181B", transform: "translateY(105%)" }} data-tl-txt="0">
                          <span style={{ color: "#006AFF", marginRight: ".28em" }}>
                            01
                          </span>
                          Connect your social media
                        </h3>
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ margin: "0", maxWidth: "30ch", font: "500 clamp(15px,1.25vw,19px)/1.4 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", transform: "translateY(105%)" }} data-tl-txt="0">
                          Connect TikTok, Instagram, Facebook and X. The app reads the numbers for each AI talent.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative", flexShrink: "0", width: "clamp(300px,30vw,460px)", height: "50%", alignSelf: "flex-end", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "28px", boxSizing: "border-box" }} className="aia-tl-step">
                    <span style={{ position: "absolute", left: "0", bottom: "0", transformOrigin: "50% 0%", width: "1px", height: "100%", background: "#006AFF", transform: "scaleY(0)" }} data-tl-stem="1" />
                    <span style={{ position: "absolute", left: "0", bottom: "0", width: "clamp(12px,1vw,16px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF", transform: "translate(-50%,50%) scale(0)" }} data-tl-dot="1" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 0 0 clamp(20px,2.4vw,36px)" }}>
                      <div style={{ overflow: "hidden" }}>
                        <h3 style={{ margin: "0", font: "800 clamp(26px,2.6vw,40px)/1.05 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em", color: "#18181B", transform: "translateY(105%)" }} data-tl-txt="1">
                          <span style={{ color: "#006AFF", marginRight: ".28em" }}>
                            02
                          </span>
                          Grow
                        </h3>
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ margin: "0", maxWidth: "30ch", font: "500 clamp(15px,1.25vw,19px)/1.4 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", transform: "translateY(105%)" }} data-tl-txt="1">
                          Get growth ideas. Each idea uses a real number from your accounts.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative", flexShrink: "0", width: "clamp(300px,30vw,460px)", height: "50%", alignSelf: "flex-start", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingBottom: "28px", boxSizing: "border-box" }} className="aia-tl-step">
                    <span style={{ position: "absolute", left: "0", top: "0", transformOrigin: "50% 100%", width: "1px", height: "100%", background: "#006AFF", transform: "scaleY(0)" }} data-tl-stem="2" />
                    <span style={{ position: "absolute", left: "0", top: "0", width: "clamp(12px,1vw,16px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF", transform: "translate(-50%,-50%) scale(0)" }} data-tl-dot="2" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 0 0 clamp(20px,2.4vw,36px)" }}>
                      <div style={{ overflow: "hidden" }}>
                        <h3 style={{ margin: "0", font: "800 clamp(26px,2.6vw,40px)/1.05 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em", color: "#18181B", transform: "translateY(105%)" }} data-tl-txt="2">
                          <span style={{ color: "#006AFF", marginRight: ".28em" }}>
                            03
                          </span>
                          Scout
                        </h3>
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ margin: "0", maxWidth: "30ch", font: "500 clamp(15px,1.25vw,19px)/1.4 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", transform: "translateY(105%)" }} data-tl-txt="2">
                          Find brands that fit the story of each AI talent.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: "relative", flexShrink: "0", width: "clamp(300px,30vw,460px)", height: "50%", alignSelf: "flex-end", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "28px", boxSizing: "border-box" }} className="aia-tl-step">
                    <span style={{ position: "absolute", left: "0", bottom: "0", transformOrigin: "50% 0%", width: "1px", height: "100%", background: "#006AFF", transform: "scaleY(0)" }} data-tl-stem="3" />
                    <span style={{ position: "absolute", left: "0", bottom: "0", width: "clamp(12px,1vw,16px)", aspectRatio: "1/1", borderRadius: "9999px", background: "#006AFF", transform: "translate(-50%,50%) scale(0)" }} data-tl-dot="3" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 0 0 clamp(20px,2.4vw,36px)" }}>
                      <div style={{ overflow: "hidden" }}>
                        <h3 style={{ margin: "0", font: "800 clamp(26px,2.6vw,40px)/1.05 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em", color: "#18181B", transform: "translateY(105%)" }} data-tl-txt="3">
                          <span style={{ color: "#006AFF", marginRight: ".28em" }}>
                            04
                          </span>
                          Pitch
                        </h3>
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ margin: "0", maxWidth: "30ch", font: "500 clamp(15px,1.25vw,19px)/1.4 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", transform: "translateY(105%)" }} data-tl-txt="3">
                          Edit the pitch and approve it. Then copy it and send it yourself.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flexShrink: "0", width: "6vw" }} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "transparent", padding: "28px 0 36px", display: "flex", flexDirection: "column", gap: "22px", overflow: "hidden", borderTop: "1px solid rgba(24,24,27,0.06)", borderBottom: "1px solid rgba(24,24,27,0.06)" }}>
            <span style={{ alignSelf: "center", font: "700 12px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "#71717A" }} className="aia-land-cap">
              Works with the platforms that your AI talent uses
            </span>
            <div style={{ "--px0": "120px", "--px1": "-240px", animation: "parX linear both", animationTimeline: "view()", animationRange: "cover 0% cover 100%" } as CSSProperties}>
              <div style={{ display: "flex", alignItems: "center", gap: "64px", width: "max-content", animation: "marquee 32s linear infinite" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-tiktok.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B", textShadow: "none", whiteSpace: "nowrap" }}>
                    TikTok
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-instagram.png" alt="" />
                  <span style={{ font: "400 calc(clamp(44px,6vw,84px) * 1.15)/1.1 'Grand Hotel',cursive", color: "#18181B", whiteSpace: "nowrap", padding: "0 .05em" }}>
                    Instagram
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-facebook.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", color: "#4f8bff", whiteSpace: "nowrap" }}>
                    facebook
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-x.png" alt="" />
                  <span style={{ font: "700 clamp(44px,6vw,84px)/1 'Inter','Plus Jakarta Sans',sans-serif", color: "#18181B", whiteSpace: "nowrap" }}>
                    X
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-tiktok.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B", textShadow: "none", whiteSpace: "nowrap" }}>
                    TikTok
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-instagram.png" alt="" />
                  <span style={{ font: "400 calc(clamp(44px,6vw,84px) * 1.15)/1.1 'Grand Hotel',cursive", color: "#18181B", whiteSpace: "nowrap", padding: "0 .05em" }}>
                    Instagram
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-facebook.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", color: "#4f8bff", whiteSpace: "nowrap" }}>
                    facebook
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-x.png" alt="" />
                  <span style={{ font: "700 clamp(44px,6vw,84px)/1 'Inter','Plus Jakarta Sans',sans-serif", color: "#18181B", whiteSpace: "nowrap" }}>
                    X
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-tiktok.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B", textShadow: "none", whiteSpace: "nowrap" }}>
                    TikTok
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-instagram.png" alt="" />
                  <span style={{ font: "400 calc(clamp(44px,6vw,84px) * 1.15)/1.1 'Grand Hotel',cursive", color: "#18181B", whiteSpace: "nowrap", padding: "0 .05em" }}>
                    Instagram
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-facebook.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", color: "#4f8bff", whiteSpace: "nowrap" }}>
                    facebook
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-x.png" alt="" />
                  <span style={{ font: "700 clamp(44px,6vw,84px)/1 'Inter','Plus Jakarta Sans',sans-serif", color: "#18181B", whiteSpace: "nowrap" }}>
                    X
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-tiktok.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#18181B", textShadow: "none", whiteSpace: "nowrap" }}>
                    TikTok
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-instagram.png" alt="" />
                  <span style={{ font: "400 calc(clamp(44px,6vw,84px) * 1.15)/1.1 'Grand Hotel',cursive", color: "#18181B", whiteSpace: "nowrap", padding: "0 .05em" }}>
                    Instagram
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(-6deg)" }} src="/assets/p-facebook.png" alt="" />
                  <span style={{ font: "800 clamp(44px,6vw,84px)/1 'Montserrat','Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", color: "#4f8bff", whiteSpace: "nowrap" }}>
                    facebook
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: "0" }}>
                  <img style={{ width: "clamp(64px,7vw,104px)", height: "auto", display: "block", filter: "drop-shadow(0 18px 24px rgba(24,24,27,.08))", transform: "rotate(6deg)" }} src="/assets/p-x.png" alt="" />
                  <span style={{ font: "700 clamp(44px,6vw,84px)/1 'Inter','Plus Jakarta Sans',sans-serif", color: "#18181B", whiteSpace: "nowrap" }}>
                    X
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div style={{ background: "transparent", color: "#18181B", position: "relative", overflow: "hidden", padding: "120px 24px 120px" }}>
            <div style={{ position: "relative", maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }} data-reveal="0.00">
                <h2 style={{ margin: "0", font: "800 clamp(32px,4.4vw,56px)/1.04 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", textWrap: "balance", color: "#18181B" }}>
                  All AI talents on one screen.
                </h2>
                <p style={{ margin: "0", font: "500 18px/1.55 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", maxWidth: "600px" }}>
                  See posts, views, average engagement and time spent for all accounts. One total shows all AI talents. An arrow shows the change from last week.
                </p>
              </div>
              <div style={{ position: "relative", width: "100%", maxWidth: "1040px", marginTop: "40px", perspective: "1600px" }}>
                <div style={{ borderRadius: "30px", background: "#FFFFFF", border: "1px solid rgba(24,24,27,0.10)", padding: "22px", boxShadow: "0 20px 40px rgba(24,24,27,.08)", textAlign: "left", transformOrigin: "50% 100%" }} data-reveal="0.1">
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "4px 6px 18px", borderBottom: "1px solid rgba(24,24,27,0.08)", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "26px", height: "26px", background: "#006AFF", WebkitMask: "url(/assets/logo-a.png) center/contain no-repeat", mask: "url(/assets/logo-a.png) center/contain no-repeat", display: "inline-block" }} role="img" aria-label="" />
                      <span style={{ font: "800 14px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                        Influencer Agency
                      </span>
                    </span>
                    <span style={{ display: "flex", gap: "16px", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                      <span style={{ color: "#18181B" }}>
                        Home
                      </span>
                      <span>
                        Talents
                      </span>
                      <span>
                        History
                      </span>
                    </span>
                    <span style={{ marginLeft: "auto", width: "30px", height: "30px", borderRadius: "9999px", background: "#006AFF", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", font: "800 12px 'Plus Jakarta Sans',sans-serif" }}>
                      MS
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "10px", padding: "18px 0" }}>
                    <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(24,24,27,0.05)", border: "1px solid rgba(24,24,27,0.07)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                        Posts
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          41
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                          ▲ 6
                        </span>
                      </span>
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(24,24,27,0.05)", border: "1px solid rgba(24,24,27,0.07)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                        Views
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          126.4K
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                          ▲ 18%
                        </span>
                      </span>
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(24,24,27,0.05)", border: "1px solid rgba(24,24,27,0.07)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                        Average engagement
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          6.2%
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                          ▲ 0.8%
                        </span>
                      </span>
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(24,24,27,0.05)", border: "1px solid rgba(24,24,27,0.07)", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                        Time spent
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ font: "800 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          310 hrs
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                          ▲ 9%
                        </span>
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
                    <div style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(24,24,27,0.04)", border: "1px solid rgba(24,24,27,0.08)", display: "flex", flexDirection: "column" }}>
                      <div style={{ aspectRatio: "4/3", background: "url(/assets/hero-5.jpeg) center/cover" }} />
                      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "800 14px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          Chef Pingu
                        </span>
                        <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                          Food
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ font: "800 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                            58.1K views
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                            ▲ 22%
                          </span>
                        </span>
                      </div>
                    </div>
                    <div style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(24,24,27,0.04)", border: "1px solid rgba(24,24,27,0.08)", display: "flex", flexDirection: "column" }}>
                      <div style={{ aspectRatio: "4/3", background: "url(/assets/hero-1.jpeg) center/cover" }} />
                      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "800 14px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          Mika Melon
                        </span>
                        <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                          Food
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ font: "800 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                            41.7K views
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                            ▲ 15%
                          </span>
                        </span>
                      </div>
                    </div>
                    <div style={{ borderRadius: "18px", overflow: "hidden", background: "rgba(24,24,27,0.04)", border: "1px solid rgba(24,24,27,0.08)", display: "flex", flexDirection: "column" }}>
                      <div style={{ aspectRatio: "4/3", background: "url(/assets/hero-3.jpeg) center/cover" }} />
                      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "800 14px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                          Dink Daily
                        </span>
                        <span style={{ font: "600 11px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                          Pickleball
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ font: "800 13px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                            26.6K views
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(0,106,255,.14)", color: "#0057D9", font: "800 11px 'Plus Jakarta Sans',sans-serif" }}>
                            ▲ 9%
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "transparent", color: "#18181B", position: "relative", overflow: "hidden", padding: "120px 24px" }}>
            <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", maxWidth: "760px", margin: "0 auto", textAlign: "center" }} data-reveal="0.00">
                <h2 style={{ margin: "0", font: "800 clamp(32px,4.4vw,56px)/1.04 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", textWrap: "balance", color: "#18181B" }}>
                  The app gives ideas. You make the decisions.
                </h2>
                <p style={{ margin: "0", font: "500 18px/1.55 'Plus Jakarta Sans',sans-serif", color: "#52525B", textWrap: "pretty", maxWidth: "560px" }}>
                  The app does not send items in your name. Only you send them. If an idea is not correct, tap “This looks wrong”. The app then flags the idea.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "20px", alignItems: "stretch" }}>
                <div style={{ position: "relative", borderRadius: "24px", padding: "28px", overflow: "hidden", background: "#FFFFFF", border: "1px solid rgba(24,24,27,0.10)", boxShadow: "0 20px 40px rgba(24,24,27,.08)" }} data-reveal="0.10">
                  <h3 style={{ margin: "0 0 20px", font: "800 20px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                    What the app does
                  </h3>
                  <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                      Shows all your numbers on one screen
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                      Gives ideas to grow your accounts
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                      Finds brands that match each AI talent
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                      Writes draft pitches for you to examine
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                      Keeps a record of all ideas
                    </li>
                  </ul>
                </div>
                <div style={{ position: "relative", borderRadius: "24px", padding: "28px", overflow: "hidden", background: "#FFFFFF", border: "1px solid rgba(24,24,27,0.10)", boxShadow: "0 20px 40px rgba(24,24,27,.08)" }} data-reveal="0.20">
                  <h3 style={{ margin: "0 0 20px", font: "800 20px 'Plus Jakarta Sans',sans-serif", color: "#18181B" }}>
                    What the app does not do
                  </h3>
                  <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <span style={{ flexShrink: "0", width: "30px", height: "30px", borderRadius: "9999px", border: "1.5px solid #71717A", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                        ✕
                      </span>
                      <span>
                        Make AI talents, pictures or videos
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <span style={{ flexShrink: "0", width: "30px", height: "30px", borderRadius: "9999px", border: "1.5px solid #71717A", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                        ✕
                      </span>
                      <span>
                        Post or schedule posts for you
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <span style={{ flexShrink: "0", width: "30px", height: "30px", borderRadius: "9999px", border: "1.5px solid #71717A", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                        ✕
                      </span>
                      <span>
                        Send pitches or contact brands
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <span style={{ flexShrink: "0", width: "30px", height: "30px", borderRadius: "9999px", border: "1.5px solid #71717A", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                        ✕
                      </span>
                      <span>
                        Manage deals or payments
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <span style={{ flexShrink: "0", width: "30px", height: "30px", borderRadius: "9999px", border: "1.5px solid #71717A", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px 'Plus Jakarta Sans',sans-serif" }}>
                        ✕
                      </span>
                      <span>
                        Promise income
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "transparent", color: "#18181B", position: "relative", overflow: "hidden", padding: "120px 24px" }}>
            <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "36px", textAlign: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }} data-reveal="0.00">
                <h2 style={{ margin: "0", font: "800 clamp(32px,4.4vw,56px)/1.04 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.035em", textWrap: "balance", color: "#18181B" }}>
                  One plan for your agency.
                </h2>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <div style={{ position: "relative", borderRadius: "24px", background: "#FFFFFF", border: "1px solid rgba(24,24,27,0.10)", padding: "36px", display: "flex", flexDirection: "column", gap: "26px", textAlign: "left", overflow: "hidden" }} data-reveal="0.1">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ font: "700 15px 'Plus Jakarta Sans',sans-serif", color: "#52525B" }}>
                      AI Influencer Agency app
                    </span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                      <span style={{ font: "800 clamp(52px,7vw,68px)/1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.04em", color: "#18181B" }}>
                        ₱499
                      </span>
                      <span style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif", color: "#71717A" }}>
                        a month
                      </span>
                    </div>
                  </div>
                  <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        All your AI talents in one place
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        Numbers from TikTok, Instagram, YouTube and Facebook, with a weekly arrow
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        3 to 5 growth ideas for each AI talent
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        Brand ideas that fit each AI talent
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        Draft pitches and talent profiles that you approve and copy
                      </span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", font: "600 15px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3F3F46" }}>
                      <img style={{ flexShrink: "0", width: "26px", height: "26px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(24,24,27,.08))" }} src="/assets/check-3d.png" alt="" />
                      <span>
                        A record of all ideas and pitches
                      </span>
                    </li>
                  </ul>
                  <button style={{ position: "relative", height: "56px", borderRadius: "9999px", border: "none", background: "#006AFF", color: "#FFFFFF", font: "800 17px 'Plus Jakarta Sans',sans-serif", cursor: "pointer", boxShadow: "none", transition: "transform .2s,box-shadow .2s" }} onClick={goSignup} className="dc-h7">
                    Sign up
                  </button>
                  <p style={{ margin: "0", font: "500 13px/1.5 'Plus Jakarta Sans',sans-serif", color: "#71717A", textWrap: "pretty" }}>
                    You can cancel at any time. The app does not post or send items for you. The app does not promise income.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: "#3F3F46", borderTop: "1px solid rgba(24,24,27,0.08)", color: "#71717A", padding: "28px 24px" }}>
            <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", font: "500 13px 'Plus Jakarta Sans',sans-serif" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "32px", height: "32px", background: "#FFFFFF", WebkitMask: "url(/assets/logo-a.png) center/contain no-repeat", mask: "url(/assets/logo-a.png) center/contain no-repeat", display: "inline-block" }} role="img" aria-label="" />
                <span style={{ font: "800 15px/1 'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.02em", color: "#FFFFFF" }}>
                  Influencer Agency
                </span>
              </span>
              <div style={{ display: "flex", gap: "18px" }}>
                <button style={{ border: "none", background: "none", padding: "0", color: "#D4D4D8", font: "600 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={goLogin} className="dc-h8 aia-tap">
                  Log in
                </button>
                <button style={{ border: "none", background: "none", padding: "0", color: "#D4D4D8", font: "600 13px 'Plus Jakarta Sans',sans-serif", cursor: "pointer" }} onClick={goSignup} className="dc-h9 aia-tap">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
    </>
  );
}
