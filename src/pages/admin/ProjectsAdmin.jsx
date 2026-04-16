import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapProjectRow, projectToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2, Plus, Trash2, Upload, X, CloudUpload, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ToggleField, HighlightsInput } from "./shared/AdminComponents";

const STORAGE_BUCKET = "portfolio-media";

const DEFAULT_CATEGORIES = [
  { slug: "low-code", label: "Low-Code", sort_order: 0 },
  { slug: "ai-voice-agent", label: "AI Voice Agent", sort_order: 1 },
  { slug: "automation", label: "Automation", sort_order: 2 },
  { slug: "ghl", label: "GHL", sort_order: 3 },
];

const EMPTY = {
  title: "", category: "", role: "", description: "",
  image: "", screenshots: [], url: "", tier: "notable",
  workCategory: "", subcategory: "",
  challenge: "", solution: "",
  visible: true,
  tags: [], tall: false, order: 0,
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
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImageFile));
      onChange([...value, ...urls]);
      toast.success(`${urls.length} screenshot(s) uploaded.`);
    } catch (err) { handleUploadError(err); }
    finally { setUploading(false); }
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    await uploadFiles(files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    await uploadFiles(imageFiles);
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
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border/70 bg-muted/20"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center gap-1.5">
          <CloudUpload className="w-5 h-5 text-primary" />
          <p className="text-xs font-medium text-foreground">Drag & drop multiple screenshots here</p>
          <p className="text-[11px] text-muted-foreground">or use Upload files below</p>
        </div>
      </div>

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
function ProjectModal({ item, onClose, onSave, saving, categoryOptions }) {
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
            <FormField label="Role" value={form.role} onChange={set("role")} placeholder="e.g. CRM & AI Engineer" />
            <FormField label="Project Group" value={form.tier} onChange={set("tier")} options={["notable", "noteworthy"]} />
            <FormField
              label="Work Category (filter tab)"
              value={form.workCategory ?? ""}
              onChange={set("workCategory")}
              options={categoryOptions}
            />
            <FormField label="Subcategory (optional grouping)" value={form.subcategory ?? ""} onChange={set("subcategory")} placeholder="e.g. Medical Spa, eCommerce" />
            <FormField
              label="Description"
              value={form.description} onChange={set("description")}
              multiline placeholder="Short description of this project"
            />
            <FormField
              label="Challenge"
              value={form.challenge ?? ""} onChange={set("challenge")}
              multiline placeholder="What core challenge did this project solve?"
            />
            <FormField
              label="Solution"
              value={form.solution ?? ""} onChange={set("solution")}
              multiline placeholder="How did you solve it?"
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
            <ToggleField label="Visible on site" value={form.visible ?? true} onChange={set("visible")} />
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategorySlug, setEditingCategorySlug] = useState(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["projects", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["project-categories", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_categories").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) return DEFAULT_CATEGORIES;
      return data;
    },
  });

  const categoryOptions = useMemo(
    () => [{ value: "", label: "— None —" }, ...categories.map((c) => ({ value: c.slug, label: c.label }))],
    [categories],
  );

  useEffect(() => {
    if (selectedCategory === "all") return;
    const exists = categories.some((c) => c.slug === selectedCategory);
    if (!exists && selectedCategory !== "__uncategorized__") {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { all: data.length, __uncategorized__: data.filter((p) => !p.workCategory).length };
    for (const category of categories) {
      counts[category.slug] = data.filter((p) => p.workCategory === category.slug).length;
    }
    return counts;
  }, [data, categories]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return data;
    if (selectedCategory === "__uncategorized__") return data.filter((item) => !item.workCategory);
    return data.filter((item) => item.workCategory === selectedCategory);
  }, [data, selectedCategory]);

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

  const setVisibility = async (id, visible) => {
    try {
      const { error } = await supabase.from("projects").update({ is_visible: visible }).eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["portfolio", "projects"] });
      toast.success(visible ? "Project is now visible." : "Project hidden from public site.");
    } catch (e) {
      toast.error(e?.message || "Could not update visibility");
    }
  };

  const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const addCategory = async () => {
    const label = newCategoryLabel.trim();
    if (!label) return;
    const slug = slugify(label);
    if (!slug) {
      toast.error("Invalid category name");
      return;
    }
    if (categories.some((c) => c.slug === slug)) {
      toast.error("Category already exists");
      return;
    }

    setAddingCategory(true);
    try {
      const nextOrder = (categories[categories.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("project_categories").insert({
        slug,
        label,
        sort_order: nextOrder,
      });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["project-categories"] });
      setNewCategoryLabel("");
      setSelectedCategory(slug);
      toast.success("Category added");
    } catch (e) {
      toast.error(e?.message || "Could not add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const startEditCategory = (category) => {
    setEditingCategorySlug(category.slug);
    setEditingCategoryLabel(category.label);
  };

  const saveCategoryLabel = async () => {
    const label = editingCategoryLabel.trim();
    if (!editingCategorySlug || !label) return;
    setSavingCategory(true);
    try {
      const { error } = await supabase
        .from("project_categories")
        .update({ label })
        .eq("slug", editingCategorySlug);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["project-categories"] });
      toast.success("Category updated");
      setEditingCategorySlug(null);
      setEditingCategoryLabel("");
    } catch (e) {
      toast.error(e?.message || "Could not update category");
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!confirm(`Delete "${category.label}" category? Projects in this category will be moved to Uncategorized.`)) return;
    setSavingCategory(true);
    try {
      const { error: updateErr } = await supabase
        .from("projects")
        .update({ work_category: null })
        .eq("work_category", category.slug);
      if (updateErr) throw updateErr;

      const { error: deleteErr } = await supabase
        .from("project_categories")
        .delete()
        .eq("slug", category.slug);
      if (deleteErr) throw deleteErr;

      await qc.invalidateQueries({ queryKey: ["project-categories"] });
      await qc.invalidateQueries({ queryKey: ["projects"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "projects"] });
      if (selectedCategory === category.slug) setSelectedCategory("__uncategorized__");
      toast.success("Category deleted");
    } catch (e) {
      toast.error(e?.message || "Could not delete category");
    } finally {
      setSavingCategory(false);
    }
  };

  const setCategoryVisibility = async (category, visible) => {
    setSavingCategory(true);
    try {
      const { error } = await supabase
        .from("project_categories")
        .update({ is_visible: visible })
        .eq("slug", category.slug);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["project-categories"] });
      toast.success(visible ? "Category shown on frontend tabs." : "Category hidden from frontend tabs.");
    } catch (e) {
      toast.error(e?.message || "Could not update category visibility");
    } finally {
      setSavingCategory(false);
    }
  };

  return (
    <AdminPage title="Projects" description="Manage your work gallery." onAdd={() => setModal({})}>
      {isLoading ? (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
          <p className="text-sm text-destructive mb-2">{error?.message}</p>
          <button type="button" onClick={refetch} className="text-sm text-primary underline underline-offset-2">Try again</button>
        </div>
      ) : !data.length ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No entries yet. Click Add to create the first one.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="rounded-xl border border-border/70 bg-card p-4 h-fit">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Categories</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === "all" ? "bg-primary/10 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <span>All</span>
                <span className="text-xs">{categoryCounts.all ?? 0}</span>
              </button>
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className={`w-full rounded-lg border px-2 py-2 transition-colors ${
                    selectedCategory === category.slug
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {editingCategorySlug === category.slug ? (
                    <div className="space-y-2">
                      <input
                        value={editingCategoryLabel}
                        onChange={(e) => setEditingCategoryLabel(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-primary transition-colors"
                      />
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={saveCategoryLabel}
                          disabled={savingCategory || !editingCategoryLabel.trim()}
                          className="flex-1 text-[11px] px-2 py-1 rounded-md bg-primary text-primary-foreground disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategorySlug(null);
                            setEditingCategoryLabel("");
                          }}
                          className="text-[11px] px-2 py-1 rounded-md border border-border"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category.slug)}
                        className="w-full flex items-start justify-between gap-2 text-left"
                      >
                        <span className="text-sm leading-snug break-words">{category.label}</span>
                        <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full border border-border/70 bg-background/60">
                          {categoryCounts[category.slug] ?? 0}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => startEditCategory(category)}
                          className="h-7 px-2 rounded-md border border-border/70 inline-flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
                          aria-label={`Edit ${category.label}`}
                        >
                          <Pencil className="w-3 h-3" />
                          <span className="text-[11px]">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryVisibility(category, category.is_visible === false)}
                          disabled={savingCategory}
                          className="h-7 px-2 rounded-md border border-border/70 inline-flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                          aria-label={category.is_visible === false ? `Show ${category.label} on frontend` : `Hide ${category.label} on frontend`}
                          title={category.is_visible === false ? "Show on frontend tabs" : "Hide from frontend tabs"}
                        >
                          {category.is_visible === false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span className="text-[11px]">{category.is_visible === false ? "Show" : "Hide"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          disabled={savingCategory}
                          className="h-7 px-2 rounded-md border border-border/70 inline-flex items-center gap-1.5 hover:border-destructive hover:text-destructive transition-colors disabled:opacity-60"
                          aria-label={`Delete ${category.label}`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="text-[11px]">Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSelectedCategory("__uncategorized__")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === "__uncategorized__" ? "bg-primary/10 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <span>Uncategorized</span>
                <span className="text-xs">{categoryCounts.__uncategorized__ ?? 0}</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-border/70 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Add category</p>
              <input
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Category name"
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={addCategory}
                disabled={addingCategory || !newCategoryLabel.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
              >
                {addingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Category
              </button>
            </div>
          </aside>

          <div className="rounded-xl border border-border/70 bg-card overflow-hidden divide-y divide-border/70">
            {filteredProjects.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No projects in this category yet.</p>
            ) : filteredProjects.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground leading-snug">{item.title}</p>
                  <p className="font-mono text-xs text-primary mt-0.5 tracking-tight">{item.tier}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.role}</p>
                  <p className={`text-xs mt-1.5 ${item.visible === false ? "text-amber-500" : "text-emerald-500"}`}>
                    {item.visible === false ? "Hidden on frontend" : "Visible on frontend"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setVisibility(item.id, item.visible === false)}
                    className="h-8 px-2.5 rounded-full border border-border bg-background flex items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {item.visible === false ? (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-1" /> Show
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-1" /> Hide
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(item)}
                    className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => del(item.id)}
                    className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {modal !== null && (
        <ProjectModal
          item={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={save}
          saving={saving}
          categoryOptions={categoryOptions}
        />
      )}
    </AdminPage>
  );
}
