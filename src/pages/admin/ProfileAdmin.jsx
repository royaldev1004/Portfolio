import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { settingsToObject } from "@/lib/experience-mappers";
import { Save, Loader2, User, Upload } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "./shared/AdminComponents";

const STORAGE_BUCKET = "portfolio-media";

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

/** Upload to Supabase Storage → public URL; updates parent via onUrlChange */
function ProfileImageSlot({
  title,
  description,
  folder,
  value,
  onUrlChange,
  previewClassName,
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    setUploading(true);
    try {
      const safeBase = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "image";
      const path = `${folder}/${Date.now()}-${safeBase}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      const publicUrl = pub?.publicUrl;
      if (!publicUrl) throw new Error("Could not get public URL");
      onUrlChange(publicUrl);
      toast.success("Image uploaded — click “Save changes” to persist.");
    } catch (err) {
      const msg = err?.message || "Upload failed";
      if (msg.includes("Bucket not found") || msg.includes("not found")) {
        toast.error("Storage bucket missing. Run the Storage section in supabase/schema.sql (bucket portfolio-media).");
      } else {
        toast.error(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
      <div>
        <p className="font-heading font-semibold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        <div
          className={`shrink-0 overflow-hidden border border-border/60 bg-background ${previewClassName}`}
          style={{ width: 120, height: 120 }}
        >
          {value ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover object-top"
              onError={(ev) => {
                ev.target.style.opacity = "0.3";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">No image</div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Upload new photo"}
          </button>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Files go to Supabase Storage (<code className="bg-muted px-1 rounded">{STORAGE_BUCKET}</code>). Max ~5 MB. Or paste a URL below.
          </p>
          <FormField
            label="Image URL (optional manual)"
            value={value}
            onChange={onUrlChange}
            placeholder="https://… or /file-in-public.png"
          />
        </div>
      </div>
    </div>
  );
}

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
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto">
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

          <div className="space-y-3">
            <div>
              <p className="font-heading font-semibold text-sm text-foreground">Images</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload new photos here, then press <span className="text-foreground font-medium">Save changes</span>. Hero uses the round portrait; About uses the wide shot.
              </p>
            </div>

            <ProfileImageSlot
              title="Hero — profile / avatar"
              description="Shown in the hero circle next to your name."
              folder="profile/avatar"
              value={current.profile_avatar_url}
              onUrlChange={set("profile_avatar_url")}
              previewClassName="rounded-full"
            />

            <ProfileImageSlot
              title="About section"
              description="Larger image in the About block."
              folder="profile/about"
              value={current.profile_work_image_url}
              onUrlChange={set("profile_work_image_url")}
              previewClassName="rounded-xl"
            />
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
            <p className="font-heading font-semibold text-sm text-foreground mb-1">Hero Tagline</p>
            <p className="text-xs text-muted-foreground -mt-2">
              Renders as: <span className="text-foreground font-medium">"{current.hero_tagline_pre} / <span className="text-primary">{current.hero_tagline_highlight}</span> / {current.hero_tagline_post}"</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Line 1 (normal)" value={current.hero_tagline_pre} onChange={set("hero_tagline_pre")} placeholder="I build" />
              <FormField label="Line 2 (accent)" value={current.hero_tagline_highlight} onChange={set("hero_tagline_highlight")} placeholder="AI & automation" />
              <FormField label="Line 3 (normal)" value={current.hero_tagline_post} onChange={set("hero_tagline_post")} placeholder="that ships" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
