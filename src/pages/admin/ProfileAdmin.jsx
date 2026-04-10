import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { settingsToObject } from "@/lib/experience-mappers";
import { Save, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "./shared/AdminComponents";

const PROFILE_KEYS = [
  "profile_name", "profile_location", "profile_email", "profile_role_title",
  "profile_avatar_url", "profile_work_image_url",
  "hero_tagline_pre", "hero_tagline_highlight", "hero_tagline_post",
];

const DEFAULTS = {
  profile_name: "Nguyen Hiep",
  profile_location: "Vietnam",
  profile_email: "fullmaster240@gmail.com",
  profile_role_title: "Senior AI & Automation Engineer",
  profile_avatar_url: "/nguyen-hiep.png",
  profile_work_image_url: "/Work.png",
  hero_tagline_pre: "I build",
  hero_tagline_highlight: "AI & automation",
  hero_tagline_post: "that ships",
};

export default function ProfileAdmin() {
  const qc = useQueryClient();
  const [edits, setEdits] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const current = { ...DEFAULTS, ...(settings || {}), ...(edits || {}) };
  const isDirty = edits !== null;

  const set = (key) => (val) => setEdits((prev) => ({ ...(prev ?? current), [key]: val }));

  const save = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      const upserts = PROFILE_KEYS.map((key) => ({ key, value: current[key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
      setEdits(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Manage</p>
          <h1 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your name, contact, images, and hero tagline used across the whole site.</p>
          <div className="w-10 h-[0.5px] bg-primary/40 mt-4" />
        </div>
        {isDirty && (
          <button type="button" onClick={save} disabled={saving}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Identity */}
          <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <p className="font-heading font-semibold text-sm text-foreground">Identity</p>
            </div>
            <FormField label="Full Name" value={current.profile_name} onChange={set("profile_name")} placeholder="Your full name" />
            <FormField label="Location" value={current.profile_location} onChange={set("profile_location")} placeholder="City, Country" />
            <FormField label="Email" value={current.profile_email} onChange={set("profile_email")} placeholder="you@example.com" />
            <FormField label="Role / Title" value={current.profile_role_title} onChange={set("profile_role_title")} placeholder="e.g. Senior AI & Automation Engineer" />
          </div>

          {/* Images */}
          <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
            <p className="font-heading font-semibold text-sm text-foreground mb-1">Images</p>
            <p className="text-xs text-muted-foreground -mt-2">Use <code className="bg-muted px-1 py-0.5 rounded">/filename.png</code> for files in <code className="bg-muted px-1 py-0.5 rounded">/public</code>, or paste a full https:// URL.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Avatar preview */}
              <div className="space-y-2">
                <FormField label="Profile / Avatar Image URL" value={current.profile_avatar_url} onChange={set("profile_avatar_url")} placeholder="/nguyen-hiep.png" />
                {current.profile_avatar_url && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-border/50 bg-muted">
                    <img src={current.profile_avatar_url} alt="avatar preview" className="w-full h-full object-cover object-top" onError={(e) => e.target.style.display = "none"} />
                  </div>
                )}
              </div>
              {/* Work image preview */}
              <div className="space-y-2">
                <FormField label="About Section Image URL" value={current.profile_work_image_url} onChange={set("profile_work_image_url")} placeholder="/Work.png" />
                {current.profile_work_image_url && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border/50 bg-muted">
                    <img src={current.profile_work_image_url} alt="work image preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Tagline */}
          <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
            <p className="font-heading font-semibold text-sm text-foreground mb-1">Hero Tagline</p>
            <p className="text-xs text-muted-foreground -mt-2">
              Renders as: <span className="text-foreground font-medium">"{current.hero_tagline_pre} / <span className="text-primary">{current.hero_tagline_highlight}</span> / {current.hero_tagline_post}"</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Line 1 (normal)" value={current.hero_tagline_pre}       onChange={set("hero_tagline_pre")}       placeholder="I build" />
              <FormField label="Line 2 (accent)"  value={current.hero_tagline_highlight} onChange={set("hero_tagline_highlight")} placeholder="AI & automation" />
              <FormField label="Line 3 (normal)" value={current.hero_tagline_post}      onChange={set("hero_tagline_post")}      placeholder="that ships" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
