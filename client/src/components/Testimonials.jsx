import React, { useEffect, useRef, useState, useCallback } from "react";

const TESTIMONIALS = [
  {
    name: "Kushal Patil",
    role: "Saloon Owner",
    location: "Powai, Mumbai",
    av: "KP",
    metric: { val: "₹7k+", label: "Dues recovered" },
    tag: "Collections",
    title: "Finally, no more missed payments.",
    text: "Before BizEzy, I used to forget which customers owed me money. The WhatsApp reminders go out automatically and I've recovered almost ₹7,000 in dues I'd given up on. The dashboard shows everything at a glance — I check it every morning before opening.",
    accentBg: "#f5f9ff",
    accentBorder: "#c8deff",
    accentText: "#1a5fcb",
  },
  {
    name: "Aseem Shaikh",
    role: "Water Supplier",
    location: "Thane, Maharashtra",
    av: "AS",
    metric: { val: "100+", label: "Customers managed" },
    tag: "Scale",
    title: "Managing 100+ customers is now effortless.",
    text: "With daily deliveries and so many customers, keeping records was a nightmare. BizEzy keeps every customer's history — what they bought, what they paid, what they owe. My accountant is happy and I'm finally stress-free at month end.",
    accentBg: "#f3f0ff",
    accentBorder: "#c4b3f8",
    accentText: "#5b21b6",
  },
  {
    name: "Irshad Shaikh",
    role: "AC Service & Repair",
    location: "Nagpur, Maharashtra",
    av: "IS",
    metric: { val: "2 hrs", label: "Saved every day" },
    tag: "Efficiency",
    title: "Inventory alerts saved my business.",
    text: "I used to run out of spare parts without realising it. BizEzy's low stock alert on WhatsApp tells me exactly what to reorder before it's too late. Invoice generation saves me 2 hours every day — my customers love the professional PDF bills.",
    accentBg: "#f0fdf8",
    accentBorder: "#a7e9d5",
    accentText: "#0d6e57",
  },
  {
    name: "Ahmed Ansari",
    role: "Electronics Dealer",
    location: "Kurla, Mumbai",
    av: "AA",
    metric: { val: "3×", label: "More invoices sent" },
    tag: "Growth",
    title: "Best ₹49 I spend every month.",
    text: "I was skeptical about paying for an app but the 2 months free offer made it a no-brainer. Within the first week I generated more invoices than I did all of last month. Fast, simple, and designed for shops like mine — not big corporates.",
    accentBg: "#fff8f2",
    accentBorder: "#fdc49e",
    accentText: "#c2410c",
  },
];

