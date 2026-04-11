import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapProcessStepRow, processStepToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, HighlightsInput, ItemList, Modal, ICON_OPTIONS } from "./shared/AdminComponents";

const EMPTY = { number: "01", title: "", subtitle: "", description: "", details: [], iconName: "Compass", order: 0 };

function ProcessModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Process Step`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Step Number" value={form.number} onChange={set("number")} placeholder="01" />
        <FormField label="Icon" value={form.iconName} onChange={set("iconName")} options={ICON_OPTIONS} />
      </div>
      <FormField label="Title" value={form.title} onChange={set("title")} placeholder="e.g. Understand" />
      <FormField label="Subtitle" value={form.subtitle} onChange={set("subtitle")} placeholder="e.g. Phase 1 · Scope & risk" />
      <FormField label="Description" value={form.description} onChange={set("description")} multiline placeholder="Brief description of this phase…" />
      <HighlightsInput label="Details (bullet points)" value={form.details} onChange={set("details")} />
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

export default function ProcessAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["process-steps", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("process_steps").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProcessStepRow);
    },
  });

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = processStepToSupabasePayload(form);
      if (form.id) {
        const { error } = await supabase.from("process_steps").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("process_steps").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["process-steps"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "process"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this step?")) return;
    try {
      const { error } = await supabase.from("process_steps").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["process-steps"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage title="Process Steps" description="Manage your workflow / process section." onAdd={() => setModal({})}>
      <ItemList
        items={data} isLoading={isLoading} error={error?.message} onRetry={refetch}
        onEdit={setModal} onDelete={del}
        primaryKey="title" secondaryKey="subtitle" tertiaryKey="number"
      />
      {modal !== null && (
        <ProcessModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
