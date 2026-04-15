import React, { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Mail, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/lib/useProfile";

export default function ContactSection() {
  const { email: SITE_EMAIL } = useProfile();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-[7.5vw] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I&apos;m always open to new ideas and collaborations. If you&apos;re planning a product,
            need engineering support, or want to discuss opportunities, feel free to reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-primary/25 bg-card/70 backdrop-blur-md p-6 md:p-7 shadow-xl shadow-primary/10"
          >
            <h3 className="font-heading font-semibold text-3xl text-foreground mb-6">Send me a message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="w-4 h-4 text-primary absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Name *"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-background/60 border border-border focus:border-primary/70 focus:outline-none text-sm"
                />
              </div>
              <div className="relative">
                <AtSign className="w-4 h-4 text-primary absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Your Email *"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-background/60 border border-border focus:border-primary/70 focus:outline-none text-sm"
                />
              </div>
              <div className="relative sm:col-span-2">
                <MessageSquare className="w-4 h-4 text-primary absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Subject"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-background/60 border border-border focus:border-primary/70 focus:outline-none text-sm"
                />
              </div>
              <div className="relative sm:col-span-2">
                <MessageSquare className="w-4 h-4 text-primary absolute left-3 top-3.5" />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Your Message *"
                  rows={5}
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-background/60 border border-border focus:border-primary/70 focus:outline-none text-sm resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {sending ? <span className="animate-pulse">Sending...</span> : "Send Message"}
              <Send className="w-4 h-4" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md p-6 md:p-7 shadow-xl shadow-primary/10"
          >
            <h3 className="font-heading font-semibold text-3xl text-foreground mb-6">Contact Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Feel free to reach out through these channels. I&apos;m always eager to discuss new
              opportunities and ideas.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/50 px-4 py-3 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{SITE_EMAIL}</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