const StarRow = () => (
  <div style={{ display: "flex", gap: 3 }}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="#0f172a"
        stroke="#0f172a"
        strokeWidth="1"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive((a) => (a + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 280);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const goTo = useCallback(
    (i) => {
      if (i === active || fading) return;
      setFading(true);
      setTimeout(() => {
        setActive(i);
        setFading(false);
      }, 280);
      resetTimer();
    },
    [active, fading, resetTimer],
  );

  const t = TESTIMONIALS[active];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#fff",
        padding: "100px 24px",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .bz-serif { font-family: 'DM Serif Display', Georgia, serif; }
        .bz-sans  { font-family: 'DM Sans', sans-serif; }

        .bz-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 100px;
          border: 1.5px solid #e4e4e7;
          background: #fff; cursor: pointer;
          font-size: 12.5px; font-weight: 500; color: #71717a;
          transition: all 0.18s ease;
        }
        .bz-tab:hover { border-color: #a1a1aa; color: #3f3f46; }
        .bz-tab.active {
          background: #0c1526; border-color: #0c1526; color: #fff;
        }
        .bz-tab-dot {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 600; flex-shrink: 0;
        }

        .bz-card {
          display: grid; grid-template-columns: 220px 1fr;
          border: 1.5px solid #e4e4e7; border-radius: 20px;
          overflow: hidden; background: #fff;
          box-shadow: 6px 6px 0px #0c1526;
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        @media (max-width: 700px) {
          .bz-card { grid-template-columns: 1fr; }
        }
        .bz-card.fading { opacity: 0; transform: translateY(10px); }

        .bz-left {
          padding: 32px 28px;
          border-right: 1.5px solid #e4e4e7;
          display: flex; flex-direction: column; gap: 20px;
          background: #fafafa;
        }
        @media (max-width: 700px) {
          .bz-left { border-right: none; border-bottom: 1.5px solid #e4e4e7; }
        }

        .bz-right { padding: 36px 40px; display: flex; flex-direction: column; }

        .bz-avatar {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          background: #0c1526; position: relative; letter-spacing: 0.5px;
        }
        .bz-verified {
          position: absolute; bottom: -5px; right: -5px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #22c55e; border: 2px solid #fafafa;
          display: flex; align-items: center; justify-content: center;
        }

        .bz-metric {
          padding: 14px 16px; border-radius: 14px; text-align: center;
          border: 1.5px solid;
        }

        .bz-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #e4e4e7; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #52525b;
          transition: all 0.15s ease;
        }
        .bz-nav-btn:hover {
          background: #0c1526; border-color: #0c1526; color: #fff;
          transform: scale(1.05);
        }
        .bz-nav-btn:active { transform: scale(0.96); }

        .bz-dot {
          width: 6px; height: 6px; border-radius: 50%;
          cursor: pointer; border: 1.5px solid #0c1526;
          transition: all 0.2s ease;
        }
        .bz-dot.active { background: #0c1526; }

        .bz-trust-item { display: flex; align-items: center; gap: 7px; }

        @keyframes bz-progress { from { width: 0% } to { width: 100% } }
        .bz-progress-fill { animation: bz-progress 5s linear forwards; }

        .bz-fade-in {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .bz-fade-in.hidden { opacity: 0; transform: translateY(22px); }
        .bz-fade-in.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* ─── Header ─── */}
        <div
          className={`bz-sans bz-fade-in ${visible ? "visible" : "hidden"}`}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid #e4e4e7",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#0c1526",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: "#71717a",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Real stories
            </span>
          </div>

          <h2
            className="bz-serif"
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 400,
              color: "#0c1526",
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 0 14px",
            }}
          >
            Shops that run
            <br />
            <em style={{ fontStyle: "italic" }}>smarter with BizEzy.</em>
          </h2>

          <div
            style={{
              width: 40,
              height: 2.5,
              background: "#0c1526",
              margin: "0 auto 14px",
            }}
          />

          <p
            style={{
              fontSize: 14,
              color: "#a1a1aa",
              fontWeight: 300,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Real business owners. Real numbers. Zero fluff.
          </p>
        </div>

        {/* ─── Tabs ─── */}
        <div
          className={`bz-sans bz-fade-in ${visible ? "visible" : "hidden"}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginBottom: 32,
            transitionDelay: "0.12s",
          }}
        >
          {TESTIMONIALS.map((p, i) => (
            <button
              key={i}
              className={`bz-tab ${i === active ? "active" : ""}`}
              onClick={() => goTo(i)}
            >
              <div
                className="bz-tab-dot"
                style={{
                  background:
                    i === active ? "rgba(255,255,255,0.15)" : p.accentBg,
                  color: i === active ? "#fff" : p.accentText,
                  border: `1.5px solid ${i === active ? "rgba(255,255,255,0.2)" : p.accentBorder}`,
                }}
              >
                {p.av}
              </div>
              {p.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* ─── Main card ─── */}
        <div
          className={`bz-sans bz-fade-in ${visible ? "visible" : "hidden"}`}
          style={{ transitionDelay: "0.22s" }}
        >
          <div className={`bz-card ${fading ? "fading" : ""}`}>
            {/* Left */}
            <div className="bz-left">
              {/* Avatar */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div className="bz-avatar">
                  {t.av}
                  <div className="bz-verified">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0c1526",
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      fontWeight: 300,
                      color: "#a1a1aa",
                    }}
                  >
                    {t.role}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 6,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a1a1aa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#a1a1aa",
                        fontWeight: 300,
                      }}
                    >
                      {t.location}
                    </span>
                  </div>
                </div>
              </div>

              <StarRow />

              {/* Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#0c1526",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  alignSelf: "flex-start",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.6,
                  }}
                />
                {t.tag}
              </div>

              {/* Metric */}
              <div
                className="bz-metric"
                style={{
                  background: t.accentBg,
                  borderColor: t.accentBorder,
                }}
              >
                <div
                  className="bz-serif"
                  style={{
                    fontSize: 34,
                    color: "#0c1526",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    fontStyle: "italic",
                    marginBottom: 5,
                  }}
                >
                  {t.metric.val}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "#71717a",
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.metric.label}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="bz-right">
              {/* Decorative quote mark */}
              <div
                className="bz-serif"
                style={{
                  fontSize: 88,
                  lineHeight: 0.65,
                  color: "#0c1526",
                  opacity: 0.07,
                  marginBottom: 20,
                  userSelect: "none",
                }}
              >
                "
              </div>

              <h3
                className="bz-serif"
                style={{
                  fontSize: "clamp(20px, 2.5vw, 24px)",
                  fontWeight: 400,
                  color: "#0c1526",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                  margin: "0 0 18px",
                }}
              >
                "{t.title}"
              </h3>

              <p
                style={{
                  fontSize: 14.5,
                  fontWeight: 300,
                  color: "#71717a",
                  lineHeight: 1.85,
                  margin: 0,
                  flex: 1,
                }}
              >
                {t.text}
              </p>

              {/* Bottom row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 36,
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {/* Progress bar + counter */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: "#f0f0f0",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      key={`bar-${active}`}
                      className="bz-progress-fill"
                      style={{
                        height: "100%",
                        borderRadius: 99,
                        background: "#0c1526",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#a1a1aa",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(TESTIMONIALS.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Dots + Nav */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {TESTIMONIALS.map((_, i) => (
                      <div
                        key={i}
                        className={`bz-dot ${i === active ? "active" : ""}`}
                        onClick={() => goTo(i)}
                      />
                    ))}
                  </div>
                  <div
                    style={{ width: 1, height: 20, background: "#e4e4e7" }}
                  />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="bz-nav-btn"
                      onClick={() =>
                        goTo(
                          (active - 1 + TESTIMONIALS.length) %
                            TESTIMONIALS.length,
                        )
                      }
                      aria-label="Previous"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      className="bz-nav-btn"
                      onClick={() => goTo((active + 1) % TESTIMONIALS.length)}
                      aria-label="Next"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Trust strip ─── */}
        <div
          className={`bz-sans bz-fade-in ${visible ? "visible" : "hidden"}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 32px",
            marginTop: 36,
            paddingTop: 28,
            borderTop: "1.5px solid #f0f0f0",
            transitionDelay: "0.4s",
          }}
        >
          {[
            "Trusted by shop owners",
            "Across Maharashtra & beyond",
            "Growing faster",
            "Real businesses, real results",
          ].map((txt, i) => (
            <div key={i} className="bz-trust-item">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0c1526"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 12, color: "#71717a", fontWeight: 400 }}>
                {txt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
