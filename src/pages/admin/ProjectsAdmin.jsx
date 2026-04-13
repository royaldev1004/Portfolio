import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapProjectRow, projectToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ToggleField, HighlightsInput, ItemList, Modal } from "./shared/AdminComponents";

const STORAGE_BUCKET = "portfolio-media";

const EMPTY = { title: "", category: "", role: "", description: "", image: "", url: "", tier: "notable", tags: [], tall: false, order: 0 };

function ProjectImageField({ value, onChange }) {
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
      const path = `projects/${Date.now()}-${safeBase}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      const publicUrl = pub?.publicUrl;
      if (!publicUrl) throw new Error("Could not get public URL");
      onChange(publicUrl);
      toast.success("Image uploaded — click Save to store it on this project.");
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
        <p className="font-heading font-semibold text-sm text-foreground">Project image</p>
        <p className="text-xs text-muted-foreground mt-0.5">Upload a file or paste an image URL (e.g. OG image from a site).</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        <div className="shrink-0 w-full max-w-[220px] aspect-video overflow-hidden border border-border/60 bg-background rounded-lg">
          {value ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
              onError={(ev) => {
                ev.target.style.opacity = "0.3";
              }}
            />
          ) : (
            <div className="w-full h-full min-h-[96px] flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
              No preview
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Files are stored in Supabase Storage (<code className="bg-muted px-1 rounded">{STORAGE_BUCKET}</code>
            /projects). Max ~5 MB recommended.
          </p>
          <FormField label="Image URL" value={value} onChange={onChange} placeholder="https://…" />
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Project`} onClose={onClose}>
      <FormField label="Title" value={form.title} onChange={set("title")} placeholder="Project title" />
      <FormField label="Category" value={form.category} onChange={set("category")} placeholder="e.g. Brand & product" />
      <FormField label="Role" value={form.role} onChange={set("role")} placeholder="e.g. I led design" />
      <FormField label="Project Group" value={form.tier} onChange={set("tier")} options={["notable", "noteworthy"]} />
      <FormField label="Description" value={form.description} onChange={set("description")} multiline placeholder="Short description of this project" />
      <HighlightsInput label="Tech tags" value={form.tags || []} onChange={set("tags")} />
      <ProjectImageField value={form.image} onChange={set("image")} />
      <FormField label="Company / project URL" value={form.url} onChange={set("url")} placeholder="https://…" />
      <ToggleField label="Tall card (taller image)" value={form.tall} onChange={set("tall")} />
      <FormField label="Display Order" value={form.order} onChange={(v) => set("order")(Number(v))} type="number" />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
        <button type="button" onClick={() => onSave(form)} disabled={saving}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
        </button>
      </div>
    </Modal>
  );
}

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
