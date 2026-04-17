import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProcessStepRow } from "@/lib/experience-mappers";
import {
  Compass, Layers, TrendingUp, Globe, Bot, Cpu, Zap, Code2, Database,
  Smartphone, Settings, Award, Star, Briefcase, BookOpen, BarChart,
  Lightbulb, Shield, Terminal, Rocket,
} from "lucide-react";

const ICON_MAP = {
  Compass, Layers, TrendingUp, Globe, Bot, Cpu, Zap, Code2, Database,
  Smartphone, Settings, Award, Star, Briefcase, BookOpen, BarChart,
  Lightbulb, Shield, Terminal, Rocket,
};

const FALLBACK = [
  {
    id: "1",
    number: "01",
    iconName: "Compass",
    title: "Discover & align",
    subtitle: "Phase 1 · Scope & risk",
    description:
      "We turn a rough idea into a bounded engagement: problem statement, users, constraints, integrations, and security boundaries. You leave with written scope, success criteria, and a delivery plan—so build work is forecastable, not open-ended.",
    details: [
      "Stakeholder interviews & requirements",
      "Architecture / stack fit & estimates",
      "Definition of done & milestone plan",
    ],
  },
  {
    id: "2",
    number: "02",
    iconName: "Layers",
    title: "Build & validate",
    subtitle: "Phase 2 · Delivery",
    description:
      "Work ships in short cycles with something demoable early. I favor thin vertical slices: real data paths, real automation, real UI where it matters—then harden, document, and hand off artifacts your team can run without me.",
    details: [
      "Iterative releases & review checkpoints",
      "AI / automation / app layers as one system",
      "Docs, runbooks, and ownership transfer",
    ],
  },
  {
    id: "3",
    number: "03",
    iconName: "TrendingUp",
    title: "Operate & evolve",
    subtitle: "Phase 3 · After launch",
    description:
      "Launch is the start of reliability work: monitoring what breaks in the wild, tightening prompts and workflows, and prioritizing changes by impact. Engagements can stay light-touch or ongoing—aligned to how critical the system is to your business.",
    details: [
      "Incident response & edge-case fixes",
      "Usage signals & improvement backlog",
      "Roadmap for the next iteration",
    ],
  },
];

export default function ProcessSection() {
  const useDb = isSupabaseConfigured();
  const { data: dbSteps, isError, isLoading } = useQuery({
    queryKey: ["portfolio", "process"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("process_steps").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProcessStepRow);
    },
  });

  const pillars = useDb
    ? (isLoading ? [] : (!isError && dbSteps?.length ? dbSteps : FALLBACK))
    : FALLBACK;

  return (
    <section id="process" className="py-24 md:py-32 px-[7.5vw] bg-card relative overflow-hidden" aria-labelledby="process-heading">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="w-full h-[0.5px] bg-border -mt-24 md:-mt-32 mb-24 md:mb-32" />
      <div className="relative">
        <span
          className="absolute -top-8 right-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none"
          aria-hidden
        >
          PHASES
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">Engagement model</p>
          <h2 id="process-heading" className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-foreground">
            <span className="font-semibold bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Delivery you can{" "} plan around
            </span>
          </h2>
          <p className="mt-5 text-muted-foreground font-medium leading-relaxed text-base md:text-lg">
            Engagements are organized in three phases—scope, build, and post-launch—with tangible outputs at each step.
            That sits alongside the work gallery: there you see what shipped; here you see how delivery is structured
            so timelines and expectations stay clear.
          </p>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-6" />
        </motion.div>

        {useDb && isLoading ? (
          <div className="text-muted-foreground text-sm py-4">Loading process steps...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = ICON_MAP[pillar.iconName] || Compass;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="group relative p-8 md:p-10 rounded-2xl border border-border/80 bg-card/90 hover:border-primary/35 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f2342]/92 dark:via-[#0a1628]/92 dark:to-[#06101e]/96 dark:hover:border-cyan-300/30 dark:hover:shadow-cyan-900/20 flex flex-col h-full overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-3xl pointer-events-none dark:bg-cyan-400/5" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none dark:bg-violet-500/5" />

                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 dark:bg-cyan-400/10 dark:border-cyan-300/25">
                      <Icon className="w-5 h-5 text-primary dark:text-cyan-300" aria-hidden />
                    </div>
                    <span className="font-mono-caption text-primary/70 dark:text-cyan-200/70 text-lg tabular-nums tracking-wider">{pillar.number}</span>
                  </div>
                  <p className="font-mono-caption text-primary dark:text-cyan-300 mb-2">{pillar.subtitle}</p>
                  <h3 className="font-heading font-black text-2xl text-foreground mb-4 dark:text-slate-100">{pillar.title}</h3>
                  <p className="text-muted-foreground dark:text-slate-300/95 font-medium leading-relaxed mb-6 text-sm md:text-base flex-1">
                    {pillar.description}
                  </p>
                  <div>
                    <p className="font-mono-caption uppercase text-amber-500 dark:text-amber-300/85 mb-3 tracking-wider text-[11px]">
                      Outcomes
                    </p>
                    <ul className="space-y-2.5">
                      {pillar.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2.5">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,211,238,0.45)] shrink-0 dark:bg-cyan-300 dark:shadow-[0_0_8px_rgba(34,211,238,0.6)]" aria-hidden />
                          <span className="text-sm text-foreground/90 dark:text-slate-200/95 leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 md:mt-16 pt-10 border-t border-border/60"
        >
          <p className="text-center text-sm md:text-base text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Need a different shape—fixed sprint, audit-only, or staff-augmentation? Say so in{" "}
            <button
              type="button"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-foreground font-semibold underline underline-offset-4 decoration-primary/50 hover:decoration-primary hover:text-primary transition-colors"
            >
              contact
            </button>
            {" "}and we&apos;ll align the model in discovery.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
