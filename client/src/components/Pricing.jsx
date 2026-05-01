import React, { useState } from "react";

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
  <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13,
    color: included ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
    textDecoration: included ? "none" : "line-through",
  }}>
    <span style={{ width: 14, height: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon
        d={included ? CHECK : CROSS}
        stroke={included ? "#fff" : "rgba(255,255,255,0.2)"}
        strokeWidth={2.8}
      />
    </span>
    {text}
  </li>
);

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Syne:wght@400;600;700;800&display=swap');

    .pz2-section { position: relative; background: #000; padding: 80px 24px 100px; overflow: hidden; font-family: 'Syne', sans-serif; }
    .pz2-serif { font-family: 'Fraunces', Georgia, serif; }
    .pz2-sans { font-family: 'Syne', sans-serif; }

    .pz2-header { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 24px; margin-bottom: 60px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    @media (max-width: 640px) { .pz2-header { grid-template-columns: 1fr; } }

    .pz2-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .pz2-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1.5px; background: #fff; }

    .pz2-h2 { font-family: 'Fraunces', Georgia, serif; font-size: clamp(38px, 6vw, 62px); font-weight: 300; line-height: 1.0; letter-spacing: -0.02em; color: #fff; }
    .pz2-h2 em { font-style: italic; color: rgba(255,255,255,0.5); }

    .pz2-launch-pill { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #000; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; border-radius: 2px; }
    .pz2-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.4); animation: pz2-blink 2s ease-in-out infinite; }
    @keyframes pz2-blink { 0%,100%{opacity:.5} 50%{opacity:1} }

    .pz2-toggle { width: 40px; height: 22px; border-radius: 100px; border: none; cursor: pointer; position: relative; flex-shrink: 0; transition: background .3s; }
    .pz2-knob { position: absolute; top: 3px; width: 16px; height: 16px; border-radius: 50%; transition: transform .3s; }

    .pz2-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; overflow: hidden; }
    @media (max-width: 640px) { .pz2-cards { grid-template-columns: 1fr; } }

    .pz2-card { padding: 36px 32px; display: flex; flex-direction: column; transition: background .3s; }
    .pz2-card-free { background: #111; border-right: 1px solid rgba(255,255,255,0.1); }
    @media (max-width: 640px) { .pz2-card-free { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); } }
    .pz2-card-pro { background: #1a1a1a; }
    .pz2-card-pro:hover { background: #222; }

    .pz2-cta-free { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 24px; border-radius: 3px; font-family: 'Syne', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: transparent; border: 1.5px solid rgba(255,255,255,0.2); color: #fff; transition: all .2s; width: 100%; }
    .pz2-cta-free:hover { background: rgba(255,255,255,0.07); border-color: #fff; }

    .pz2-cta-pro { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 24px; border-radius: 3px; font-family: 'Syne', sans-serif; font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; background: #fff; border: none; color: #000; transition: all .2s; width: 100%; }
    .pz2-cta-pro:hover { background: #e0e0e0; transform: translateY(-1px); }

    .pz2-why { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
    @media (max-width: 640px) { .pz2-why { grid-template-columns: 1fr; } }
    .pz2-why-card { padding: 24px 22px; border-right: 1px solid rgba(255,255,255,0.1); }
    .pz2-why-card:last-child { border-right: none; }
    @media (max-width: 640px) { .pz2-why-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); } .pz2-why-card:last-child { border-bottom: none; } }

    .pz2-trust-check { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .pz2-fade-up { opacity: 0; transform: translateY(20px); animation: pz2-fadeup .7s ease forwards; }
    .pz2-d1 { animation-delay: 0s; }
    .pz2-d2 { animation-delay: .1s; }
    .pz2-d3 { animation-delay: .2s; }
    .pz2-d4 { animation-delay: .3s; }
    .pz2-d5 { animation-delay: .4s; }
    @keyframes pz2-fadeup { to { opacity: 1; transform: translateY(0); } }
  `;

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

  const proPrice = annual ? 39 : 49;
  const origPrice = annual ? 49 : 99;
  const pricePeriod = annual ? "/ mo · billed yearly" : "/ month";
  const offerLabel = annual ? "20% OFF — Annual Plan" : "50% OFF — Launch Offer";

  return (
    <section className="pz2-section pz2-sans">
      <style>{css}</style>

      <div style={{ position: "absolute", top: -100, right: -80, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -100, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="pz2-header pz2-fade-up pz2-d1">
          <div>
            <div className="pz2-eyebrow">Simple Pricing</div>
            <h2 className="pz2-h2">Start free,<br />scale <em>when ready.</em></h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 220, textAlign: "right" }}>
              No hidden fees. No credit card required. All Pro features free for 2 months on registration.
            </p>
          </div>
        </div>

        {/* Toggle Row */}
        <div className="pz2-fade-up pz2-d2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div className="pz2-launch-pill">
            <span className="pz2-dot" />
            🎉 Launch — 2 Months Free
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span style={{ color: !annual ? "#fff" : "rgba(255,255,255,0.35)", transition: "color .2s" }}>Monthly</span>
            <button
              className="pz2-toggle"
              style={{ background: annual ? "#fff" : "rgba(255,255,255,0.15)" }}
              onClick={() => setAnnual(a => !a)}
            >
              <div className="pz2-knob" style={{ transform: annual ? "translateX(21px)" : "translateX(3px)", background: annual ? "#000" : "#666" }} />
            </button>
            <span style={{ color: annual ? "#fff" : "rgba(255,255,255,0.35)", transition: "color .2s" }}>Yearly</span>
            {annual && (
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", background: "#fff", color: "#000", padding: "3px 8px", borderRadius: 2 }}>
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="pz2-cards pz2-fade-up pz2-d3" style={{ marginBottom: 32 }}>
          {/* Free */}
          <div className="pz2-card pz2-card-free">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
              For individuals
            </div>
            <div className="pz2-serif" style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, color: "#fff", marginBottom: 6 }}>
              Free
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div className="pz2-serif" style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>₹0</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>/ forever</div>
            </div>
            <div style={{ height: 25, marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              Perfect for getting started and trying out BizEzy with no commitment.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11, flex: 1, marginBottom: 32 }}>
              {freeFeatures.map((f, i) => <Feature key={i} {...f} />)}
            </ul>
            <button className="pz2-cta-free">
              Get Started Free <Icon d={ARROW} stroke="currentColor" />
            </button>
          </div>

          {/* Pro */}
          <div className="pz2-card pz2-card-pro">
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              For growing businesses
              <span style={{ background: "#fff", color: "#000", padding: "3px 8px", borderRadius: 2, fontSize: 8, fontWeight: 800 }}>★ Popular</span>
            </div>
            <div className="pz2-serif" style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, color: "#fff", marginBottom: 6 }}>
              Pro
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>₹{origPrice}</span>
              <div className="pz2-serif" style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>₹{proPrice}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{pricePeriod}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 2, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                {offerLabel}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              Everything your business needs — payments, invoices, inventory, and automation.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 11, flex: 1, marginBottom: 32 }}>
              {proFeatures.map((f, i) => <Feature key={i} {...f} />)}
            </ul>
            <button className="pz2-cta-pro">
              Start Free — 2 Months On Us <Icon d={ARROW} stroke="currentColor" />
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>
              First 2 months free · Cancel anytime
            </p>
          </div>
        </div>

        {/* Why upgrade */}
        <div className="pz2-why pz2-fade-up pz2-d4" style={{ marginBottom: 32 }}>
          {whyItems.map((item, i) => (
            <div key={i} className="pz2-why-card">
              <div className="pz2-serif" style={{ fontSize: 36, fontWeight: 300, color: "rgba(255,255,255,0.15)", lineHeight: 1, marginBottom: 10 }}>{item.num}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="pz2-fade-up pz2-d5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 0" }}>
          {["No credit card required", "Cancel anytime", "2 months free on registration", "Instant setup"].map((t, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "0 20px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
              <span className="pz2-trust-check">
                <Icon d={CHECK} size={8} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
              </span>
              {t}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;