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
    id: "1", number: "01", iconName: "Compass", title: "Understand", subtitle: "How I start",
    description: "I start by clarifying the problem, constraints, and who it's for. I ask questions, map your stack, and agree on what \u201cdone\u201d looks like before I build anything.",
    details: ["Discovery & scope", "Stack & integrations", "Success criteria"],
  },
  {
    id: "2", number: "02", iconName: "Layers", title: "Build", subtitle: "How I ship",
    description: "I implement in tight loops: working software first, then polish. Whether it's AI, automation, or a UI, I keep you in the loop so we're never guessing.",
    details: ["Iterative delivery", "No-Code / code where it fits", "Handoff you can own"],
  },
  {
    id: "3", number: "03", iconName: "TrendingUp", title: "Improve", subtitle: "How I stick around",
    description: "I care about what happens after launch. I monitor flows, fix edge cases, and tune automations so the system keeps delivering value — not just on day one.",
    details: ["Monitoring & fixes", "Metrics that matter", "Ongoing optimization"],
  },
];

export default function ProcessSection() {
  const { data: dbSteps, isError } = useQuery({
    queryKey: ["portfolio", "process"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("process_steps").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProcessStepRow);
    },
  });

  const pillars = isSupabaseConfigured() && !isError && dbSteps?.length ? dbSteps : FALLBACK;

  return (
    <section id="process" className="py-24 md:py-32 px-[7.5vw] bg-card">
      <div className="w-full h-[0.5px] bg-border -mt-24 md:-mt-32 mb-24 md:mb-32" />
      <div className="relative">
        <span className="absolute -top-8 right-0 font-heading font-light text-[12vw] md:text-[8vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none">
          HOW
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">My process</p>
          <h2 className="font-heading font-light text-3xl md:text-5xl tracking-tight text-foreground">
            How I run <span className="font-semibold">a project</span>
          </h2>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = ICON_MAP[pillar.iconName] || Compass;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative p-8 md:p-10 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-mono-caption text-muted-foreground/50 text-lg">{pillar.number}</span>
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-1">{pillar.title}</h3>
                <p className="font-mono-caption uppercase text-primary mb-4">{pillar.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{pillar.description}</p>
                <div className="space-y-2">
                  {pillar.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="font-mono-caption text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
