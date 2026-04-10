import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="break-inside-avoid group relative rounded-xl overflow-hidden bg-card border border-border/50 cursor-pointer"
    >
      <div className={`relative overflow-hidden ${project.tall ? "h-[420px] md:h-[520px]" : "h-[280px] md:h-[360px]"}`}>
        <img
          src={project.image}
          alt={`${project.title} — ${project.description}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
          <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <p className="font-mono-caption uppercase text-primary-foreground/70 mb-2">
              {project.category}
            </p>
            <h3 className="font-heading font-semibold text-xl md:text-2xl text-primary-foreground mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed">
              {project.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-primary-foreground/90">
              <span className="font-mono-caption uppercase">{project.role}</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Card footer visible by default */}
      <div className="p-5 flex items-center justify-between group-hover:opacity-0 transition-opacity duration-300">
        <div>
          <h3 className="font-heading font-semibold text-base text-foreground">
            {project.title}
          </h3>
          <p className="font-mono-caption uppercase text-muted-foreground mt-1">
            {project.category}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
        </div>
      </div>
    </motion.article>
  );
}