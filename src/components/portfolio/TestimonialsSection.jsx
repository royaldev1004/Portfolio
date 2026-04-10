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
    <div className="flex items-center gap-0.5">
      {Array.from({ length: Math.max(1, Math.min(5, count)) }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [page, setPage] = useState(0);

  const { data: dbData, isError } = useQuery({
    queryKey: ["portfolio", "testimonials"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapTestimonialRow);
    },
  });

  const testimonials = isSupabaseConfigured() && !isError && dbData?.length ? dbData : FALLBACK;
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="py-24 md:py-32 px-[7.5vw]">
      <div className="relative">
        <span className="absolute -top-8 left-0 font-heading font-light text-[12vw] md:text-[8vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none">
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
            <h2 className="font-heading font-light text-3xl md:text-5xl tracking-tight text-foreground">
              What people <span className="font-semibold">say about working with me</span>
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
              <div key={t.id} className="relative p-7 rounded-xl border border-border/50 bg-card flex flex-col gap-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-400">
                <Quote className="w-6 h-6 text-primary/30 shrink-0" />
                <p className="text-muted-foreground leading-relaxed text-sm flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-heading font-semibold text-xs text-primary">{t.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-foreground truncate">{t.name}</p>
                    <p className="font-mono-caption text-muted-foreground truncate">{t.role}</p>
                  </div>
                  <StarRating count={t.rating} />
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
