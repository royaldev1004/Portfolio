import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProjectRow } from "@/lib/experience-mappers";

// Card images: each site’s Open Graph / marketing hero asset (same URLs stored in Supabase `image_url` + `external_url`).
const FALLBACK_PROJECTS = [
  {
    id: "1",
    title: "Ambience Healthcare",
    category: "Previous role",
    role: "Engineering",
    description:
      "AI-powered clinical documentation and workflow tools that help clinicians spend less time on the keyboard and more time with patients.",
    image:
      "https://framerusercontent.com/images/l2jbzG0Wzk7GJYt31m2QzU82JzQ.png",
    tall: false,
    url: "https://www.ambiencehealthcare.com/",
  },
  {
    id: "2",
    title: "Commure",
    category: "Previous role",
    role: "Engineering",
    description:
      "Healthcare operations and developer infrastructure — connecting systems so care teams can move faster with safer, more interoperable data.",
    image:
      "https://cdn.prod.website-files.com/66b319e3933cb4cb9c43ebdc/66cb9c13447baaa8b66e7511_Commure%20-%20Open%20Graph%20Image.jpg",
    tall: true,
    url: "https://www.commure.com/",
  },
  {
    id: "3",
    title: "Incuto",
    category: "Previous role",
    role: "Engineering",
    description:
      "Platform work for community-focused financial services — improving access to fair banking and lending through modern software.",
    image:
      "https://static1.squarespace.com/static/5c8ad859e8ba4434f9bf43f6/t/5db2fabdca41e03baabf6c71/1572010686772/Incutopurple600.png?format=1500w",
    tall: true,
    url: "https://www.incuto.com/",
  },
  {
    id: "4",
    title: "Unit21",
    category: "Previous role",
    role: "Engineering",
    description:
      "Risk and fraud operations tooling — helping teams detect suspicious activity, investigate cases, and stay ahead of financial crime.",
    image:
      "https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png",
    tall: false,
    url: "https://www.unit21.ai/",
  },
  {
    id: "5",
    title: "Babyscripts",
    category: "Previous role",
    role: "Engineering",
    description:
      "Remote pregnancy care — connecting patients and providers with monitoring and education to improve maternal health outcomes.",
    image: "https://babyscripts.com/hubfs/bloodpressure_heroimage.png",
    tall: true,
    url: "https://www.babyscripts.com/",
  },
  {
    id: "6",
    title: "Panorama Education",
    category: "Previous role",
    role: "Engineering",
    description:
      "K–12 analytics and surveys — giving schools actionable insight into student success, well-being, and engagement.",
    image: "https://www.panoramaed.com/hubfs/panorama-education-district-view.png",
    tall: false,
    url: "https://www.panoramaed.com/",
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
        <span className="absolute -top-12 left-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          WORK
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">Selected work</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-foreground">
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
