import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapProjectRow, projectToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ToggleField, ItemList, Modal } from "./shared/AdminComponents";

const EMPTY = { title: "", category: "", role: "", description: "", image: "", url: "", tall: false, order: 0 };

function ProjectModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Project`} onClose={onClose}>
      <FormField label="Title" value={form.title} onChange={set("title")} placeholder="Project title" />
      <FormField label="Category" value={form.category} onChange={set("category")} placeholder="e.g. Brand & product" />
      <FormField label="Role" value={form.role} onChange={set("role")} placeholder="e.g. I led design" />
      <FormField label="Description" value={form.description} onChange={set("description")} multiline placeholder="Short description of this project" />
      <FormField label="Image URL" value={form.image} onChange={set("image")} placeholder="https://…" />
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
        primaryKey="title" secondaryKey="category" tertiaryKey="role"
      />
      {modal !== null && (
        <ProjectModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
