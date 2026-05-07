import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useAuth";
import { useUpdateBusiness } from "../hooks/useBusiness";
import {
  MdBusiness,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLogout,
  MdVerified,
  MdReceiptLong,
  MdLocationOn,
} from "react-icons/md";

/* ─── Design tokens ──────────────────────────────────────────────────── */
const token = {
  // Surfaces
  white:     "#ffffff",
  offWhite:  "#f9f9f8",
  cloud:     "#f2f1ef",
  fog:       "#e8e7e4",
  mist:      "#d4d3cf",

  // Ink
  ink100:    "#1a1a18",
  ink80:     "#2e2e2b",
  ink60:     "#555551",
  ink40:     "#888884",
  ink20:     "#b8b7b3",
  ink10:     "#d4d3cf",
};

const styles = {
  /* Page */
  page: {
    minHeight: "100vh",
    width: "100%",
    background: token.cloud,
    fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
    paddingBottom: "5rem",
  },

  /* Hero strip */
  hero: {
    background: token.ink100,
    color: token.white,
    padding: "3rem 0 2.5rem",
  },
  heroInner: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "0 2rem",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
  },
  heroEyebrow: {
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: token.ink40,
    marginBottom: "0.4rem",
    fontFamily: "inherit",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    color: token.white,
    margin: 0,
  },
  heroSub: {
    fontSize: "11px",
    color: token.ink40,
    letterSpacing: "0.15em",
    marginTop: "0.5rem",
    textTransform: "uppercase",
  },

  /* Sign-out button */
  signoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: `1px solid ${token.ink60}`,
    color: token.ink20,
    background: "transparent",
    padding: "0.6rem 1.1rem",
    fontSize: "9px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  },

  /* Main body */
  body: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "2rem 2rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "1px",           // hairline gap between panels = stacked look
  },

  /* Panel (card) */
  panel: {
    background: token.white,
    border: `1px solid ${token.fog}`,
  },

  /* Panel header */
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    borderBottom: `1px solid ${token.fog}`,
    background: token.offWhite,
  },
  panelIconBox: {
    width: "28px",
    height: "28px",
    border: `1px solid ${token.fog}`,
    background: token.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: token.ink40,
    flexShrink: 0,
  },
  panelTitle: {
    fontSize: "9px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: token.ink60,
    margin: 0,
  },
  panelSubtitle: {
    fontSize: "10px",
    color: token.ink20,
    letterSpacing: "0.08em",
    marginTop: "1px",
  },

  /* Panel body */
  panelBody: {
    padding: "1.5rem",
  },

  /* Avatar row */
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    paddingBottom: "1.5rem",
    borderBottom: `1px solid ${token.fog}`,
  },
  avatar: {
    width: "52px",
    height: "52px",
    background: token.ink100,
    color: token.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "22px",
    fontWeight: 900,
    flexShrink: 0,
    letterSpacing: "-0.02em",
  },
  avatarName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: token.ink100,
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    letterSpacing: "-0.01em",
  },
  avatarMeta: {
    fontSize: "10px",
    color: token.ink40,
    letterSpacing: "0.1em",
    marginTop: "2px",
    textTransform: "uppercase",
  },

  /* 2-col info grid */
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1px",
    background: token.fog,
    border: `1px solid ${token.fog}`,
  },
  infoCell: {
    background: token.white,
    padding: "0.85rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
  },
  infoCellIcon: {
    color: token.ink20,
    flexShrink: 0,
  },
  infoCellLabel: {
    fontSize: "8.5px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: token.ink40,
    marginBottom: "2px",
  },
  infoCellValue: {
    fontSize: "12px",
    fontWeight: 500,
    color: token.ink80,
    letterSpacing: "0.02em",
  },

  /* Status rows */
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.9rem 0",
    borderBottom: `1px solid ${token.fog}`,
  },
  statusDot: (active) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: active ? token.ink100 : token.ink20,
    flexShrink: 0,
  }),
  statusText: {
    fontSize: "11px",
    color: token.ink60,
    letterSpacing: "0.05em",
  },
  statusStrong: {
    fontWeight: 600,
    color: token.ink100,
  },

  /* Form elements */
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  label: {
    display: "block",
  },
  labelText: {
    display: "block",
    fontSize: "8.5px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: token.ink40,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    background: token.offWhite,
    border: `1px solid ${token.fog}`,
    color: token.ink80,
    fontSize: "11px",
    fontFamily: "inherit",
    padding: "0.7rem 0.85rem",
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.03em",
    transition: "border-color 0.12s ease",
  },
  textarea: {
    width: "100%",
    background: token.offWhite,
    border: `1px solid ${token.fog}`,
    color: token.ink80,
    fontSize: "11px",
    fontFamily: "inherit",
    padding: "0.7rem 0.85rem",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    letterSpacing: "0.03em",
    lineHeight: 1.6,
  },

  /* Hint strip */
  hint: {
    marginTop: "1.25rem",
    borderLeft: `2px solid ${token.ink20}`,
    background: token.offWhite,
    padding: "0.85rem 1rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "flex-start",
  },
  hintTitle: {
    fontSize: "10px",
    fontWeight: 600,
    color: token.ink80,
    letterSpacing: "0.06em",
    marginBottom: "2px",
    textTransform: "uppercase",
  },
  hintBody: {
    fontSize: "10px",
    color: token.ink60,
    letterSpacing: "0.04em",
    lineHeight: 1.55,
  },

  /* Save button */
  saveBtn: {
    marginTop: "1.25rem",
    background: token.ink100,
    color: token.white,
    border: "none",
    fontSize: "9px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    padding: "0.85rem 1.75rem",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },

  /* Error banner */
  error: {
    marginBottom: "1rem",
    border: `1px solid ${token.mist}`,
    background: token.offWhite,
    padding: "0.7rem 1rem",
    fontSize: "10px",
    color: token.ink60,
    letterSpacing: "0.06em",
    borderLeft: `3px solid ${token.ink80}`,
  },

  /* Loading screen */
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: token.cloud,
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: `1.5px solid ${token.fog}`,
    borderTopColor: token.ink80,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: "1rem",
  },
  loadingLabel: {
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: token.ink40,
    fontFamily: "'DM Mono', 'Fira Mono', monospace",
  },
};

