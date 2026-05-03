import React, { useEffect, useRef, useState } from "react";

const Icon = ({ d, size = 20, stroke = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const AppleIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04l-.06.27zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.18 23.76c.3.17.64.24.99.19L14.9 12 11.1 8.2 3.18 23.76z" fill="#EA4335"/>
    <path d="M20.96 10.27L17.6 8.34 13.5 12l4.1 4.1 3.37-1.93c.96-.55.96-1.45-.01-2z" fill="#FBBC04"/>
    <path d="M3.18.24C2.83.46 2.62.86 2.62 1.4v21.2c0 .54.21.95.56 1.16L14.9 12 3.18.24z" fill="#34A853"/>
    <path d="M3.18.24L14.9 12l2.7-2.7-12.43-7.13c-.35-.2-.69-.21-.99.07z" fill="#4285F4"/>
  </svg>
);

const CTA = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative bg-[#f5f5f3] py-24 px-6 overflow-hidden">

      {/* Top divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-zinc-300" />

      <div
        ref={ref}
        className={`relative z-10 max-w-3xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        {/* Main card */}
        <div className="relative bg-[#0c1014] rounded-[28px] overflow-hidden px-8 py-16 sm:px-14 sm:py-20 text-center">

          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Subtle top glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% -5%, rgba(255,255,255,0.07) 0%, transparent 65%)" }}
          />

          {/* Corner rings */}
          <div className="pointer-events-none absolute -top-36 -right-24 w-[420px] h-[420px] rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 w-[320px] h-[320px] rounded-full border border-white/[0.06]" />

          <div className="relative z-10">

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 border border-white/[0.12] rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              <span className="text-[10px] font-semibold text-white/45 tracking-[0.14em] uppercase">Now Live — Launch Offer</span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(32px,5.5vw,54px)] font-normal text-white leading-[1.08] mb-4"
              style={{ letterSpacing: "-0.03em", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Your business, finally<br />
              <em className="italic text-white/90">under control.</em>
            </h2>

            {/* Rule */}
            <div className="w-9 h-[1.5px] bg-white/20 mx-auto mb-5" />

            {/* Sub */}
            <p className="text-[14.5px] text-white/40 leading-[1.75] max-w-[480px] mx-auto mb-9 font-light">
              Join BizEzy to track payments, manage inventory, and grow — all from one app.
            </p>

            {/* Trust perks */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-9">
              {[
                "2 months free on sign-up",
                "No credit card required",
                "All features included",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px] text-white/45">
                  <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              <button className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-[#0c1014] text-[13.5px] font-semibold px-7 py-3.5 rounded-[14px] transition-all duration-200 active:scale-95">
                <Icon d="M12 3v12M7 14l5 5 5-5M3 19h18" size={14} stroke="#0c1014" strokeWidth={2.2} />
                Get Started Free
              </button>
              <button className="flex items-center gap-2 border border-white/[0.14] hover:border-white/30 text-white/65 hover:text-white text-[13.5px] font-medium px-7 py-3.5 rounded-[14px] transition-all duration-200">
                Explore Features
                <Icon d="M5 12h14M13 6l6 6-6 6" size={13} stroke="currentColor" strokeWidth={2} />
              </button>
            </div>

            {/* Available on divider */}
            <div className="flex items-center gap-4 max-w-[300px] mx-auto mb-7 text-white/20 text-[11px] tracking-[0.08em] uppercase">
              <div className="flex-1 h-px bg-white/10" />
              <span>Available on</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Store badges */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {/* App Store */}
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.09] hover:border-white/[0.22] rounded-[14px] px-5 py-3 transition-all cursor-pointer min-w-[160px]">
                <AppleIcon />
                <div className="text-left leading-none">
                  <div className="text-[9px] text-white uppercase tracking-[0.06em] mb-1">Download on the</div>
                  <div className="text-[14px] font-semibold text-white tracking-tight">App Store</div>
                </div>
              </div>

              {/* Play Store */}
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.09] hover:border-white/[0.22] rounded-[14px] px-5 py-3 transition-all cursor-pointer min-w-[160px]">
                <PlayStoreIcon />
                <div className="text-left leading-none">
                  <div className="text-[9px] text-white uppercase tracking-[0.06em] mb-1">Get it on</div>
                  <div className="text-[14px] font-semibold text-white tracking-tight">Google Play</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom strip */}
        <div className={`mt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 pt-5 border-t border-zinc-200 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          {["Free for 2 months", "No card needed", ].map((text, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[12px] text-zinc-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {text}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CTA;