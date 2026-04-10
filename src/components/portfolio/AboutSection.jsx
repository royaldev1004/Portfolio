import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapAboutStatRow, settingsToObject } from "@/lib/experience-mappers";
import { useProfile } from "@/lib/useProfile";

const FALLBACK_STATS = [
  { value: "8+", label: "Years Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Clients Worldwide" },
  { value: "4", label: "Core Specializations" },
];

const FALLBACK_SETTINGS = {
  about_bio_1: `I'm a Senior Software Engineer with 8+ years of experience in AI development, intelligent automation, and No-Code/Low-Code platforms. I bridge the gap between complex technical systems and rapid, practical delivery.`,
  about_bio_2: `My core focus is building AI-powered solutions — from voice agents and CRM automations to full-stack web and mobile applications. I work with platforms like Lovable, Webflow, Base44, and Famous.ai to ship production-ready products at speed, without sacrificing quality.`,
  about_bio_3: `On the automation side, I architect end-to-end workflows using n8n and Make.com, integrate CRM ecosystems with GoHighLevel (GHL), and build intelligent AI Voice Agents with Retell, Vapi, and ElevenLabs. Every system I build is designed to operate autonomously, scale effortlessly, and deliver measurable impact.`,
  about_available: "true",
  about_available_text: "I'm taking new work",
  about_available_sub: "Freelance & consulting",
};

export default function AboutSection() {
  const { name, location, workImageUrl } = useProfile();

  const { data: dbStats, isError: statsErr } = useQuery({
    queryKey: ["portfolio", "about", "stats"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("about_stats").select("*").order("sort_order");
      if (error) throw error;
      return (data || []).map(mapAboutStatRow);
    },
  });

  const { data: dbSettings, isError: settingsErr } = useQuery({
    queryKey: ["portfolio", "about", "settings"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const useDb = isSupabaseConfigured();
  const stats = useDb && !statsErr && dbStats?.length ? dbStats : FALLBACK_STATS;
  const settings = (useDb && !settingsErr && dbSettings) ? dbSettings : FALLBACK_SETTINGS;

  const bio1 = settings.about_bio_1 ?? FALLBACK_SETTINGS.about_bio_1;
  const bio2 = settings.about_bio_2 ?? FALLBACK_SETTINGS.about_bio_2;
  const bio3 = settings.about_bio_3 ?? FALLBACK_SETTINGS.about_bio_3;
  const available = settings.about_available !== "false";
  const availableText = settings.about_available_text ?? FALLBACK_SETTINGS.about_available_text;
  const availableSub = settings.about_available_sub ?? FALLBACK_SETTINGS.about_available_sub;

  return (
    <section id="about" className="py-24 md:py-32 px-[7.5vw]">
      <div className="relative">
        <span className="absolute -top-8 left-0 font-heading font-light text-[12vw] md:text-[8vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none">
          ABOUT
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">About me</p>
          <h2 className="font-heading font-light text-3xl md:text-5xl tracking-tight text-foreground">
            How I work &amp; <span className="font-semibold">what I care about</span>
          </h2>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5"
          >
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] rounded-xl overflow-hidden mx-auto bg-card border border-border/50">
              <img src={workImageUrl} alt={`${name} — ${location}`} className="w-full h-full" />
            </div>
            <div className="mt-4 p-4 rounded-xl border border-border/60 bg-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full bg-primary ${available ? "animate-pulse" : "opacity-30"}`} />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">{availableText}</p>
                <p className="font-mono-caption text-muted-foreground mt-0.5">{availableSub}</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-7"
          >
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-5">
              I'm <span className="font-semibold">{name}</span>, a Senior Software Engineer from{" "}
              <span className="font-semibold">{location}</span>.{" "}
              {bio1.replace(/^I'm a Senior/, "").replace(/^I'm .*?,\s*/, "")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">{bio2}</p>
            <p className="text-muted-foreground leading-relaxed mb-10">{bio3}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center md:text-left"
                >
                  <p className="font-heading font-semibold text-2xl md:text-3xl text-foreground">{stat.value}</p>
                  <p className="font-mono-caption uppercase text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
