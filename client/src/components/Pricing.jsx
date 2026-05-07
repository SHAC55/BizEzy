import React from "react";

const CHECK = "M20 6 9 17 4 12";
const CROSS = "M18 6 6 18M6 6l12 12";
const ARROW = "M5 12h14M13 6l6 6-6 6";

const Icon = ({ d, size = 14, stroke = "currentColor", strokeWidth = 2.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Feature = ({ text, included }) => (
  <li style={{
    display: "flex", alignItems: "center", gap: 10, fontSize: 13,
    color: included ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
    textDecoration: included ? "none" : "line-through",
  }}>
    <span style={{ width: 14, height: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={included ? CHECK : CROSS} stroke={included ? "#fff" : "rgba(255,255,255,0.2)"} strokeWidth={2.8} />
    </span>
    {text}
  </li>
);

const freeFeatures = [
  { text: "Up to 50 customers", included: true },
  { text: "Up to 100 sales / month", included: true },
  { text: "Basic inventory (50 items)", included: true },
  { text: "Payment tracking", included: true },
  { text: "Basic dashboard", included: true },
  { text: "Invoice generation", included: false },
  { text: "WhatsApp reminders", included: false },
  { text: "Low stock alerts", included: false },
  { text: "Unlimited customers & sales", included: false },
];

const proFeatures = [
  { text: "Unlimited customers", included: true },
  { text: "Unlimited sales", included: true },
  { text: "Unlimited inventory items", included: true },
  { text: "Payment tracking", included: true },
  { text: "Advanced dashboard & analytics", included: true },
  { text: "Invoice generation (PDF)", included: true },
  { text: "WhatsApp auto-reminders", included: true },
  { text: "Low stock alerts (WhatsApp)", included: true },
  { text: "Customer records & history", included: true },
];

const whyItems = [
  { num: "01", title: "Auto WhatsApp Reminders", desc: "Never chase payments manually — reminders go out automatically on due dates." },
  { num: "02", title: "GST Invoice Generation", desc: "Create and share professional PDF invoices in seconds via WhatsApp or email." },
  { num: "03", title: "Low Stock Alerts", desc: "Get instant WhatsApp alerts when products run low — restock before you run out." },
];

const trustItems = [
  "No credit card required",
  "Cancel anytime",
  "2 months free on registration",
  "Instant setup",
];

const Pricing = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300&family=Syne:wght@400;600;700;800&display=swap');

    .pz-section { position: relative; background: #000; padding: 72px 24px 96px; overflow: hidden; font-family: 'Syne', sans-serif; }
    .pz-section::before { content: ''; position: absolute; top: -100px; right: -80px; width: 500px; height: 500px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); pointer-events: none; }
    .pz-section::after { content: ''; position: absolute; bottom: -60px; left: -100px; width: 400px; height: 400px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.04); pointer-events: none; }

    .pz-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .pz-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1.5px; background: #fff; }
    .pz-h2 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(36px, 6vw, 60px); font-weight: 300; line-height: 1.0; letter-spacing: -0.02em; color: #fff; }
    .pz-h2 em { font-style: italic; color: rgba(255,255,255,0.4); }

    .pz-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 56px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); flex-wrap: wrap; }

    .pz-launch-pill { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #000; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; border-radius: 2px; margin-bottom: 32px; }
    .pz-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.4); animation: pz-blink 2s ease-in-out infinite; }
    @keyframes pz-blink { 0%,100%{opacity:.5} 50%{opacity:1} }

    .pz-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; overflow: hidden; margin-bottom: 32px; }
    .pz-card { padding: 36px 32px; display: flex; flex-direction: column; }
    .pz-card-free { background: #111; border-right: 1px solid rgba(255,255,255,0.1); }
    .pz-card-pro { background: #1a1a1a; }
    .pz-card-pro:hover { background: #222; }

    .pz-btn-free { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 24px; border-radius: 3px; font-family: 'Syne', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: transparent; border: 1.5px solid rgba(255,255,255,0.2); color: #fff; width: 100%; transition: all .2s; }
    .pz-btn-free:hover { background: rgba(255,255,255,0.07); border-color: #fff; }
    .pz-btn-pro { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 24px; border-radius: 3px; font-family: 'Syne', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: #fff; border: none; color: #000; width: 100%; transition: all .2s; }
    .pz-btn-pro:hover { background: #e0e0e0; transform: translateY(-1px); }

    .pz-why { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 32px; }
    .pz-why-card { padding: 24px 22px; border-right: 1px solid rgba(255,255,255,0.1); }
    .pz-why-card:last-child { border-right: none; }

    .pz-trust { display: flex; flex-wrap: wrap; justify-content: center; }
    .pz-trust-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,0.4); padding: 0 20px; border-right: 1px solid rgba(255,255,255,0.1); }
    .pz-trust-item:last-child { border-right: none; }
    .pz-trust-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .pz-fade-up { opacity: 0; transform: translateY(20px); animation: pz-fadeup .7s ease forwards; }
    .pz-d1{animation-delay:0s} .pz-d2{animation-delay:.1s} .pz-d3{animation-delay:.2s} .pz-d4{animation-delay:.3s} .pz-d5{animation-delay:.4s}
    @keyframes pz-fadeup { to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 640px) {
      .pz-header { flex-direction: column; align-items: flex-start; }
      .pz-header-sub { text-align: left !important; max-width: 100% !important; }
      .pz-cards { grid-template-columns: 1fr; }
      .pz-card-free { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .pz-why { grid-template-columns: 1fr; }
      .pz-why-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .pz-why-card:last-child { border-bottom: none; }
      .pz-trust { flex-direction: column; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
      .pz-trust-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 10px 16px; }
      .pz-trust-item:last-child { border-bottom: none; }
    }
  `;

  return (
    <section className="pz-section">
      <style>{css}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="pz-header pz-fade-up pz-d1">
          <div>
            <div className="pz-eyebrow">Simple Pricing</div>
            <h2 className="pz-h2">Start free,<br />scale <em>when ready.</em></h2>
          </div>
          <p className="pz-header-sub" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 220, textAlign: "right" }}>
            No hidden fees. No credit card required. All Pro features free for 2 months on registration.
          </p>
        </div>

        {/* Launch pill */}
        <div className="pz-fade-up pz-d2">
          <div className="pz-launch-pill">
            <span className="pz-dot" />
            🎉 Launch — 2 Months Free
          </div>
        </div>

        {/* Cards */}
        <div className="pz-cards pz-fade-up pz-d3">

          {/* Free */}
          <div className="pz-card pz-card-free">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
              For individuals
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, color: "#fff", marginBottom: 6 }}>Free</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>₹0</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>/ forever</div>
            </div>
            <div style={{ height: 25, marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              Perfect for getting started and trying out BizEzy with no commitment.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11, flex: 1, marginBottom: 32 }}>
              {freeFeatures.map((f, i) => <Feature key={i} {...f} />)}
            </ul>
            <button className="pz-btn-free">Get Started Free <Icon d={ARROW} stroke="currentColor" /></button>
          </div>

          {/* Pro */}
          <div className="pz-card pz-card-pro">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              For growing businesses
              <span style={{ background: "#fff", color: "#000", padding: "3px 8px", borderRadius: 2, fontSize: 8, fontWeight: 800 }}>★ Popular</span>
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, color: "#fff", marginBottom: 6 }}>Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>₹99</span>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>₹49</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>/ month</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 2, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                50% OFF — Launch Offer
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              Everything your business needs — payments, invoices, inventory, and automation.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11, flex: 1, marginBottom: 32 }}>
              {proFeatures.map((f, i) => <Feature key={i} {...f} />)}
            </ul>
            <button className="pz-btn-pro">Start Free — 2 Months On Us <Icon d={ARROW} stroke="currentColor" /></button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>
              First 2 months free · Cancel anytime
            </p>
          </div>
        </div>

        {/* Why upgrade */}
        <div className="pz-why pz-fade-up pz-d4">
          {whyItems.map((item, i) => (
            <div key={i} className="pz-why-card">
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 300, color: "rgba(255,255,255,0.15)", lineHeight: 1, marginBottom: 10 }}>{item.num}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="pz-trust pz-fade-up pz-d5">
          {trustItems.map((t, i, arr) => (
            <div key={i} className="pz-trust-item">
              <div className="pz-trust-dot">
                <Icon d={CHECK} size={8} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
              </div>
              {t}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;