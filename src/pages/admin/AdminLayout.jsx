import React, { useState } from "react";
import { Routes, Route, NavLink, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  LayoutDashboard, FolderOpen, User, Zap, Quote, Award,
  Briefcase, GraduationCap, LogOut, ArrowLeft, Menu, X, ChevronRight, UserCircle,
} from "lucide-react";
import Dashboard from "./Dashboard";
import ProjectsAdmin from "./ProjectsAdmin";
import AboutAdmin from "./AboutAdmin";
import SkillsAdmin from "./SkillsAdmin";
import TestimonialsAdmin from "./TestimonialsAdmin";
import CertificationsAdmin from "./CertificationsAdmin";
import ProcessAdmin from "./ProcessAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import ProfileAdmin from "./ProfileAdmin";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { label: "Identity", divider: true },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
  { label: "Content", divider: true },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/about", label: "About & Stats", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Zap },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/process", label: "Process Steps", icon: ChevronRight },
  { label: "Career", divider: true },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
];

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-card border-r border-border/80 shrink-0">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/60">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Portfolio</p>
          <p className="font-heading font-semibold text-sm text-foreground mt-0.5">Admin Panel</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map((item, i) => {
          if (item.divider) return (
            <p key={i} className="px-2 pt-4 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 font-mono">
              {item.label}
            </p>
          );
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[calc(0.75rem-2px)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-border/60 pt-3 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to Portfolio
        </Link>
        <button type="button" onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ session }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-card shrink-0">
          <button type="button" onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary">
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-heading font-semibold text-sm">Admin Panel</p>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="certifications" element={<CertificationsAdmin />} />
            <Route path="process" element={<ProcessAdmin />} />
            <Route path="experience" element={<ExperienceAdmin mode="work" />} />
            <Route path="education" element={<ExperienceAdmin mode="education" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
