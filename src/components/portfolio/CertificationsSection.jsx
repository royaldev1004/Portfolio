import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapCertRow } from "@/lib/experience-mappers";
import { COLOR_THEME } from "@/pages/admin/shared/AdminComponents";

const FALLBACK = [
  { id: "1", title: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", year: "2023", certId: "AWS-DEV-2023", category: "Cloud", colorKey: "amber" },
  { id: "2", title: "Professional Machine Learning Engineer", issuer: "Google Cloud", year: "2022", certId: "GCP-MLE-2022", category: "AI / ML", colorKey: "blue" },
  { id: "3", title: "OpenAI API & Prompt Engineering", issuer: "DeepLearning.AI", year: "2023", certId: "DL-OAI-2023", category: "AI Development", colorKey: "violet" },
  { id: "4", title: "n8n Certified Automation Expert", issuer: "n8n GmbH", year: "2022", certId: "N8N-AUT-2022", category: "Automation", colorKey: "emerald" },
  { id: "5", title: "GoHighLevel Certified Partner", issuer: "HighLevel Inc.", year: "2022", certId: "GHL-CERT-2022", category: "CRM", colorKey: "sky" },
  { id: "6", title: "React & React Native – Advanced", issuer: "Meta (via Coursera)", year: "2021", certId: "META-RN-2021", category: "Frontend / Mobile", colorKey: "cyan" },
  { id: "7", title: "LangChain & Vector Databases", issuer: "DeepLearning.AI", year: "2023", certId: "DL-LC-2023", category: "AI Development", colorKey: "violet" },
  { id: "8", title: "Make.com (Integromat) Expert", issuer: "Make Academy", year: "2021", certId: "MAKE-EXP-2021", category: "Automation", colorKey: "emerald" },
];

export default function CertificationsSection() {
  const { data: dbCerts, isError } = useQuery({
    queryKey: ["portfolio", "certifications"],
    enabled: isSupabaseConfigured(),
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapCertRow);
    },
  });

  const certifications = isSupabaseConfigured() && !isError && dbCerts?.length ? dbCerts : FALLBACK;

  return (
    <section id="certifications" className="py-24 md:py-32 px-[7.5vw]">
      <div className="relative">
        <span className="absolute -top-8 left-0 font-heading font-light text-[12vw] md:text-[8vw] leading-none text-foreground/[0.03] tracking-tighter pointer-events-none select-none">
          CERTS
        </span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <p className="font-mono-caption uppercase text-primary mb-3 tracking-widest">Verified Credentials</p>
          <h2 className="font-heading font-light text-3xl md:text-5xl tracking-tight text-foreground">
            Certifications &amp; <span className="font-semibold">Licenses</span>
          </h2>
          <div className="w-12 h-[0.5px] bg-primary/40 mt-5" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert, index) => {
            const theme = COLOR_THEME[cert.colorKey] || COLOR_THEME.blue;
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className={`group relative p-6 rounded-xl border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-400 ${theme.border} hover:border-primary/40`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
                    <Award className={`w-4.5 h-4.5 ${theme.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/40" />
                    <span className="font-mono-caption text-muted-foreground/40 text-xs">{cert.year}</span>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground leading-snug mb-2">{cert.title}</h3>
                <p className={`font-mono-caption uppercase text-xs mb-1 ${theme.color}`}>{cert.category}</p>
                <p className="font-mono-caption text-muted-foreground text-xs">{cert.issuer}</p>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="font-mono-caption text-muted-foreground/50 text-xs tracking-wider">{cert.certId}</span>
                  <button className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    aria-label={`View ${cert.title} certificate`}>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
