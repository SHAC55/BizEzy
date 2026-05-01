import React from "react";

const sections = [
  {
    title: "Use of service",
    body: (
      <>
        BizEzy provides tools to manage business operations. You agree to use
        the platform only for lawful purposes and not misuse or attempt to
        disrupt the service in any way.
      </>
    ),
  },
  {
    title: "User accounts",
    body: (
      <>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account.
      </>
    ),
  },
  {
    title: "Free access",
    body: (
      <>
        BizEzy currently offers{" "}
        <strong className="text-zinc-900 font-medium">
          2 months of free access
        </strong>{" "}
        to all features from the date of registration. No payment is required
        during this period.
      </>
    ),
  },
  {
    title: "Future pricing",
    body: (
      <>
        We may introduce paid plans or premium features in the future. Users
        will be notified well in advance before any charges are applied.
      </>
    ),
  },
  {
    title: "Prohibited activities",
    body: (
      <>
        You agree not to misuse the platform — including but not limited to
        unauthorized access, data scraping, reverse engineering, or any attempt
        to harm the system or other users.
      </>
    ),
  },
  {
    title: "Termination",
    body: (
      <>
        We reserve the right to suspend or terminate accounts that violate
        these terms or misuse the platform, without prior notice.
      </>
    ),
  },
  {
    title: "Limitation of liability",
    body: (
      <>
        BizEzy is provided "as is" without warranties of any kind. We are not
        responsible for any data loss, business loss, or damages arising from
        use of the platform.
      </>
    ),
  },
  {
    title: "Changes to terms",
    body: (
      <>
        We may update these terms from time to time. Continued use of the
        platform after changes are published constitutes your acceptance of the
        updated terms.
      </>
    ),
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-white w-full font-sans">

      {/* ── Hero ── */}
      <div className="relative bg-black text-white px-12 pt-14 pb-20 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/[0.05]" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-white/[0.04]" />

        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[11px] tracking-[.1em] uppercase text-white/50 font-medium">
            Legal
          </span>
        </div>

        <h1
          className="text-4xl lg:text-5xl font-medium leading-[1.08] max-w-lg mb-4"
          style={{ letterSpacing: "-1.5px" }}
        >
          Terms &amp;{" "}
          <span className="text-white/30">Conditions.</span>
        </h1>

        <p className="text-[14px] text-white/45 leading-relaxed max-w-md">
          By using BizEzy, you agree to the following terms. Please read them
          carefully before getting started.
        </p>

        <div className="mt-9 h-px bg-white/10" />
      </div>

      {/* ── Body ── */}
      <div className="px-12 py-11">

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-9">
          <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 text-[12px] font-medium text-zinc-500">
            <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Last updated: May 2026
          </div>
          <div className="inline-flex items-center gap-1.5 bg-black text-white rounded-full px-4 py-1.5 text-[12px] font-medium">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Currently active
          </div>
        </div>

        {/* Numbered sections */}
        <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200 mb-7">
          {sections.map((sec, i) => (
            <div key={i} className="flex bg-white">
              {/* Number column */}
              <div className="w-14 flex-shrink-0 flex items-start justify-center pt-6 border-r border-zinc-200">
                <div className="w-7 h-7 rounded-lg bg-black text-white text-[12px] font-medium flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              {/* Content */}
              <div className="px-6 py-5">
                <h3 className="text-[14px] font-medium text-zinc-900 mb-1.5 capitalize">
                  {sec.title}
                </h3>
                <p className="text-[13px] text-zinc-500 leading-[1.72]">
                  {sec.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-zinc-200 rounded-2xl px-7 py-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-[15px] font-medium text-zinc-900 mb-1.5">
              Questions about these terms?
            </h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-sm">
              Our team is happy to clarify anything. We typically respond
              within 24–48 hours.
            </p>
          </div>
          <a
            href="mailto:bizezyapp@gmail.com"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            bizezyapp@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
};

export default Terms;