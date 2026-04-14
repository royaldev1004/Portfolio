import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapAboutStatRow, mapProjectRow, resolveRecentWorkProjects, settingsToObject } from "@/lib/experience-mappers";
import { useProfile } from "@/lib/useProfile";
import { FALLBACK_PROJECTS } from "@/data/portfolio-projects-fallback";
import { ABOUT_SITE_SETTINGS_FALLBACK, ABOUT_STATS_FALLBACK } from "@/data/about-site-settings-fallback";

function IntroParagraph({ template, name }) {
  const text = (template ?? "").trim() || ABOUT_SITE_SETTINGS_FALLBACK.about_intro;
  const parts = text.split("{name}");
  return (
    <p className="text-base md:text-lg text-foreground/95 leading-relaxed">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 ? <span className="font-semibold text-primary">{name}</span> : null}
        </React.Fragment>
      ))}
    </p>
  );
}

export default function AboutSection() {
  const { name, location, workImageUrl } = useProfile();
  const useDb = isSupabaseConfigured();

  const { data: dbStats, isError: statsErr, isLoading: statsLoading } = useQuery({
    queryKey: ["portfolio", "about", "stats"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("about_stats").select("*").order("sort_order");
      if (error) throw error;
      return (data || []).map(mapAboutStatRow);
    },
  });

  const { data: dbSettings, isError: settingsErr, isLoading: settingsLoading } = useQuery({
    queryKey: ["site-settings"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const { data: dbProjects, isError: projectsErr, isLoading: projectsLoading } = useQuery({
    queryKey: ["portfolio", "projects"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });

  const waitingForDb = useDb && (statsLoading || settingsLoading || projectsLoading);
  const stats = useDb
    ? (statsLoading ? [] : (!statsErr && dbStats?.length ? dbStats : ABOUT_STATS_FALLBACK))
    : ABOUT_STATS_FALLBACK;
  const settings = useMemo(() => {
    if (useDb && settingsLoading) return { ...ABOUT_SITE_SETTINGS_FALLBACK };
    if (!useDb || settingsErr || !dbSettings) return { ...ABOUT_SITE_SETTINGS_FALLBACK };
    return { ...ABOUT_SITE_SETTINGS_FALLBACK, ...dbSettings };
  }, [useDb, settingsLoading, settingsErr, dbSettings]);

  const bio1 = settings?.about_bio_1 || ABOUT_SITE_SETTINGS_FALLBACK.about_bio_1;
  const bio2 = settings?.about_bio_2 || ABOUT_SITE_SETTINGS_FALLBACK.about_bio_2;
  const bio3 = settings?.about_bio_3 || ABOUT_SITE_SETTINGS_FALLBACK.about_bio_3;
  const available = (settings?.about_available || ABOUT_SITE_SETTINGS_FALLBACK.about_available) !== "false";
  const availableText = settings?.about_available_text || ABOUT_SITE_SETTINGS_FALLBACK.about_available_text;
  const availableSub = settings?.about_available_sub || ABOUT_SITE_SETTINGS_FALLBACK.about_available_sub;

  const projects = useDb
    ? (projectsLoading ? [] : (!projectsErr && dbProjects?.length ? dbProjects : FALLBACK_PROJECTS))
    : FALLBACK_PROJECTS;
  const recentWorkProjects = useMemo(
    () => resolveRecentWorkProjects(projects, settings?.about_recent_work_project_ids),
    [projects, settings?.about_recent_work_project_ids],
  );

  return (
    <section id="about" className="py-24 md:py-32 px-[7.5vw] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="relative">
        <span className="absolute -top-8 left-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          ABOUT
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-14 flex flex-wrap items-center gap-4"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-primary">{settings.about_section_number}</span>
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              {settings.about_section_title}
            </span>
          </h2>
          <div className="hidden sm:block h-px flex-1 min-w-[4rem] bg-gradient-to-r from-border via-border/50 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5"
          >
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[340px] md:h-[420px] rounded-xl overflow-hidden mx-auto bg-card border border-border/50 shadow-lg shadow-primary/5">
              <img src={workImageUrl} alt={`${name} — ${location}`} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 p-4 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full bg-primary ${available ? "animate-pulse" : "opacity-30"}`} />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">{availableText}</p>
                <p className="font-mono-caption text-muted-foreground mt-0.5">{availableSub}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 max-w-[340px] mx-auto md:mx-0 md:max-w-none">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.06 }}
                  className="text-center md:text-left"
                >
                  <p className="font-heading font-semibold text-xl md:text-2xl text-foreground">{stat.value}</p>
                  <p className="font-mono-caption uppercase text-muted-foreground mt-1 text-[10px] md:text-xs leading-snug">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-7"
          >
            <div className="relative rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md shadow-xl shadow-primary/10 overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-cyan-400/90 to-violet-500/90 pointer-events-none"
                aria-hidden
              />
              <div className="p-6 md:p-8 pt-8 md:pt-9 space-y-5">
                <IntroParagraph template={settings.about_intro} name={name} />
                <p className="text-muted-foreground leading-relaxed">{bio1}</p>
                <p className="text-muted-foreground leading-relaxed">{bio2}</p>
                <p className="text-muted-foreground leading-relaxed">{bio3}</p>

                <div className="relative flex items-center gap-4 pt-2">
                  <div className="h-px flex-1 bg-border/80" />
                  <span className="font-mono-caption uppercase text-primary tracking-widest shrink-0">
                    {settings.about_recent_work_label}
                  </span>
                  <div className="h-px flex-1 bg-border/80" />
                </div>

                {waitingForDb ? (
                  <p className="text-muted-foreground text-sm pt-1">Loading recent work...</p>
                ) : (
                  <ul className="space-y-4 pt-1">
                  {recentWorkProjects.map((project) => (
                    <li
                      key={project.id}
                      className="rounded-xl border border-border/60 bg-background/40 p-4 transition-colors hover:border-primary/30"
                    >
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-4 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <Briefcase className="w-4 h-4 text-primary" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading font-semibold text-primary group-hover:underline underline-offset-2">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{project.description}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-primary" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading font-semibold text-primary">{project.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{project.description}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                  </ul>
                )}

                <p className="text-sm text-muted-foreground pt-1">
                  <button
                    type="button"
                    onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-primary font-medium hover:underline underline-offset-4"
                  >
                    View all projects
                  </button>{" "}
                  in the work section below.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
