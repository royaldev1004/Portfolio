import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProjectRow } from "@/lib/experience-mappers";
import { FALLBACK_PROJECTS } from "@/data/portfolio-projects-fallback";

export { FALLBACK_PROJECTS };

export default function WorkGallery() {
  const useDb = isSupabaseConfigured();
  const { data: dbProjects, isError, isLoading } = useQuery({
    queryKey: ["portfolio", "projects"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });

  const projects = useDb
    ? (isLoading ? [] : (!isError && dbProjects?.length ? dbProjects : FALLBACK_PROJECTS))
    : FALLBACK_PROJECTS;
  const notableProjects = projects.filter((p) => p.tier === "notable");
  const noteworthyProjects = projects.filter((p) => p.tier !== "notable");

  return (
    <section id="work" className="py-24 md:py-32 px-[7.5vw] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="relative mb-14 md:mb-16">
        <span className="absolute -top-12 left-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          WORK
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <p className="font-heading font-bold text-2xl md:text-4xl tracking-tight text-foreground">
              My <span className="text-primary">Notable</span> Projects
            </p>
            <div className="hidden md:block h-[0.5px] flex-1 bg-primary/30" />
          </div>
        </motion.div>
      </div>

      <div className="space-y-16">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {useDb && isLoading ? (
              <p className="text-muted-foreground text-sm py-4">Loading projects...</p>
            ) : (
              notableProjects.map((project, index) => (
                <div key={project.id} className="lg:col-span-12">
                  <ProjectCard project={project} index={index} variant="notable" featured />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2 text-center">
            Other <span className="text-primary">Noteworthy</span> Projects
          </h3>
          <p className="text-muted-foreground mb-6 text-center">
            Additional work that demonstrates breadth across domains and delivery styles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {!useDb || !isLoading ? (
              noteworthyProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} variant="noteworthy" />
              ))
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
