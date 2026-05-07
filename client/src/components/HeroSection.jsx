import React, { useEffect, useState } from "react";

/* ─── Phone sub-components ─────────────────────────────── */

const PhoneScreen = ({ title, avatar, children }) => (
  <div className="flex flex-col gap-1.5 h-full">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-semibold text-white/90 tracking-tight">{title}</span>
      <div className="w-[18px] h-[18px] rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[7px] font-bold text-white">{avatar}</div>
    </div>
    {children}
  </div>
);

const PhoneCard = ({ label, value, sub, subColor = "text-emerald-400" }) => (
  <div className="bg-white/[0.07] border border-white/10 rounded-xl p-2">
    <div className="text-[6.5px] uppercase tracking-widest text-white/40 mb-1">{label}</div>
    <div className="text-[13px] font-bold text-white tracking-tight leading-none">{value}</div>
    {sub && <div className={`text-[6.5px] mt-1 font-medium ${subColor}`}>{sub}</div>}
  </div>
);

const PhoneRow = ({ dot, name, sub, amount, amtColor = "text-white" }) => (
  <div className="flex items-center gap-1.5 bg-white/[0.07] border border-white/10 rounded-lg px-2 py-1.5">
    <div className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${dot}`} />
    <div className="flex-1 min-w-0">
      <div className="text-[7px] font-semibold text-white/85 truncate">{name}</div>
      <div className="text-[6px] text-white/35">{sub}</div>
    </div>
    <div className={`text-[7.5px] font-bold ${amtColor}`}>{amount}</div>
  </div>
);

/* ─── Floating Badge ────────────────────────────────────── */
const FloatingBadge = ({ icon, label, value, style }) => (
  <div className="absolute z-20 flex items-center gap-2.5 bg-white border border-zinc-200 rounded-2xl px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] whitespace-nowrap" style={style}>
    <div className="w-7 h-7 rounded-xl bg-zinc-100 flex items-center justify-center text-base flex-shrink-0 border border-zinc-200">{icon}</div>
    <div className="leading-tight">
      <div className="text-[9px] text-zinc-400 font-medium tracking-wide uppercase">{label}</div>
      <div className="text-[12px] font-bold text-zinc-900 tracking-tight">{value}</div>
    </div>
  </div>
);

/* ─── Trust Badge ───────────────────────────────────────── */
const TrustBadge = ({ label }) => (
  <span className="flex items-center gap-1.5">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <span className="text-zinc-600 font-medium text-[12px]">{label}</span>
  </span>
);

/* ─── Store Badge with proper icons ─────────────────────── */
const StoreBadge = ({ eyebrow, name, icon }) => (
  <div className="flex items-center gap-2.5 bg-white border-2 border-zinc-900 rounded-xl px-4 py-2.5 shadow-[3px_3px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
    {icon}
    <div className="leading-tight">
      <div className="text-[9px] text-zinc-400 uppercase tracking-wide font-medium">{eyebrow}</div>
      <div className="text-[13px] font-bold text-zinc-900 tracking-tight">{name}</div>
    </div>
  </div>
);

/* ─── Apple Icon ────────────────────────────────────────── */
const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

/* ─── Google Play Icon ──────────────────────────────────── */
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M3.18 23.76c.3.17.64.22.97.15l13.18-7.61-2.87-2.87L3.18 23.76z" fill="#EA4335" />
    <path d="M22.12 10.31l-3.03-1.75-3.2 3.2 3.2 3.2 3.05-1.76c.87-.5.87-1.89-.02-2.89z" fill="#FBBC05" />
    <path d="M2.21.24C1.9.42 1.69.76 1.69 1.19v21.62c0 .43.21.77.52.95l12.06-12.06L2.21.24z" fill="#4285F4" />
    <path d="M3.18.24l11.28 11.46 2.87-2.87L4.15.09C3.82.02 3.48.07 3.18.24z" fill="#34A853" />
  </svg>
);

/* ─── Main Component ────────────────────────────────────── */
const HeroSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-center overflow-hidden pt-24 pb-16 px-6">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Two-column grid — phones FIRST in DOM (shows top on mobile), text SECOND */}
      <div
        className={`relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* ── RIGHT: Phone scene — order-first on mobile, order-last on lg ── */}
        <div
          className={`relative flex items-end justify-center h-[420px] lg:h-[500px] order-first lg:order-last transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <FloatingBadge icon="✓" label="Revenue today" value="₹24,800"
            style={{ bottom: 230, left: 0, animation: "bizezy-float 4s ease-in-out infinite" }} />
          <FloatingBadge icon="↑" label="New sale" value="3 items · ₹3,200"
            style={{ top: 24, right: 0, animation: "bizezy-float 4.5s ease-in-out infinite 0.5s" }} />
          <FloatingBadge icon="!" label="Low stock alert" value="Printer Paper"
            style={{ bottom: 80, right: -10, animation: "bizezy-float 3.8s ease-in-out infinite 0.9s" }} />

          {/* Left phone — Analytics */}
          <div className="relative bg-zinc-950 border border-zinc-700/60 overflow-hidden flex-shrink-0 shadow-2xl"
            style={{ width: 140, height: 252, borderRadius: 22, transform: "translateY(48px)", opacity: 0.6 }}>
            <div className="w-10 h-2 bg-zinc-800 rounded-b-lg mx-auto mt-2.5" />
            <div className="px-2.5 pb-3 pt-1.5" style={{ height: "calc(100% - 26px)" }}>
              <PhoneScreen title="Analytics" avatar="A">
                <PhoneCard label="This month" value="₹1.2L" sub="↑ 18% vs last" />
                <div className="flex gap-1.5">
                  <PhoneCard label="Orders" value="142" />
                  <PhoneCard label="Customers" value="38" />
                </div>
              </PhoneScreen>
            </div>
          </div>

          {/* Center phone — Dashboard */}
          <div className="relative bg-zinc-950 border border-zinc-600/70 overflow-hidden flex-shrink-0 z-10 mx-3"
            style={{ width: 168, height: 316, borderRadius: 26, boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)" }}>
            <div className="w-10 h-2 bg-zinc-800 rounded-b-lg mx-auto mt-2.5" />
            <div className="px-2.5 pb-3 pt-1.5" style={{ height: "calc(100% - 26px)" }}>
              <PhoneScreen title="Dashboard" avatar="B">
                <PhoneCard label="Total Revenue" value="₹84,320" sub="↑ 12.4% this week" />
                <div className="flex gap-1.5">
                  <PhoneCard label="Sales" value="64" />
                  <PhoneCard label="Due" value="₹8.2k" />
                </div>
                <PhoneRow dot="bg-white/60" name="Ravi Kumar" sub="Paid · Today" amount="₹4,200" amtColor="text-white/80" />
                <PhoneRow dot="bg-white/30" name="Meena Stores" sub="Due · 3 days" amount="₹1,800" amtColor="text-white/40" />
                <PhoneRow dot="bg-white/50" name="Arjun Traders" sub="Partial · Today" amount="₹6,500" amtColor="text-white/70" />
              </PhoneScreen>
            </div>
          </div>

          {/* Right phone — Inventory */}
          <div className="relative bg-zinc-950 border border-zinc-700/60 overflow-hidden flex-shrink-0 shadow-2xl"
            style={{ width: 148, height: 272, borderRadius: 24, transform: "translateY(28px)", opacity: 0.65 }}>
            <div className="w-10 h-2 bg-zinc-800 rounded-b-lg mx-auto mt-2.5" />
            <div className="px-2.5 pb-3 pt-1.5" style={{ height: "calc(100% - 26px)" }}>
              <PhoneScreen title="Inventory" avatar="C">
                <PhoneCard label="Total Products" value="218" sub="4 low stock alerts" subColor="text-white/40" />
                <PhoneRow dot="bg-white/30" name="A4 Paper" sub="2 units left" amount="Low" amtColor="text-white/40" />
                <PhoneRow dot="bg-white/70" name="Blue Pen Box" sub="120 units" amount="OK" amtColor="text-white/80" />
                <PhoneRow dot="bg-white/70" name="Stapler Set" sub="44 units" amount="OK" amtColor="text-white/80" />
              </PhoneScreen>
            </div>
          </div>
        </div>

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col items-start text-left order-last lg:order-first">
          {/* Launch banner */}
          <div className="inline-flex items-center gap-2 bg-black text-white rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wide uppercase">Launch Offer — 2 Months Free</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-black leading-[1.0] mb-5 text-zinc-900"
            style={{ letterSpacing: "-3px", fontFamily: "'Georgia', serif" }}>
            BizEzy is<br />
            <span className="relative inline-block" style={{ WebkitTextStroke: "3px #000", color: "transparent" }}>Now Live.</span>
          </h1>

          <div className="w-12 h-[2px] bg-black mb-5" />

          <p className="text-[15px] text-zinc-500 leading-relaxed max-w-[420px] mb-9 font-normal">
            The all-in-one business management app to manage inventory, sales, customers, invoices, and analytics — with ease.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button className="flex items-center gap-2 bg-zinc-900 text-white text-[13px] font-bold px-7 py-3.5 rounded-xl hover:bg-black transition-colors active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.25)] tracking-tight">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 14l5 5 5-5M3 19h18" />
              </svg>
              Get Started Free
            </button>
            <button className="text-zinc-900 text-[13px] font-semibold px-7 py-3.5 rounded-xl border-2 border-zinc-900 bg-white hover:bg-zinc-50 transition-colors tracking-tight">
              Explore Features →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <TrustBadge label="All features included" />
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <TrustBadge label="No credit card required" />
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <TrustBadge label="2 months free" />
          </div>

          {/* Store badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* <StoreBadge eyebrow="Available on" name="App Store" icon={<AppleIcon />} /> */}
            <StoreBadge eyebrow="Get it on" name="Play Store" icon={<PlayIcon />} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bizezy-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;