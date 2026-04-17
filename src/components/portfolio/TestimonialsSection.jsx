import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapTestimonialRow } from "@/lib/experience-mappers";

const FALLBACK = [
  { id: "1", name: "Sarah Mitchell", role: "CEO, NovaTech Solutions", avatar: "SM", rating: 5, text: "Working together was a game-changer for our business. They built a fully automated AI voice agent that handles 80% of our inbound calls with no human intervention. Technical depth and speed were both outstanding." },
  { id: "2", name: "James Okonkwo", role: "Founder, ScaleFlow Agency", avatar: "JO", rating: 5, text: "They set up our entire GoHighLevel CRM with n8n automation in under two weeks. What used to take our team hours now runs on autopilot. One of the best engineers I've worked with." },
  { id: "3", name: "Priya Sharma", role: "Product Lead, Elevate AI", avatar: "PS", rating: 5, text: "We needed a complex RAG-based AI assistant in our SaaS product. They delivered a clean, scalable LangChain + vector DB solution — on time and beyond spec." },
  { id: "4", name: "Lucas Fernandez", role: "Director, Meridian Digital", avatar: "LF", rating: 5, text: "Their No-Code work with Webflow and Base44 saved us months. They built our marketing site and client portal fast, with automation flows that just work." },
  { id: "5", name: "Emily Chen", role: "CTO, VoiceFirst Labs", avatar: "EC", rating: 5, text: "We hired them to build a Vapi + ElevenLabs voice pipeline. The result is a human-like, low-latency agent our users love. Rare depth across the full AI stack." },
  { id: "6", name: "Daniel Osei", role: "Operations Manager, FlowBridge", avatar: "DO", rating: 5, text: "The Make.com workflows they architected cut our e-commerce ops overhead by 60%. They think in systems and deliver with precision." },
];

function StarRating({ count }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: Math.max(1, Math.min(5, count)) }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const useDb = isSupabaseConfigured();

  const { data: dbData, isError, isLoading } = useQuery({
    queryKey: ["portfolio", "testimonials"],
    enabled: useDb,
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapTestimonialRow);
    },
  });

  const testimonials = useDb
    ? (isLoading ? [] : (!isError && dbData?.length ? dbData : FALLBACK))
    : FALLBACK;
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="py-24 md:py-32 px-[7.5vw] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="relative">
        <span className="absolute -top-8 left-0 font-heading font-black text-[12vw] md:text-[8vw] leading-none text-foreground/[0.045] tracking-tighter pointer-events-none select-none">
          CLIENTS
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">Kind words</p>
            <h2 className="font-heading font-bold text-3xl md:text-5xl tracking-tight text-foreground">
              <span className="font-semibold bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              What people{" "} say about working with me
              </span>
            </h2>
            <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all duration-300"
              aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-caption text-muted-foreground">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all duration-300"
              aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {useDb && isLoading ? (
          <div className="text-muted-foreground text-sm py-4">Loading testimonials...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visible.map((t) => (
                <div
                  key={t.id}
                  className="relative p-7 rounded-2xl border border-border/70 bg-card/95 flex flex-col gap-5 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/12 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f2342]/90 dark:via-[#0a1628]/90 dark:to-[#06101e]/95 dark:hover:border-cyan-300/30 dark:hover:shadow-cyan-900/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-3xl pointer-events-none dark:bg-amber-400/5" />
                  <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/12 rounded-full blur-2xl pointer-events-none dark:bg-cyan-500/5" />

                  <div className="relative flex items-start justify-between gap-3">
                    <Quote className="w-7 h-7 text-primary/45 dark:text-cyan-300/35 shrink-0" />
                    <StarRating count={t.rating} />
                  </div>

                  <p className="relative text-foreground/90 dark:text-slate-200/95 leading-relaxed text-[15px] flex-1 border-l-2 border-amber-500/45 dark:border-amber-400/35 pl-4">
                    "{t.text}"
                  </p>

                  <div className="relative flex items-center gap-3 pt-3 border-t border-border/70 dark:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0 dark:bg-cyan-400/12 dark:border-cyan-300/20">
                      <span className="font-heading font-semibold text-xs text-primary dark:text-cyan-200">{t.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-base text-foreground dark:text-slate-100 truncate">{t.name}</p>
                      <p className="font-mono-caption text-muted-foreground dark:text-slate-400 truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
