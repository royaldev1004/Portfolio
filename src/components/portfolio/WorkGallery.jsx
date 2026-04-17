import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./ProjectCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProjectRow } from "@/lib/experience-mappers";
import { FALLBACK_PROJECTS } from "@/data/portfolio-projects-fallback";

export { FALLBACK_PROJECTS };

function toCategoryLabel(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function WorkGallery() {
  const useDb = isSupabaseConfigured();
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleNoteworthyCount, setVisibleNoteworthyCount] = useState(6);

  const { data: dbProjects, isError, isLoading } = useQuery({
    queryKey: ["portfolio", "projects"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });
  const { data: dbCategories = [] } = useQuery({
    queryKey: ["portfolio", "project-categories"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("project_categories").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const projects = useDb
    ? (isLoading ? [] : (!isError && dbProjects?.length ? dbProjects : FALLBACK_PROJECTS))
    : FALLBACK_PROJECTS;
  const visibleProjects = projects.filter((p) => p.visible !== false);

  const notableProjects = visibleProjects.filter((p) => p.tier === "notable");
  const noteworthyProjects = visibleProjects.filter((p) => p.tier !== "notable");
  const categoryTabs = useMemo(() => {
    if (dbCategories.length) {
      return [{ id: "all", label: "All" }, ...dbCategories.filter((c) => c.is_visible !== false).map((c) => ({ id: c.slug, label: c.label }))];
    }
    const set = new Set(noteworthyProjects.map((p) => p.workCategory).filter(Boolean));
    return [{ id: "all", label: "All" }, ...Array.from(set).map((slug) => ({ id: slug, label: toCategoryLabel(slug) }))];
  }, [dbCategories, noteworthyProjects]);

  // If currently selected category becomes hidden, fall back to "all".
  React.useEffect(() => {
    if (activeCategory === "all") return;
    const exists = categoryTabs.some((tab) => tab.id === activeCategory);
    if (!exists) setActiveCategory("all");
  }, [activeCategory, categoryTabs]);

  // Filter noteworthy by selected category
  const filteredNoteworthy = activeCategory === "all"
    ? noteworthyProjects
    : noteworthyProjects.filter((p) => p.workCategory === activeCategory);

  const visibleNoteworthy = filteredNoteworthy.slice(0, visibleNoteworthyCount);
  const hasMoreNoteworthy = filteredNoteworthy.length > visibleNoteworthy.length;

  // Group filtered noteworthy projects by subcategory
  const groupedNoteworthy = visibleNoteworthy.reduce((acc, project) => {
    const key = project.subcategory?.trim() || "__none__";
    if (!acc[key]) acc[key] = [];
    acc[key].push(project);
    return acc;
  }, {});

  // Ordered subcategory keys: named ones first (in insertion order), then __none__
  const subcategoryKeys = [
    ...Object.keys(groupedNoteworthy).filter((k) => k !== "__none__"),
    ...(groupedNoteworthy["__none__"] ? ["__none__"] : []),
  ];

  const showSubcategories = activeCategory !== "all" && subcategoryKeys.some((k) => k !== "__none__");

  React.useEffect(() => {
    setVisibleNoteworthyCount(6);
  }, [activeCategory]);

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
              My{" "}
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Notable
              </span>{" "}
              Projects
            </p>
            <div className="hidden md:block h-[0.5px] flex-1 bg-primary/30" />
          </div>
        </motion.div>
      </div>

      <div className="space-y-16">
        {/* Notable projects */}
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

        {/* Noteworthy projects */}
        <div>
          <h3 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-2 text-center">
            Other{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Noteworthy
            </span>{" "}
            Projects
          </h3>
          <p className="text-muted-foreground mb-8 text-center">
            Additional work that demonstrates breadth across domains and delivery styles.
          </p>

          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                    : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground bg-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects grid — with optional subcategory grouping */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {!useDb || !isLoading ? (
                filteredNoteworthy.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12 text-sm">
                    No projects in this category yet.
                  </p>
                ) : showSubcategories ? (
                  <div className="space-y-12">
                    {subcategoryKeys.map((subcatKey) => {
                      const group = groupedNoteworthy[subcatKey];
                      const label = subcatKey === "__none__" ? null : subcatKey;
                      return (
                        <div key={subcatKey}>
                          {label && (
                            <div className="flex items-center gap-4 mb-6">
                              <h4 className="font-heading font-black text-xl md:text-2xl whitespace-nowrap">
                                <span className="bg-gradient-to-r from-cyan-300 via-primary to-violet-300 bg-clip-text text-transparent">
                                  {label}
                                </span>
                              </h4>
                              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {group.map((project, index) => (
                              <ProjectCard key={project.id} project={project} index={index} variant="noteworthy" />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visibleNoteworthy.map((project, index) => (
                      <ProjectCard key={project.id} project={project} index={index} variant="noteworthy" />
                    ))}
                  </div>
                )
              ) : null}
            </motion.div>
          </AnimatePresence>

          {hasMoreNoteworthy && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleNoteworthyCount((prev) => prev + 6)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
