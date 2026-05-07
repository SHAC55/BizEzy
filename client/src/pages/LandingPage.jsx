import React from "react";
import LandingHeader from "../components/LandingHeader";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

const LandingPage = () => {
  return (
    <div className="min-w-[375px] w-screen scroll-smooth">
      <LandingHeader />

      {/* Hero */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Features */}
      <section id="features">
        <Features />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Pricing */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* CTA */}
      <section id="cta">
        <CTA />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;