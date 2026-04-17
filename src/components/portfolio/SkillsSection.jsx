import React, { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapSkillGroupRow } from "@/lib/experience-mappers";
import { COLOR_THEME } from "@/pages/admin/shared/AdminComponents";
import { ChevronLeft, ChevronRight,
  Bot, Zap, Code2, Smartphone, Globe, Database, Cpu, Settings,
  Compass, Layers, TrendingUp, Award, Star, Briefcase, BookOpen,
  BarChart, Lightbulb, Shield, Terminal, Rocket,
} from "lucide-react";

const CARD_W = 300;
const CARD_H = 380;
const STEP  = 140;

function SkillCarousel({ groups }) {
  // Default to 5th card (index 4); clamp if fewer than 5 groups
  const [active, setActive] = useState(() =>
    Math.min(4, Math.max(0, groups.length - 1))
  );
  const pointerX = useRef(null);

  const clamp = (v) => Math.max(0, Math.min(groups.length - 1, v));
  const goTo  = (i) => setActive(clamp(i));

  return (
    <div className="relative w-full select-none">
      {/* Prev */}
      <button
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        className="absolute left-0 z-30 top-[44%] -translate-y-1/2 w-10 h-10 rounded-full border border-border/60 bg-card/90 backdrop-blur-sm flex items-center justify-center shadow transition hover:border-primary/50 hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next */}
      <button
        onClick={() => goTo(active + 1)}
        disabled={active === groups.length - 1}
        className="absolute right-0 z-30 top-[44%] -translate-y-1/2 w-10 h-10 rounded-full border border-border/60 bg-card/90 backdrop-blur-sm flex items-center justify-center shadow transition hover:border-primary/50 hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Track — overflow-hidden clips far cards; absolute cards spread from center */}
      <div
        className="relative mx-8 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: CARD_H + 40 }}
        onPointerDown={(e) => { pointerX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (pointerX.current === null) return;
          const delta = pointerX.current - e.clientX;
          if (Math.abs(delta) > 40) goTo(active + (delta > 0 ? 1 : -1));
          pointerX.current = null;
        }}
        onPointerLeave={() => { pointerX.current = null; }}
      >
        {/* Left fade mask — softer in light theme */}
        <div className="absolute inset-y-0 left-0 w-24 z-[25] pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent dark:from-card dark:via-card/70" />
        {/* Right fade mask */}
        <div className="absolute inset-y-0 right-0 w-24 z-[25] pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent dark:from-card dark:via-card/70" />

        {groups.map((group, index) => {
          const Icon     = ICON_MAP[group.iconName] || Globe;
          const theme    = COLOR_THEME[group.colorKey] || COLOR_THEME.blue;
          const dist     = index - active;          // signed offset
          const absDist  = Math.abs(dist);
          const opacity  = absDist === 0 ? 1 : absDist === 1 ? 0.82 : absDist === 2 ? 0.62 : absDist === 3 ? 0.42 : 0;
          const scale    = absDist === 0 ? 1 : absDist === 1 ? 0.94 : absDist === 2 ? 0.88 : 0.82;
          const zIndex   = 20 - absDist;

          return (
            <motion.div
              key={group.id}
              animate={{
                x: dist * STEP - CARD_W / 2,
                opacity,
                scale,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              style={{
                position : "absolute",
                left     : "50%",
                top      : 16,
                width    : CARD_W,
                height   : CARD_H,
                zIndex,            // static — applied immediately, no transition delay
              }}
              onClick={() => absDist > 0 && goTo(index)}
              className={`p-6 rounded-xl border bg-background overflow-hidden transition-colors duration-300
                ${absDist === 0
                  ? "border-primary/35 shadow-xl shadow-primary/15"
                  : "border-border/70 bg-card/90 cursor-pointer hover:border-primary/30"}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl ${theme.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${theme.color}`} />
                </div>
                <span className="font-mono-caption text-muted-foreground/40 text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-base text-foreground mb-0.5">{group.label}</h3>
              <p className={`font-mono-caption uppercase text-xs mb-4 ${theme.color}`}>{group.caption}</p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground font-mono-caption text-xs border border-border/70">
                    {skill}
                  </span>
                ))}
              </div>
              {absDist === 0 && (
                <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {groups.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const ICON_MAP = {
  Globe, Bot, Cpu, Zap, Code2, Database, Smartphone, Settings,
  Compass, Layers, TrendingUp, Award, Star, Briefcase, BookOpen,
  BarChart, Lightbulb, Shield, Terminal, Rocket,
};

const FALLBACK_GROUPS = [
  { id: "nocode",     iconName: "Globe",    colorKey: "sky",     label: "No-Code / Low-Code",  caption: "Visual Dev Platforms",     skills: ["Base44","Lovable","Webflow","Famous.ai","Bubble","Framer","Softr"] },
  { id: "ai",         iconName: "Bot",      colorKey: "violet",  label: "AI Development",       caption: "Models & Deployment",      skills: ["OpenAI API","LangChain","RAG Systems","Vector DBs","Prompt Engineering","Fine-Tuning","Claude API"] },
  { id: "voice",      iconName: "Cpu",      colorKey: "emerald", label: "AI Voice Agents",      caption: "Conversational AI",        skills: ["Retell AI","Vapi","ElevenLabs","Deepgram","Twilio","Whisper"] },
  { id: "automation", iconName: "Zap",      colorKey: "amber",   label: "AI Automation",        caption: "Workflow Engineering",     skills: ["n8n","Make.com","Zapier","GoHighLevel (GHL)","CRM Integrations","Webhook Architecture","API Orchestration"] },
  { id: "frontend",   iconName: "Code2",    colorKey: "blue",    label: "Frontend",             caption: "Web Interfaces",           skills: ["React","Next.js","TypeScript","Tailwind CSS","Framer Motion","Vite","HTML / CSS"] },
  { id: "backend",    iconName: "Database", colorKey: "rose",    label: "Backend",              caption: "Server & APIs",            skills: ["Node.js","Python","REST APIs","GraphQL","Supabase","Firebase","PostgreSQL"] },
  { id: "mobile",     iconName: "Smartphone",colorKey:"teal",    label: "Mobile",               caption: "Cross-Platform Apps",      skills: ["React Native","Expo","iOS & Android","Push Notifications","App Store Deployment"] },
  { id: "devops",     iconName: "Settings", colorKey: "orange",  label: "DevOps & Tools",       caption: "Infrastructure",           skills: ["Vercel","Railway","Docker","GitHub Actions","CI/CD","Cloudflare","AWS (S3, Lambda)"] },
];

export default function SkillsSection() {
  const useDb = isSupabaseConfigured();

  const { data: dbGroups, isError, isLoading } = useQuery({
    queryKey: ["portfolio", "skills"],
    enabled: useDb,
    queryFn: async () => {
      const { data: groupRows, error: gErr } = await supabase.from("skill_groups").select("*").order("sort_order");
      if (gErr) throw gErr;
      const { data: skillRows, error: sErr } = await supabase.from("skills").select("*").order("sort_order");
      if (sErr) throw sErr;
      return (groupRows || []).map((g) => {
        const mine = (skillRows || []).filter((s) => s.group_id === g.id);
        return mapSkillGroupRow(g, mine);
      });
    },
  });

  const visibleGroups = useMemo(
    () => (dbGroups || []).filter((g) => g.visible !== false),
    [dbGroups]
  );

  const groups = useDb
    ? (isLoading
        ? []
        : !isError && dbGroups != null
          ? (dbGroups.length > 0 ? visibleGroups : FALLBACK_GROUPS)
          : FALLBACK_GROUPS)
    : FALLBACK_GROUPS;

  return (
    <section id="skills" className="py-24 md:py-32 px-[7.5vw] bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="w-full h-[0.5px] bg-border -mt-24 md:-mt-32 mb-24 md:mb-32" />
      <div className="relative">
        <span className="absolute -top-8 right-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          SKILLS
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">What I use</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-foreground">
            <span className="font-semibold bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            My stack &amp;{" "} tooling
            </span>
          </h2>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
        </motion.div>

        {useDb && isLoading ? (
          <div className="text-muted-foreground text-sm py-4">Loading skills...</div>
        ) : (
          <>
            {useDb && !isLoading && !isError && dbGroups?.length > 0 && visibleGroups.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 mb-2">All skill groups are hidden from the portfolio.</p>
            )}
            <SkillCarousel groups={groups} />
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-8 rounded-xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Need a custom AI solution or automation system?</h3>
            <p className="text-muted-foreground mt-1 text-sm">From voice agents to full-stack apps — I deliver end-to-end, production-ready systems.</p>
          </div>
          <button onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="shrink-0 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            Start a Project
          </button>
        </motion.div>
      </div>
    </section>
  );
}
