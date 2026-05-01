import React from "react";
import { Shield, Mail, Lock, Eye, FileText, CheckCircle } from "lucide-react";

const Privacy = () => {
  const policySections = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Information We Collect",
      description:
        "When you join our waitlist or contact us, we may collect your email address and basic contact information to provide you with the best service experience.",
      details: [
        "Email address and contact details",
        "Usage data and preferences",
        "Communication history",
      ],
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "How We Use Your Information",
      description:
        "Your information helps us improve our services and keep you informed about important updates and opportunities.",
      details: [
        "Product updates and feature announcements",
        "Early access opportunities",
        "Service improvements and personalization",
        "Customer support responses",
      ],
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Data Protection & Security",
      description:
        "We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure.",
      details: [
        "256-bit encryption for data transmission",
        "Regular security audits",
        "Strict access controls",
        "No third-party data selling",
      ],
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Your Privacy Rights",
      description:
        "You have full control over your personal information and can exercise your privacy rights at any time.",
      details: [
        "Access and review your data",
        "Request data deletion",
        "Opt-out of communications",
        "Data portability",
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-sans">
      {/* ── Hero ── */}
      <div className="relative bg-black text-white px-12 pt-16 pb-20 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-white/[0.04]" />

        {/* Chip */}
        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[11px] tracking-[.1em] uppercase text-white/60 font-medium">
            Privacy &amp; Security
          </span>
        </div>

        <h1
          className="text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight max-w-lg mb-5"
          style={{ letterSpacing: "-1.5px" }}
        >
          Your privacy is{" "}
          <span className="text-white/35">our top priority.</span>
        </h1>

        <p className="text-[15px] text-white/50 leading-relaxed max-w-md">
          We're committed to protecting your personal information and being
          fully transparent about how it's used.
        </p>

        <div className="mt-10 h-px bg-white/10" />
      </div>

      {/* ── Body ── */}
      <div className="px-12 py-12">
        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
          <div className="inline-flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-1.5 text-[12px] font-medium text-zinc-500">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            Last updated: March 11, 2026
          </div>
          <div className="inline-flex items-center gap-1.5 bg-black text-white rounded-full px-4 py-1.5 text-[12px] font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            GDPR compliant
          </div>
        </div>

        {/* Intro card */}
        <div className="border border-zinc-200 rounded-2xl p-8 mb-10">
          <div className="flex items-start gap-5">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-zinc-900 mb-2">
                Our commitment to privacy
              </h2>
              <p className="text-[14px] text-zinc-500 leading-relaxed">
                At BizEzy, we believe that privacy is a fundamental right. This
                policy outlines how we collect, use, and protect your
                information. We've designed our practices to be transparent and
                give you full control over your data at all times.
              </p>
            </div>
          </div>
        </div>

        {/* Policy sections — flush grid with 1px separators */}
        <div className="grid md:grid-cols-2 border border-zinc-200 rounded-2xl overflow-hidden divide-x divide-y divide-zinc-200 mb-10">
          {policySections.map((section, index) => (
            <div key={index} className="p-7 bg-white">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-9 h-9 border border-zinc-200 rounded-lg flex items-center justify-center flex-shrink-0 text-zinc-800">
                  {section.icon}
                </div>
                <h3 className="text-[15px] font-medium text-zinc-900 mt-1.5 leading-snug">
                  {section.title}
                </h3>
              </div>

              <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
                {section.description}
              </p>

              <ul className="space-y-2">
                {section.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] text-zinc-500"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-900"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="border border-zinc-200 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-[16px] font-medium text-zinc-900 mb-1.5">
              Questions about your privacy?
            </h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-md">
              If you have any concerns about how we handle your data, our
              privacy team is ready to help. We typically respond within 24–48
              hours.
            </p>
          </div>
          <a
            href="mailto:bizezyapp@gmail.com"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-[13px] font-medium whitespace-nowrap hover:bg-zinc-800 transition-colors"
          >
            <Mail className="w-4 h-4 opacity-50" />
            bizezystartup@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
