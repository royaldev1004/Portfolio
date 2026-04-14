import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapProjectRow, projectToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ToggleField, HighlightsInput, ItemList } from "./shared/AdminComponents";

const STORAGE_BUCKET = "portfolio-media";

const EMPTY = {
  title: "", category: "", role: "", description: "",
  image: "", screenshots: [], url: "", tier: "notable", tags: [], tall: false, order: 0,
  feedbackText: "", feedbackAuthor: "",
};

// ── Upload a single image file to Supabase Storage ─────────────────────────
async function uploadImageFile(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPEG, PNG, WebP, or GIF).");
  const safeBase = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "image";
  const path = `projects/${Date.now()}-${safeBase}`;
  const { error: upErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  if (!pub?.publicUrl) throw new Error("Could not get public URL");
  return pub.publicUrl;
}

function handleUploadError(err) {
  const msg = err?.message || "Upload failed";
  if (msg.includes("Bucket not found") || msg.includes("not found")) {
    toast.error("Storage bucket missing. Run the Storage section in supabase/schema.sql.");
  } else {
    toast.error(msg);
  }
}

// ── Cover image panel ──────────────────────────────────────────────────────
function CoverImagePanel({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImageFile(file));
      toast.success("Cover image uploaded.");
    } catch (err) { handleUploadError(err); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Cover image</p>

      {/* Preview */}
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-border/60 bg-muted/30 flex items-center justify-center">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity = "0.3"; }} />
        ) : (
          <span className="text-xs text-muted-foreground">No preview</span>
        )}
      </div>

      {/* Upload button */}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
      <button
        type="button" disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "Uploading…" : "Upload cover"}
      </button>

      {/* Manual URL fallback */}
      <FormField label="Or paste image URL" value={value} onChange={onChange} placeholder="https://…" />
    </div>
  );
}

// ── Screenshots gallery panel ──────────────────────────────────────────────
function ScreenshotsPanel({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImageFile));
      onChange([...value, ...urls]);
      toast.success(`${urls.length} screenshot(s) uploaded.`);
    } catch (err) { handleUploadError(err); }
    finally { setUploading(false); }
  };

  const addUrl = () => onChange([...value, ""]);
  const updateUrl = (i, v) => { const next = [...value]; next[i] = v; onChange(next); };
  const removeUrl = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Screenshots <span className="normal-case font-normal">(detail page gallery)</span></p>

      {/* Thumbnail grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {value.map((url, i) => (
            <div key={i} className="space-y-1">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border/60 bg-muted/30">
                {url ? (
                  <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity = "0.3"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No preview</div>
                )}
                <button
                  type="button" onClick={() => removeUrl(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text" value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="https://…"
                className="w-full text-[10px] px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handleFiles} />
        <button
          type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading…" : "Upload files"}
        </button>
        <button
          type="button" onClick={addUrl}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-secondary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add URL
        </button>
      </div>
    </div>
  );
}

// ── Two-column project modal ───────────────────────────────────────────────
function ProjectModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-heading font-semibold text-base">{item?.id ? "Edit Project" : "Add New Project"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Fill in the details on the left, manage images on the right.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — two columns */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">

          {/* Left — fields */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 lg:border-r lg:border-border">
            <FormField label="Title" value={form.title} onChange={set("title")} placeholder="Project title" />
            <FormField label="Category" value={form.category} onChange={set("category")} placeholder="e.g. Brand & product" />
            <FormField label="Role" value={form.role} onChange={set("role")} placeholder="e.g. Lead Developer" />
            <FormField label="Project Group" value={form.tier} onChange={set("tier")} options={["notable", "noteworthy"]} />
            <FormField
              label="Description"
              value={form.description} onChange={set("description")}
              multiline placeholder="Short description of this project"
            />
            <HighlightsInput label="Tech tags" value={form.tags || []} onChange={set("tags")} />
            <FormField
              label="Client feedback (detail page)"
              value={form.feedbackText} onChange={set("feedbackText")}
              multiline placeholder="Short testimonial shown under project screenshots"
            />
            <FormField
              label="Feedback author (optional)"
              value={form.feedbackAuthor} onChange={set("feedbackAuthor")}
              placeholder="e.g. Product Lead, Acme Corp"
            />
            <FormField
              label="Live demo URL (optional)"
              value={form.url} onChange={set("url")}
              placeholder="https://… (leave blank if no link)"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Display Order" value={form.order} onChange={(v) => set("order")(Number(v))} type="number" />
              <ToggleField label="Tall card" value={form.tall} onChange={set("tall")} />
            </div>
          </div>

          {/* Right — images */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 overflow-y-auto p-6 space-y-6 bg-muted/20">
            <CoverImagePanel value={form.image} onChange={set("image")} />
            <div className="h-px bg-border/60" />
            <ScreenshotsPanel value={form.screenshots || []} onChange={set("screenshots")} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button
            type="button" onClick={() => onSave(form)} disabled={saving}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save project
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProjectsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["projects", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = projectToSupabasePayload(form);
      if (form.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["projects"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "projects"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["portfolio", "projects"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage title="Projects" description="Manage your work gallery." onAdd={() => setModal({})}>
      <ItemList
        items={data} isLoading={isLoading} error={error?.message} onRetry={refetch}
        onEdit={setModal} onDelete={del}
        primaryKey="title" secondaryKey="tier" tertiaryKey="role"
      />
      {modal !== null && (
        <ProjectModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
