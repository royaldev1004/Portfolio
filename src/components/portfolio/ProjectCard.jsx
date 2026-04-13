import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProjectCard({ project, index }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="break-inside-avoid relative rounded-xl overflow-hidden bg-card border border-border/50"
      >
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
          className="relative overflow-hidden cursor-zoom-in h-[280px] md:h-[360px]"
        >
          <img
            src={project.image}
            alt={`${project.title} — ${project.description}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card footer visible by default */}
        <div className="p-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-base text-foreground">
              {project.title}
            </h3>
            <p className="font-mono-caption uppercase text-muted-foreground mt-1">
              {project.category}
            </p>
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
        </div>
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
