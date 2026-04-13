import React, { useEffect, useMemo, useState } from "react";
import "./Width.css";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

export default function HeroSection() {
  const { name, location, avatarUrl, roleTitle, heroRoles, taglinePre, taglineHighlight, taglinePost } = useProfile();
  const [typedRole, setTypedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const roleOptions = useMemo(
    () => (Array.isArray(heroRoles) && heroRoles.length ? heroRoles : [roleTitle || "Senior AI & Automation Engineer"]),
    [heroRoles, roleTitle],
  );

  useEffect(() => {
    const roleText = roleOptions[roleIndex];
    let timeoutId;

    if (!isDeleting && typedRole.length < roleText.length) {
      timeoutId = setTimeout(() => {
        setTypedRole(roleText.slice(0, typedRole.length + 1));
      }, 70);
    } else if (!isDeleting && typedRole.length === roleText.length) {
      timeoutId = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && typedRole.length > 0) {
      timeoutId = setTimeout(() => {
        setTypedRole(roleText.slice(0, typedRole.length - 1));
      }, 45);
    } else if (isDeleting && typedRole.length === 0) {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roleOptions.length);
      }, 350);
    }

    return () => clearTimeout(timeoutId);
  }, [typedRole, isDeleting, roleIndex, roleOptions]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_55%)]" />

      {/* Background macro typography */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute -left-[-18vw] top-[15vh] font-heading font-black text-[18vw] leading-none text-foreground/[0.045] tracking-tighter">
          AI
        </span>
      </div>

      <div className="relative w-full px-[7.5vw] pt-24 pb-16 md:pt-0 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-center min-h-[80vh]">
          {/* Left: Text Content */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="font-mono-caption uppercase text-primary mb-5 tracking-widest">
                Portfolio · {location} — 2026
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.42 }}
              className="font-heading font-bold text-[clamp(2.75rem,9vw,5.75rem)] leading-[1.02] tracking-tight text-foreground"
            >
              {name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="font-heading font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.18] tracking-tight text-foreground mt-4 md:mt-5 max-w-[22ch]"
            >
              {taglinePre}
              <br />
              <span className="font-semibold text-primary">{taglineHighlight}</span>
              <br />
              {taglinePost}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.66 }}
              className="mt-4"
            >
              <p className="font-heading font-semibold text-primary text-xl md:text-2xl">
                {typedRole}
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="ml-1 inline-block"
                >
                  |
                </motion.span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.72 }}
              className="mt-8 max-w-xl"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md p-6 md:p-7 shadow-xl shadow-primary/10"
              >
                <div className="w-12 h-[0.5px] bg-primary/40 mb-5" />
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  Dynamic and experienced{" "}
                  <span className="text-primary font-semibold">AI Engineer</span> and{" "}
                  <span className="text-primary font-semibold">Full Stack Developer</span> with
                  a strong track record of shipping production-ready platforms across healthcare,
                  fintech, and SaaS. I specialize in{" "}
                  <span className="text-primary font-semibold">AI-driven automation</span>,{" "}
                  <span className="text-primary font-semibold">No-Code/Low-Code systems</span>,
                  and scalable web applications that prioritize reliability, speed, and measurable
                  business impact.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-10 flex items-center gap-6"
            >
              <button
                onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                See my work
              </button>
              <button
                onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-4 decoration-border hover:decoration-foreground"
              >
                About me
              </button>
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="md:col-span-5 flex justify-center md:justify-end"
          >
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.01, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px]"
            >
              <motion.div
                className="absolute inset-[-12px] rounded-full border border-primary/20"
                animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.15, 0.45] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-[-20px] rounded-full bg-primary/10 blur-2xl -z-10"
                animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
                transition={{ repeat: Infinity, duration: 4.4, ease: "easeInOut" }}
              />

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
                <img
                  src={avatarUrl}
                  alt={`${name} — portrait`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
              </div>
              {/* Decorative element */}
              <motion.div
                animate={{ y: [0, -6, 0], x: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-20 h-20 border border-primary/20 rounded-full -z-10"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="hidden md:flex absolute bottom--2 left-[7.5vw] items-center gap-3 text-muted-foreground"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
          <span className="font-mono-caption uppercase">Scroll to see more</span>
        </motion.div>
      </div>
    </section>
  );
}
