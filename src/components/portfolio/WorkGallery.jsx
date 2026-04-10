import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProjectRow } from "@/lib/experience-mappers";

const FALLBACK_PROJECTS = [
  {
    id: "1", title: "Horizon Platform", category: "Brand & product", role: "I led design",
    description: "I led the end-to-end brand and product visuals for a fintech platform serving 2M+ users.",
    image: "https://media.base44.com/images/public/69d53c1502f1beb4382c2dd0/af7081c85_generated_2534d48f.png", tall: false,
  },
  {
    id: "2", title: "Prism Collection", category: "Campaign", role: "I directed creative",
    description: "I directed a visual campaign exploring light, material, and form — recognized with industry awards.",
    image: "https://media.base44.com/images/public/69d53c1502f1beb4382c2dd0/52e4bd640_generated_3217943e.png", tall: true,
  },
  {
    id: "3", title: "Studio Meridian", category: "Product UX", role: "I owned UX",
    description: "I redesigned the full product experience for a luxury real estate app.",
    image: "https://media.base44.com/images/public/69d53c1502f1beb4382c2dd0/8be4e5753_generated_d6bef9fd.png", tall: true,
  },
  {
    id: "4", title: "Glass Atelier", category: "Web & identity", role: "I consulted",
    description: "I built the digital presence and visual system for an award-winning architecture studio.",
    image: "https://media.base44.com/images/public/69d53c1502f1beb4382c2dd0/e289e4622_generated_e979fdb5.png", tall: false,
  },
  {
    id: "5", title: "Form & Void", category: "Art direction", role: "I art-directed",
    description: "I led art direction for a contemporary gallery exhibition — concept through execution.",
    image: "https://media.base44.com/images/public/69d53c1502f1beb4382c2dd0/dcac31ba6_generated_d918eaa1.png", tall: true,
  },
];

export default function WorkGallery() {
  const { data: dbProjects, isError } = useQuery({
    queryKey: ["portfolio", "projects"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });

  const projects = isSupabaseConfigured() && !isError && dbProjects?.length
    ? dbProjects
    : FALLBACK_PROJECTS;

  return (
    <section id="work" className="py-24 md:py-32 px-[7.5vw]">
      <div className="relative mb-16 md:mb-20">
        <span className="absolute -top-12 left-0 font-heading font-light text-[12vw] md:text-[8vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none">
          WORK
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">Selected work</p>
          <h2 className="font-heading font-light text-3xl md:text-5xl tracking-tight text-foreground">
            A few things <span className="font-semibold">I've shipped</span>
          </h2>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
        </motion.div>
      </div>

      <div className="columns-1 md:columns-2 gap-5 md:gap-6 space-y-5 md:space-y-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
