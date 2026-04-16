import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export default function ProjectCard({ project, index, variant = "noteworthy", featured = false }) {
  const navigate = useNavigate();
  const isNotable = variant === "notable";
  const isEvenNumberedCard = (index + 1) % 2 === 0;
  const imageHeightClass = isNotable
    ? featured ? "h-[320px] md:h-[420px]" : "h-[260px] md:h-[320px]"
    : "h-[220px] md:h-[250px]";

  const goToDetail = () => navigate(`/project/${project.id}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={
        isNotable
          ? undefined
          : { y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }
      }
      onClick={goToDetail}
      className={`break-inside-avoid relative group cursor-pointer ${
        isNotable
          ? ""
          : "rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40"
      }`}
    >
      {isNotable ? (
        <div className={`relative ${featured ? "pb-24 md:pb-32" : "pb-20 md:pb-24"}`}>
          <div
            className={`relative overflow-hidden rounded-2xl border border-border/60 cursor-pointer transition-all duration-300 ease-out hover:border-primary/45 hover:shadow-xl hover:shadow-primary/15 group/image ${featured ? "h-[300px] md:h-[420px]" : "h-[260px] md:h-[330px]"}`}
          >
            <img
              src={project.image}
              alt={`${project.title} — ${project.description}`}
              className="w-full h-full object-cover opacity-60 transition-transform duration-500 ease-out group-hover/image:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-slate-950/65 to-slate-950/85" />
          </div>

          <motion.div
            className={`absolute z-10 ${
              featured
                ? isEvenNumberedCard
                  ? "left-4 right-4 -bottom-2 md:left-10 md:right-auto md:w-[44%]"
                  : "left-4 right-4 -bottom-2 md:left-auto md:right-10 md:w-[44%]"
                : isEvenNumberedCard
                  ? "left-4 right-4 -bottom-2 md:left-8 md:right-auto md:w-[58%]"
                  : "left-4 right-4 -bottom-2 md:left-auto md:right-8 md:w-[58%]"
            }`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 + index * 0.05 }}
          >
            <motion.div
              className="rounded-2xl border border-cyan-400/25 bg-[#0f2342]/92 backdrop-blur-md p-5 md:p-6 shadow-2xl shadow-cyan-900/20"
            >
              <p className="font-mono-caption uppercase tracking-[0.2em] text-cyan-300 mb-2">Featured Project</p>
              <h3 className="font-heading font-semibold text-2xl text-slate-100">
                {project.title}
              </h3>
              <motion.div
                className="mt-4 rounded-xl border border-cyan-400/15 bg-[#102b4d]/70 p-4"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
              >
                <p className="text-sm text-slate-300/90 leading-relaxed line-clamp-4">
                  {project.description}
                </p>
                <span className="mt-2 inline-block text-cyan-300 text-xs font-medium">
                  View details →
                </span>
              </motion.div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(project.tags?.length ? project.tags : [project.category, project.role].filter(Boolean)).slice(0, 4).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] border border-cyan-400/25 bg-[#0d2749] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-3">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-cyan-400/25 text-slate-300 hover:text-cyan-300 hover:border-cyan-300 transition-colors"
                    aria-label="Open project site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                  </a>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <>
          <div
            className={`relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out group-hover:brightness-[1.03] ${imageHeightClass}`}
          >
            <img
              src={project.image}
              alt={`${project.title} — ${project.description}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
          <motion.div
            className="p-5 flex items-start justify-between gap-3"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold text-lg md:text-xl text-foreground leading-snug">
                {project.title}
              </h3>
              {project.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag, i) => {
                    const colors = [
                      "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
                      "border-violet-400/30 bg-violet-400/10 text-violet-300",
                      "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
                      "border-amber-400/30 bg-amber-400/10 text-amber-300",
                    ];
                    return (
                      <span
                        key={tag}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wide ${colors[i % colors.length]}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="w-8 h-8 shrink-0 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </>
      )}
    </motion.article>
  );
}
