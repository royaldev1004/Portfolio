import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FolderOpen, User, Zap, Quote, Award, Briefcase, GraduationCap, ChevronRight, ArrowUpRight } from "lucide-react";

const CARDS = [
  { label: "Projects",       table: "projects",       icon: FolderOpen,      to: "/admin/projects",      color: "text-blue-500",    bg: "bg-blue-500/10" },
  { label: "Testimonials",   table: "testimonials",   icon: Quote,           to: "/admin/testimonials",  color: "text-violet-500",  bg: "bg-violet-500/10" },
  { label: "Certifications", table: "certifications", icon: Award,           to: "/admin/certifications",color: "text-amber-500",   bg: "bg-amber-500/10" },
  { label: "Skill Groups",   table: "skill_groups",   icon: Zap,             to: "/admin/skills",        color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Process Steps",  table: "process_steps",  icon: ChevronRight,    to: "/admin/process",       color: "text-sky-500",     bg: "bg-sky-500/10" },
  { label: "Experience",     table: "work_experience",icon: Briefcase,       to: "/admin/experience",    color: "text-rose-500",    bg: "bg-rose-500/10" },
  { label: "Education",      table: "education",      icon: GraduationCap,   to: "/admin/education",     color: "text-teal-500",    bg: "bg-teal-500/10" },
];

function StatCard({ label, table, icon: Icon, to, color, bg }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-count", table],
    queryFn: async () => {
      const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    staleTime: 30_000,
  });

  return (
    <Link to={to} className="group relative p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-heading font-semibold text-2xl text-foreground mt-0.5">
          {isLoading ? <span className="text-muted-foreground text-base">—</span> : data}
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-1" />
    </Link>
  );
}

export default function Dashboard() {
  const qc = useQueryClient();
  const { data: siteVisible = true, isLoading: loadingVisibility } = useQuery({
    queryKey: ["site-settings", "site_visibility_enabled"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "site_visibility_enabled")
        .maybeSingle();
      if (error) throw error;
      const raw = String(data?.value ?? "true").toLowerCase();
      return raw === "true" || raw === "1" || raw === "yes";
    },
    staleTime: 30_000,
  });

  const toggleSiteVisibility = async (next) => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "site_visibility_enabled", value: next ? "true" : "false" }, { onConflict: "key" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      await qc.invalidateQueries({ queryKey: ["site-settings", "site_visibility_enabled"] });
      toast.success(next ? "Portfolio is now live" : "Portfolio is now in Coming Soon mode");
    } catch (e) {
      toast.error(e?.message || "Failed to update visibility");
    }
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Overview</p>
        <h1 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage all sections of your portfolio from one place.</p>
        <div className="w-10 h-[0.5px] bg-primary/40 mt-4" />
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-heading font-semibold text-sm text-foreground">Portfolio visibility</p>
            <p className="text-xs text-muted-foreground mt-1">
              Turn off to show a Coming Soon screen to visitors. Admin stays accessible.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${siteVisible ? "text-emerald-600" : "text-amber-600"}`}>
              {siteVisible ? "Live" : "Coming Soon"}
            </span>
            <Switch
              checked={Boolean(siteVisible)}
              disabled={loadingVisibility}
              onCheckedChange={toggleSiteVisibility}
              aria-label="Toggle portfolio visibility"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {CARDS.map((c) => <StatCard key={c.table} {...c} />)}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6">
        <p className="font-heading font-semibold text-sm text-foreground mb-4">Quick links</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.to} to={c.to} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground">
                <Icon className={`w-4 h-4 ${c.color}`} />
                {c.label}
              </Link>
            );
          })}
          <Link to="/admin/about" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground">
            <User className="w-4 h-4 text-orange-500" />
            About &amp; Stats
          </Link>
        </div>
      </div>
    </div>
  );
}
