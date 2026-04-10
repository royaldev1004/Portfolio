import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowUpRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/lib/useProfile";

export default function ContactSection() {
  const { email: SITE_EMAIL } = useProfile();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-[7.5vw] bg-card">
      <div className="w-full h-[0.5px] bg-border -mt-24 md:-mt-32 mb-24 md:mb-32" />

      <div className="relative max-w-4xl mx-auto">
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 font-heading font-light text-[15vw] md:text-[10vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none whitespace-nowrap">
          CONNECT
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">
            Next Steps
          </p>
          <h2 className="font-heading font-light text-4xl md:text-6xl tracking-tight text-foreground">
            LET'S <span className="font-semibold">BUILD</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s explore
            how we can create something remarkable together.
          </p>
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-primary hover:underline underline-offset-4"
          >
            <Mail className="w-4 h-4 shrink-0" />
            {SITE_EMAIL}
          </a>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-6 mx-auto" />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8 max-w-xl mx-auto"
        >
          <div className="space-y-6">
            <div>
              <label className="font-mono-caption uppercase text-muted-foreground mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-border pb-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 text-lg"
              />
            </div>

            <div>
              <label className="font-mono-caption uppercase text-muted-foreground mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={SITE_EMAIL}
                className="w-full bg-transparent border-b border-border pb-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 text-lg"
              />
            </div>

            <div>
              <label className="font-mono-caption uppercase text-muted-foreground mb-2 block">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                rows={4}
                className="w-full bg-transparent border-b border-border pb-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 text-lg resize-none"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={sending}
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          {["LinkedIn", "Dribbble", "Twitter", "GitHub"].map((platform) => (
            <a
              key={platform}
              href="#"
              className="group flex items-center gap-1 font-mono-caption uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {platform}
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
