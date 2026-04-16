import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ExternalLink, ChevronLeft, ChevronRight,
  Briefcase, FileText, Cpu, X, ZoomIn, Unlink, Star, Quote, TriangleAlert, Lightbulb,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapProjectRow } from "@/lib/experience-mappers";
import { FALLBACK_PROJECTS } from "@/data/portfolio-projects-fallback";

async function fetchProjectById(id) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return mapProjectRow(data);
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  // close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleBackdrop}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono text-white bg-white/10 border border-white/15">
          {idx + 1} / {images.length}
        </span>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`Screenshot ${idx + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 max-w-[min(90vw,42rem)] overflow-x-auto px-1 py-1">
          {images.map((src, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`shrink-0 w-24 h-16 sm:w-28 sm:h-[4.5rem] md:w-32 md:h-[5.25rem] rounded-xl overflow-hidden border-2 transition-all ${i === idx ? "border-cyan-400 opacity-100 shadow-lg shadow-cyan-500/20" : "border-white/20 opacity-50 hover:opacity-80"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── "No link" dialog ─────────────────────────────────────────
function NoLinkDialog({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
        initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="w-12 h-12 rounded-full bg-slate-700/60 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Unlink className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="font-heading font-bold text-lg text-slate-100 mb-2">No link available</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          There is no live demo or external link associated with this project.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm text-slate-200 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

const DEFAULT_FEEDBACK_TEXT =
  "Outstanding collaboration and technical delivery. Clear communication throughout the engagement and results we could rely on.";

// ── Client feedback card (below gallery) ─────────────────────
function ClientFeedbackCard({ quote, author }) {
  const text = quote?.trim() || DEFAULT_FEEDBACK_TEXT;
  const by = author?.trim() || "Client feedback";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f2342]/95 via-[#0a1628]/90 to-[#06101e]/95 p-6 md:p-7 shadow-xl shadow-black/40 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400/90">Client feedback</p>
          <Quote className="w-8 h-8 text-white/10 shrink-0" aria-hidden />
        </div>

        <div className="flex gap-1 mb-4" role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" />
          ))}
        </div>

        <blockquote className="text-slate-200/95 text-sm md:text-base leading-relaxed mb-5 border-l-2 border-amber-400/40 pl-4">
          {text}
        </blockquote>

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{by}</p>
      </div>
    </motion.div>
  );
}

// ── Gallery ───────────────────────────────────────────────────
function Gallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null); // null or index

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  if (!images.length) return (
    <div className="aspect-video rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-500 text-sm">
      No images available
    </div>
  );

  return (
    <>
      <div className="space-y-3">
        {/* Main image — click to open lightbox */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 aspect-video cursor-zoom-in group"
          onClick={() => setLightbox(active)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${title} screenshot ${active + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>

          {/* Hover zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono text-white bg-black/60 backdrop-blur-sm border border-white/10">
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Thumbnail strip — larger previews */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {images.map((src, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className={`shrink-0 w-[7.25rem] h-[4.75rem] sm:w-[8.5rem] sm:h-24 md:w-40 md:h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === active
                    ? "border-cyan-400 shadow-lg shadow-cyan-400/35 opacity-100 ring-2 ring-cyan-400/20"
                    : "border-white/10 opacity-55 hover:opacity-90 hover:border-white/35"
                }`}
                aria-label={`Screenshot ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Styled section label ──────────────────────────────────────
function SectionLabel({ icon: Icon, label, color }) {
  const colors = {
    cyan:    "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    violet:  "text-violet-400 border-violet-400/30 bg-violet-400/10",
    emerald: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-2 ${colors[color]}`}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams();
  const [noLinkOpen, setNoLinkOpen] = useState(false);
  const fallback = FALLBACK_PROJECTS.find((p) => p.id === id);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    enabled: isSupabaseConfigured() && Boolean(id),
    queryFn: () => fetchProjectById(id),
  });

  const p = project ?? fallback;

  if (isLoading && !fallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050d1a]">
        <div className="w-8 h-8 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!p || p.visible === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050d1a] px-6 text-center">
        <p className="text-slate-400">Project not found.</p>
        <Link to="/#work" className="text-cyan-400 hover:underline text-sm">← Back to Projects</Link>
      </div>
    );
  }

  // Merge cover + screenshots, deduplicated
  const allImages = Array.from(
    new Set([
      ...(p.screenshots?.filter(Boolean) ?? []),
      ...(p.image ? [p.image] : []),
    ])
  );

  const handleDemoClick = () => {
    if (p.url) {
      window.open(p.url, "_blank", "noopener,noreferrer");
    } else {
      setNoLinkOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e1c] text-slate-100">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vh] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16">

        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        {/* ── Title hero — full width ──────────────────────────── */}
        <motion.div
          className="mb-10 md:mb-12"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {p.category && (
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">{p.category}</p>
          )}
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-[3.75rem] leading-tight max-w-4xl">
            <span className="bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {p.title}
            </span>
          </h1>
        </motion.div>

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── Left: description card ───────────────────────── */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3c] via-[#0a1628] to-[#06101e]" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              <div className="relative p-6 md:p-8 space-y-7">

                {/* Role */}
                {p.role && (
                  <div>
                    <SectionLabel icon={Briefcase} label="Role" color="cyan" />
                    <p className="text-xl font-heading font-bold text-cyan-300 leading-snug">{p.role}</p>
                  </div>
                )}

                {p.role && <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />}

                {/* Description */}
                <div>
                  <SectionLabel icon={FileText} label="Description" color="violet" />
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">{p.description}</p>
                </div>

                {p.challenge?.trim() ? (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div>
                      <SectionLabel icon={TriangleAlert} label="Challenge" color="violet" />
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base">{p.challenge}</p>
                    </div>
                  </>
                ) : null}

                {p.solution?.trim() ? (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div>
                      <SectionLabel icon={Lightbulb} label="Solution" color="emerald" />
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base">{p.solution}</p>
                    </div>
                  </>
                ) : null}

                {/* Technologies */}
                {p.tags?.length > 0 && (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div>
                      <SectionLabel icon={Cpu} label="Technologies Used" color="emerald" />
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.tags.map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Live Demo — always shown */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <motion.button
                  onClick={handleDemoClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 ${
                    p.url
                      ? "text-[#060e1c] bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-cyan-500/25"
                      : "text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {p.url ? <ExternalLink className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                  Live Demo
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Right: gallery + feedback ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="lg:sticky lg:top-10 space-y-6"
          >
            <Gallery images={allImages} title={p.title} />
            <ClientFeedbackCard quote={p.feedbackText} author={p.feedbackAuthor} />
          </motion.div>
        </div>
      </div>

      {/* No-link dialog */}
      <AnimatePresence>
        {noLinkOpen && <NoLinkDialog onClose={() => setNoLinkOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
