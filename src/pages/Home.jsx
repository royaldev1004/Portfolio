import React from "react";
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
    </div>
  );
}