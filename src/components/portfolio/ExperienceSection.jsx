import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapWorkRow, mapEducationRow } from "@/lib/experience-mappers";
import { FALLBACK_WORK, FALLBACK_EDUCATION } from "@/data/experience-fallback";

function TimelineItem({ item, isLast, type }) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10">
          {type === "work"
            ? <Briefcase className="w-4 h-4 text-primary" />
            : <GraduationCap className="w-4 h-4 text-primary" />
          }
        </div>
        {!isLast && <div className="w-[0.5px] flex-1 bg-border mt-2" />}
      </div>

      <div className={`pb-10 flex-1 ${isLast ? "" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h3 className="font-heading font-semibold text-base text-foreground">
            {type === "work" ? item.role : item.degree}
          </h3>
          <span className="font-mono-caption text-muted-foreground shrink-0">{item.period}</span>
        </div>
        <p className={`font-mono-caption uppercase mb-3 ${type === "work" ? "text-primary" : "text-emerald-500"}`}>
          {type === "work" ? item.company : item.institution}
          {type === "work" && <span className="ml-2 text-muted-foreground normal-case">· {item.type}</span>}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.description}</p>
        {item.highlights && item.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.highlights.map((h) => (
              <span key={h} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-mono-caption text-xs border border-border/50">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const [tab, setTab] = useState("work");

  const { data: workRows, isLoading: loadingWork, isError: workErr } = useQuery({
    queryKey: ["portfolio", "work_experience"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("work_experience").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapWorkRow);
    },
  });

  const { data: eduRows, isLoading: loadingEdu, isError: eduErr } = useQuery({
    queryKey: ["portfolio", "education"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapEducationRow);
    },
  });

  const useDb = isSupabaseConfigured();
  const employment = useDb ? (workErr ? FALLBACK_WORK : (workRows ?? [])) : FALLBACK_WORK;
  const education = useDb ? (eduErr ? FALLBACK_EDUCATION : (eduRows ?? [])) : FALLBACK_EDUCATION;
  const loading = useDb && (tab === "work" ? loadingWork : loadingEdu);

  return (
    <section id="experience" className="py-24 md:py-32 px-[7.5vw] bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="w-full h-[0.5px] bg-border -mt-24 md:-mt-32 mb-24 md:mb-32" />

      <div className="relative">
        <span className="absolute -top-8 right-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          HISTORY
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">
              Background
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-foreground">
              Experience &amp; <span className="font-semibold">Education</span>
            </h2>
            <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
          </div>

          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary border border-border/50">
            <button
              type="button"
              onClick={() => setTab("work")}
              className={`px-5 py-2 rounded-full font-mono-caption uppercase text-xs transition-all duration-300 ${
                tab === "work"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Employment
            </button>
            <button
              type="button"
              onClick={() => setTab("edu")}
              className={`px-5 py-2 rounded-full font-mono-caption uppercase text-xs transition-all duration-300 ${
                tab === "edu"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Education
            </button>
          </div>
        </motion.div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          {loading ? (
            <div className="flex items-center gap-3 text-muted-foreground py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : tab === "work" ? (
            employment.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No work experience entries yet. Add them in the admin panel.</p>
            ) : (
              employment.map((item, i) => (
                <TimelineItem
                  key={item.id ?? `work-${i}`}
                  item={item}
                  isLast={i === employment.length - 1}
                  type="work"
                />
              ))
            )
          ) : education.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No education entries yet. Add them in the admin panel.</p>
          ) : (
            education.map((item, i) => (
              <TimelineItem
                key={item.id ?? `edu-${i}`}
                item={item}
                isLast={i === education.length - 1}
                type="edu"
              />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}

