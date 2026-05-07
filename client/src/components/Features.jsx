import React, { useEffect, useRef, useState } from "react";

/* ─── Inline SVG Icon ───────────────────────────────── */
const Icon = ({ d, size = 20, stroke = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  wallet: ["M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5","M16 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0"],
  whatsapp: ["M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  invoice: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8M16 17H8M10 9H8"],
  box: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"],
  chart: ["M18 20V10","M12 20V4","M6 20v-6"],
};

/* ─── useInView hook ──────────────────────────────── */
const useInView = (delay = 0) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
};

/* ─── MockRow ─────────────────────────────────────── */
const MockRow = ({ name, sub, badge, dot }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/60 shrink-0">
        {name[0]}
      </div>
      <div>
        <div className="text-[11.5px] font-semibold text-white/85 leading-tight">{name}</div>
        <div className="text-[10px] text-white/35 leading-tight mt-0.5">{sub}</div>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dot}`}>{badge}</span>
  </div>
);

/* ─── InvLine ─────────────────────────────────────── */
const InvLine = ({ label, value, total }) => (
  <div className={`flex justify-between py-1.5 border-b border-dashed border-white/10 last:border-0
    ${total ? "font-bold text-white text-[12.5px] mt-1" : "text-[11.5px] text-white/50"}`}>
    <span>{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);

/* ─── StockBar ────────────────────────────────────── */
const StockBar = ({ name, pct, count, warn }) => (
  <div className="flex items-center gap-3 py-2 border-b border-white/[0.06] last:border-0">
    <span className="text-[11px] font-medium text-white/55 w-24 shrink-0 truncate">{name}</span>
    <div className="flex-1 h-[4px] rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: warn ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.75)" }} />
    </div>
    <span className={`text-[10px] w-16 text-right shrink-0 font-semibold ${warn ? "text-white/40" : "text-white/80"}`}>{count}</span>
  </div>
);

/* ─── KpiBox ──────────────────────────────────────── */
const KpiBox = ({ val, lbl, delta, dim }) => (
  <div className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 flex flex-col gap-1">
    <div className="text-[9px] uppercase tracking-widest text-white/35 font-semibold">{lbl}</div>
    <div className="text-[16px] font-bold text-white tracking-tight leading-none" style={{ fontFamily: "Georgia, serif" }}>{val}</div>
    <div className={`text-[10px] font-semibold ${dim ? "text-white/35" : "text-white/60"}`}>{delta}</div>
  </div>
);

/* ─── Feature Card ────────────────────────────────── */
const FeatureCard = ({ tag, iconPaths, title, desc, children, cta, delay = 0, className = "" }) => {
  const [ref, visible] = useInView(delay);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden cursor-default
        flex flex-col transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${hovered ? "-translate-y-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-white/[0.14]" : "shadow-[0_2px_12px_rgba(0,0,0,0.3)]"}
        ${className}
      `}
    >
      {/* Top stripe on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white transition-opacity duration-300"
        style={{ opacity: hovered ? 0.18 : 0 }} />

      {/* Subtle noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "160px" }} />

      <div className="p-6 flex flex-col flex-1 relative z-10">
        {/* Icon + Tag */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0
            transition-transform duration-300" style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}>
            <Icon d={iconPaths} size={16} stroke="rgba(255,255,255,0.75)" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full
            bg-white/[0.07] border border-white/10 text-white/55">
            {tag}
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug mb-2"
          style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h3>
        <p className="text-[13px] text-white/45 leading-relaxed mb-4">{desc}</p>

        <div className="flex-1">{children}</div>

        {cta && (
          <button className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/60
            hover:text-white transition-all duration-150 hover:gap-2.5 w-fit group">
            {cta}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Features ───────────────────────────────── */
const Features = () => {
  const [headerRef, headerVisible] = useInView(0);

  return (
    <section className="relative bg-zinc-950 py-28 px-6 overflow-hidden">

      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div ref={headerRef}
          className={`text-center max-w-xl mx-auto mb-14 transition-all duration-700
            ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.05] rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            <span className="text-[11px] font-semibold text-white/55 tracking-widest uppercase">
              Everything you need
            </span>
          </div>
          <h2 className="text-[clamp(32px,5vw,52px)] font-black text-white leading-[1.0] mb-4"
            style={{ letterSpacing: "-2px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Run your business
            <br />
            <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)", color: "transparent" }}>
              effortlessly.
            </span>
          </h2>
          <p className="text-[14px] text-white/40 leading-relaxed max-w-md mx-auto">
            BizEzy brings together every tool a growing business needs —
            payments, inventory, customers, and automation — in one simple app.
          </p>
        </div>

        {/* ── Stats Strip ── */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 bg-white/[0.03] border border-white/[0.08]
          rounded-2xl overflow-hidden mb-10 transition-all duration-700 delay-150
          ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {[
            { num: "₹2.4L+", label: "Avg. monthly revenue tracked" },
            { num: "500+", label: "Invoices generated daily" },
            { num: "99.8%", label: "WhatsApp reminder open rate" },
            { num: "0 hrs", label: "Manual follow-up time" },
          ].map((s, i) => (
            <div key={i} className="px-5 py-6 text-center border-r border-b border-white/[0.06]
              last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r
              sm:[&:nth-child(3)]:border-b-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0">
              <div className="text-[26px] font-black text-white tracking-tight leading-none mb-1.5"
                style={{ fontFamily: "Georgia, serif" }}>{s.num}</div>
              <div className="text-[9.5px] uppercase tracking-widest text-white/30 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── ROW 1: Payments (wide) + WhatsApp ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          <FeatureCard className="lg:col-span-2" iconPaths={Icons.wallet} tag="Payments"
            title="Track Every Payment, Instantly"
            desc="Know who's paid, who owes, and how much — across every customer and transaction, in real time."
            cta="See payment tracker" delay={0}>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 pt-0.5 pb-0.5">
              <MockRow name="Ravi Kumar" sub="Today · Order #1042" badge="Paid ₹4,200"
                dot="bg-white/[0.06] text-white/70 border-white/15" />
              <MockRow name="Meena Stores" sub="Due in 3 days · Order #1038" badge="Due ₹1,800"
                dot="bg-white/[0.04] text-white/35 border-white/10" />
              <MockRow name="Arjun Traders" sub="Partial · Order #1040" badge="Pending ₹3,200"
                dot="bg-white/[0.05] text-white/50 border-white/10" />
            </div>
          </FeatureCard>

          <FeatureCard iconPaths={Icons.whatsapp} tag="Automation"
            title="WhatsApp Payment Reminders"
            desc="Automated reminders sent on due dates — zero manual follow-up required." delay={80}>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 space-y-2">
              <div className="bg-white/[0.07] border border-white/10 rounded-xl rounded-bl-sm p-2.5">
                <div className="text-[10px] font-bold text-white/60 mb-1 flex items-center gap-1">
                  <Icon d={Icons.whatsapp} size={10} stroke="rgba(255,255,255,0.5)" strokeWidth={2.2} />
                  BizEzy Reminder
                </div>
                <div className="text-[11px] text-white/75 leading-relaxed">
                  Hi Meena! Payment of <strong className="text-white">₹1,800</strong> for Order #1038 is due today. Please pay at your earliest 🙏
                </div>
                <div className="text-[9px] text-white/25 text-right mt-1.5">10:02 AM ✓✓</div>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-br-sm p-2.5 max-w-[70%] ml-auto">
                <div className="text-[11px] text-white/60">Will pay by evening! 👍</div>
                <div className="text-[9px] text-white/25 text-right mt-1">10:05 AM</div>
              </div>
            </div>
          </FeatureCard>
        </div>

        {/* ── ROW 2: Customers · Invoicing · Analytics ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

          <FeatureCard iconPaths={Icons.users} tag="Customers"
            title="All Customer Records, One Place"
            desc="Full history per customer — orders, payments, dues, and contact info always at hand."
            cta="Explore CRM" delay={0}>
            <ul className="space-y-2.5">
              {["Full purchase & payment history","Outstanding balance at a glance","One-tap to call, message, or invoice","Smart search across all contacts"]
                .map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[12.5px] text-white/45">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </FeatureCard>

          <FeatureCard iconPaths={Icons.invoice} tag="Invoicing"
            title="Generate Invoices in Seconds"
            desc="Professional GST-ready invoices instantly — share as PDF on WhatsApp, email, or print." delay={80}>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/[0.07]">
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">Invoice</div>
                  <div className="text-[12px] font-bold text-white/80">#INV-1042</div>
                </div>
                <span className="text-[10px] bg-white/[0.07] text-white/50 font-semibold px-2.5 py-1 rounded-full border border-white/10">
                  28 Apr 2026
                </span>
              </div>
              <InvLine label="A4 Paper Ream × 5" value="₹1,250" />
              <InvLine label="Blue Pen Box × 2" value="₹480" />
              <InvLine label="GST (18%)" value="₹312" />
              <InvLine label="Total" value="₹2,042" total />
            </div>
          </FeatureCard>

          <FeatureCard iconPaths={Icons.chart} tag="Analytics"
            title="Dashboard That Tells the Full Story"
            desc="Revenue, orders, dues, and trends — summarised on your home screen every morning."
            cta="View dashboard" delay={160}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <KpiBox val="₹84.3k" lbl="Revenue" delta="↑ 12.4% this week" />
                <KpiBox val="142" lbl="Orders" delta="↑ 8 today" />
              </div>
              <KpiBox val="₹8.2k" lbl="Total Dues" delta="4 pending payments" dim />
            </div>
          </FeatureCard>
        </div>

        {/* ── ROW 3: Inventory full width ── */}
        <FeatureCard className="w-full" iconPaths={Icons.box} tag="Inventory"
          title="Smart Inventory with Low Stock Alerts"
          desc="Track every product in real time. Get instant WhatsApp alerts when stock dips below your threshold — never run out of a bestseller."
          cta="Manage inventory" delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-1">
            {/* Stock bars */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
              <StockBar name="A4 Paper" pct={8} count="2 left ⚠" warn />
              <StockBar name="Printer Ink" pct={15} count="3 left ⚠" warn />
              <StockBar name="Stapler Set" pct={44} count="44 units" />
              <StockBar name="Blue Pen Box" pct={80} count="120 units" />
              <StockBar name="Sticky Notes" pct={62} count="88 units" />
            </div>

            {/* Alert cards */}
            <div className="flex flex-col gap-2.5 justify-center">
              {[
                { warn: true, critical: true, name: "A4 Paper", sub: "Only 2 units remaining", label: "Critical" },
                { warn: true, critical: false, name: "Printer Ink", sub: "Only 3 units remaining", label: "Low" },
                { warn: false, critical: false, name: "Blue Pen Box", sub: "120 units available", label: "Restocked" },
              ].map((a, i) => (
                <div key={i}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 border
                    ${a.warn
                      ? "bg-white/[0.03] border-white/[0.08]"
                      : "bg-white/[0.05] border-white/[0.10]"
                    }`}>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={a.warn ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {a.warn
                        ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
                        : <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                      }
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold text-white/80 leading-tight">{a.name}</div>
                    <div className="text-[10.5px] text-white/35 mt-0.5">{a.sub}</div>
                  </div>
                  <span className={`text-[9.5px] font-bold px-2 py-1 rounded-full shrink-0 border
                    ${a.warn
                      ? "bg-white/[0.05] text-white/40 border-white/10"
                      : "bg-white/[0.08] text-white/70 border-white/15"
                    }`}>
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FeatureCard>

      </div>
    </section>
  );
};

export default Features;