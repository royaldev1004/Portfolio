import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapSkillGroupRow } from "@/lib/experience-mappers";
import { COLOR_THEME } from "@/pages/admin/shared/AdminComponents";
import {
  Bot, Zap, Code2, Smartphone, Globe, Database, Cpu, Settings,
  Compass, Layers, TrendingUp, Award, Star, Briefcase, BookOpen,
  BarChart, Lightbulb, Shield, Terminal, Rocket,
} from "lucide-react";

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
  const [activeGroup, setActiveGroup] = useState(null);
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

  const groups = useDb
    ? (isLoading ? [] : (!isError && dbGroups?.length ? dbGroups : FALLBACK_GROUPS))
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {groups.map((group, index) => {
              const Icon = ICON_MAP[group.iconName] || Globe;
              const theme = COLOR_THEME[group.colorKey] || COLOR_THEME.blue;
              const isActive = activeGroup === group.id;
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  onMouseEnter={() => setActiveGroup(group.id)}
                  onMouseLeave={() => setActiveGroup(null)}
                  className="relative p-6 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-all duration-400 hover:shadow-lg hover:shadow-primary/5 cursor-default overflow-hidden"
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
                      <span key={skill} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-mono-caption text-xs border border-border/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
                </motion.div>
              );
            })}
          </div>
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
