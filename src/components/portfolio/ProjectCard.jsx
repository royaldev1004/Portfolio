import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProjectCard({ project, index, variant = "noteworthy", featured = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isNotable = variant === "notable";
  const imageHeightClass = isNotable
    ? featured ? "h-[320px] md:h-[420px]" : "h-[260px] md:h-[320px]"
    : "h-[220px] md:h-[250px]";

  return (
    <>
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
        className={`break-inside-avoid relative group cursor-pointer ${
          isNotable
            ? ""
            : "rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40"
        }`}
      >
        {isNotable ? (
          <div className={`relative ${featured ? "pb-24 md:pb-32" : "pb-20 md:pb-24"}`}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalOpen(true);
                }
              }}
              onClick={() => setModalOpen(true)}
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
              className={`absolute z-10 ${featured ? "left-4 right-4 -bottom-2 md:left-auto md:right-10 md:w-[44%]" : "left-4 right-4 -bottom-2 md:left-auto md:right-8 md:w-[58%]"}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.05 }}
              animate={{ y: [0, -2, 0] }}
            >
              <motion.div
                className="rounded-2xl border border-cyan-400/25 bg-[#0f2342]/92 backdrop-blur-md p-5 md:p-6 shadow-2xl shadow-cyan-900/20"
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(true);
                    }}
                    className="mt-2 text-cyan-300 text-xs font-medium hover:text-cyan-200 transition-colors"
                  >
                    Read more
                  </button>
                </motion.div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {(project.tags?.length ? project.tags : [project.category, project.role].filter(Boolean)).slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] border border-cyan-400/25 bg-[#0d2749] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-cyan-400/25 text-slate-300 hover:text-cyan-300 hover:border-cyan-300 transition-colors"
                    aria-label="Open project details"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </button>
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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalOpen(true);
                }
              }}
              onClick={() => setModalOpen(true)}
              className={`relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out group-hover:brightness-[1.03] ${imageHeightClass}`}
            >
              <img
                src={project.image}
                alt={`${project.title} — ${project.description}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          <motion.div
            className="p-5 flex items-center justify-between gap-3"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-base text-foreground">
                {project.title}
              </h3>
              <p className="font-mono-caption uppercase text-muted-foreground mt-1">
                {project.category}
              </p>
              {project.role ? (
                <p className="font-mono-caption uppercase text-primary mt-1">
                  {project.role}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {(project.tags?.length ? project.tags : [project.category, project.role].filter(Boolean)).slice(0, 4).map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md text-[10px] uppercase border border-border text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Visit site
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full border border-border flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
          </>
        )}
      </motion.article>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[min(92vw,56rem)] gap-0 overflow-hidden border-border p-0">
          <div className="relative max-h-[min(85vh,720px)] bg-muted/40">
            <img
              src={project.image}
              alt=""
              className="mx-auto max-h-[min(85vh,720px)] w-full object-contain"
            />
          </div>
          <DialogHeader className="space-y-2 p-6 text-left sm:text-left">
            <DialogTitle className="font-heading text-xl md:text-2xl">{project.title}</DialogTitle>
            <p className="font-mono-caption uppercase text-muted-foreground">{project.category}</p>
            {project.role ? (
              <p className="font-mono-caption uppercase text-primary">{project.role}</p>
            ) : null}
            <DialogDescription className="text-base leading-relaxed">
              {project.description}
            </DialogDescription>
          </DialogHeader>
          {project.url ? (
            <DialogFooter className="flex flex-col gap-3 px-6 pb-6 pt-0 sm:flex-row sm:justify-start">
              <Button asChild size="default">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  Visit site
                  <ExternalLink className="w-4 h-4" aria-hidden />
                </a>
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
