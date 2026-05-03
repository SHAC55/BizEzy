import React from "react";

const RefundPolicy = () => {
  const items = [
    <>
      BizEzy is currently offered <strong className="text-zinc-900 font-medium">completely free of charge</strong> for
      all users. Upon registration, users receive{" "}
      <strong className="text-zinc-900 font-medium">2 months of free access</strong> to every feature available on
      the platform.
    </>,
    <>
      During this free access period, users can explore and use{" "}
      <strong className="text-zinc-900 font-medium">all functionalities</strong> without any payment or
      subscription requirement whatsoever.
    </>,
    <>
      As no payments are collected at this time,{" "}
      <strong className="text-zinc-900 font-medium">no refunds are applicable</strong>. There is nothing to charge
      and nothing to return.
    </>,
    <>
      BizEzy may introduce{" "}
      <strong className="text-zinc-900 font-medium">paid plans or premium features</strong> in the future. Users
      will be notified well in advance, and updated billing and refund policies
      will be communicated clearly.
    </>,
  ];

  return (
    <div className="min-h-screen bg-white w-full font-sans">

      {/* ── Hero ── */}
      <div className="relative bg-black text-white px-12 pt-14 pb-18 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border border-white/[0.05]" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-white/[0.04]" />

        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[11px] tracking-[.1em] uppercase text-white/50 font-medium">
            Billing &amp; Refund
          </span>
        </div>

        <h1
          className="text-4xl lg:text-5xl font-medium leading-[1.08] max-w-lg mb-4"
          style={{ letterSpacing: "-1.5px" }}
        >
          Free trial,{" "}
          <span className="text-white/30">zero strings attached.</span>
        </h1>

        <p className="text-[14px] text-white/45 leading-relaxed max-w-md">
          Everything you need to know about BizEzy's current billing policy and
          your 2-month free access.
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
            Currently free
          </div>
        </div>

        {/* Numbered prose items */}
        <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200 mb-7">
          {items.map((content, i) => (
            <div key={i} className="flex items-start gap-5 px-7 py-6 bg-white">
              <div className="w-7 h-7 rounded-lg bg-black text-white text-[12px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[14px] text-zinc-500 leading-[1.75]">{content}</p>
            </div>
          ))}
        </div>

        {/* Highlight box */}
        <div className="border border-zinc-200 rounded-2xl px-7 py-6 bg-white mb-7 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h4 className="text-[14px] font-medium text-zinc-900 mb-1.5">
              When does my free access start?
            </h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed">
              Your 2-month free access begins automatically from the date of
              account registration. No credit card or payment details are
              required to get started.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-zinc-200 rounded-2xl px-7 py-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-[15px] font-medium text-zinc-900 mb-1.5">
              Have a question about billing?
            </h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-sm">
              Our team is happy to clarify anything about this policy. We
              usually respond within 24–48 hours.
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

export default RefundPolicy;