/* ─── Sub-components ─────────────────────────────────────────────────── */

const Panel = ({ icon, title, subtitle, children }) => (
  <div style={styles.panel}>
    <div style={styles.panelHeader}>
      <div style={styles.panelIconBox}>{icon}</div>
      <div>
        <p style={styles.panelTitle}>{title}</p>
        {subtitle && <p style={styles.panelSubtitle}>{subtitle}</p>}
      </div>
    </div>
    <div style={styles.panelBody}>{children}</div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────────────── */

const Profile = () => {
  const { user, isLoading } = useAuthContext();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const {
    updateBusiness,
    isLoading: isSavingBusiness,
    error: businessError,
  } = useUpdateBusiness();

  const [businessForm, setBusinessForm] = useState({
    name: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    setBusinessForm({
      name: user?.business?.name || "",
      gstNumber: user?.business?.gstNumber || "",
      address: user?.business?.address || "",
    });
  }, [user]);

  if (isLoading) {
    return (
      <div style={styles.loadingWrap}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinner} />
          <p style={styles.loadingLabel}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    updateBusiness(businessForm);
  };

  const infoCards = [
    { icon: <MdPerson size={16} />, label: "Username", value: user.name || "—" },
    { icon: <MdEmail size={16} />, label: "Email", value: user.email || "—" },
    { icon: <MdPhone size={16} />, label: "Mobile", value: user.mobile || "—" },
    { icon: <MdBusiness size={16} />, label: "Business", value: user.business?.name || "—" },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus {
          border-color: #1a1a18 !important;
          background: #ffffff !important;
        }
        input::placeholder, textarea::placeholder { color: #d4d3cf; }
        button[data-signout]:hover { background: #2e2e2b !important; border-color: #2e2e2b !important; color: #f9f9f8 !important; }
        button[data-save]:hover { background: #2e2e2b !important; }
        button:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div>
            <p style={styles.heroEyebrow}>Account Dashboard</p>
            <h1 style={styles.heroTitle}>Profile</h1>
            <p style={styles.heroSub}>{user.name || "User"}</p>
          </div>

          <button
            data-signout
            onClick={logout}
            disabled={isLoggingOut}
            style={styles.signoutBtn}
          >
            {isLoggingOut
              ? <div style={{ width: 12, height: 12, border: "1px solid #888884", borderTopColor: "#f9f9f8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : <MdLogout size={14} />
            }
            {isLoggingOut ? "Logging out…" : "Sign out"}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* ── Personal Information ── */}
        <Panel
          icon={<MdPerson size={15} />}
          title="Personal Information"
        >
          {/* Avatar row */}
          <div style={styles.avatarRow}>
            <div style={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div style={styles.avatarName}>
                {user.name || "—"}
                {user.verified && (
                  <MdVerified size={15} style={{ color: token.ink40 }} title="Verified" />
                )}
              </div>
              <p style={styles.avatarMeta}>
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div style={styles.infoGrid}>
            {infoCards.map((card) => (
              <div key={card.label} style={styles.infoCell}>
                <span style={styles.infoCellIcon}>{card.icon}</span>
                <div>
                  <p style={styles.infoCellLabel}>{card.label}</p>
                  <p style={styles.infoCellValue}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* ── Account Status ── */}
        <Panel
          icon={<MdVerified size={15} />}
          title="Account Status"
        >
          <div>
            <div style={styles.statusRow}>
              <span style={styles.statusDot(user.verified)} />
              <p style={styles.statusText}>
                Account is{" "}
                <strong style={styles.statusStrong}>
                  {user.verified ? "verified" : "pending verification"}
                </strong>
              </p>
            </div>
            {user.provider && (
              <div style={{ ...styles.statusRow, borderBottom: "none", paddingBottom: 0 }}>
                <span style={styles.statusDot(true)} />
                <p style={styles.statusText}>
                  Signed in via{" "}
                  <strong style={styles.statusStrong}>
                    {user.provider}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </Panel>

        {/* ── Business Details ── */}
        <Panel
          icon={<MdReceiptLong size={15} />}
          title="Invoice Business Details"
          subtitle="Used in invoices and reminder messages"
        >
          {businessError && (
            <div style={styles.error}>{businessError}</div>
          )}

          <form onSubmit={handleBusinessSubmit}>
            <div style={styles.formGrid}>

              {/* Business Name */}
              <label style={styles.label}>
                <span style={styles.labelText}>Business Name</span>
                <input
                  value={businessForm.name}
                  onChange={(e) =>
                    setBusinessForm((c) => ({ ...c, name: e.target.value }))
                  }
                  style={styles.input}
                />
              </label>

              {/* GST Number */}
              <label style={styles.label}>
                <span style={styles.labelText}>GST Number</span>
                <input
                  value={businessForm.gstNumber}
                  onChange={(e) =>
                    setBusinessForm((c) => ({ ...c, gstNumber: e.target.value }))
                  }
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  style={styles.input}
                />
              </label>

              {/* Address */}
              <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
                <span style={styles.labelText}>Business Address</span>
                <textarea
                  value={businessForm.address}
                  onChange={(e) =>
                    setBusinessForm((c) => ({ ...c, address: e.target.value }))
                  }
                  rows={4}
                  placeholder="Billing address for invoices"
                  style={styles.textarea}
                />
              </label>
            </div>

            {/* Hint */}
            <div style={styles.hint}>
              <MdLocationOn size={14} style={{ color: token.ink20, marginTop: "1px", flexShrink: 0 }} />
              <div>
                <p style={styles.hintTitle}>Invoice Readiness</p>
                <p style={styles.hintBody}>
                  {user.business?.gstNumber && user.business?.address
                    ? "GST and address are on file — invoices will include complete billing details."
                    : "Add your GST number and address so invoice printouts include complete billing information."}
                </p>
              </div>
            </div>

            {/* Save */}
            <button
              data-save
              type="submit"
              disabled={isSavingBusiness}
              style={styles.saveBtn}
            >
              {isSavingBusiness ? "Saving…" : "Save Business Details"}
            </button>
          </form>
        </Panel>

      </div>
    </div>
  );
};

export default Profile;