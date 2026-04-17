import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import WorkGallery from "../components/portfolio/WorkGallery";
import ProcessSection from "../components/portfolio/ProcessSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import TestimonialsSection from "../components/portfolio/TestimonialsSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import CertificationsSection from "../components/portfolio/CertificationsSection";
import ContactSection from "../components/portfolio/ContactSection";
import Footer from "../components/portfolio/Footer";

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <WorkGallery />
        <ProcessSection />
        <AboutSection />
        <SkillsSection />
        <TestimonialsSection />
        <ExperienceSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-xl border border-primary/40 bg-card/95 text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/70 hover:text-primary"
        >
          <ChevronUp className="mx-auto h-5 w-5" />
        </button>
      )}
    </div>
  );
}