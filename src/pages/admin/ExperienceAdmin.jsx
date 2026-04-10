import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  mapWorkRow, mapEducationRow,
  workToSupabasePayload, educationToSupabasePayload,
} from "@/lib/experience-mappers";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, HighlightsInput, ItemList, Modal } from "./shared/AdminComponents";

function sortByOrder(items) {
  return [...items].sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
}

const EMPTY_WORK = { role: "", company: "", period: "", type: "Full-time", description: "", highlights: [], order: 0 };
const EMPTY_EDU = { degree: "", institution: "", period: "", description: "", order: 0 };

function WorkModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY_WORK);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Work Experience`} onClose={onClose}>
      <FormField label="Role / Title" value={form.role} onChange={set("role")} />
      <FormField label="Company" value={form.company} onChange={set("company")} />
      <FormField label="Period" value={form.period} onChange={set("period")} />
      <FormField label="Type" value={form.type} onChange={set("type")} options={["Full-time", "Part-time", "Freelance", "Contract", "Internship"]} />
      <FormField label="Description" value={form.description} onChange={set("description")} multiline />
      <HighlightsInput value={form.highlights} onChange={set("highlights")} />
      <FormField label="Display Order" value={form.order} onChange={(v) => set("order")(Number(v))} type="number" />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
        <button type="button" onClick={() => onSave(form)} disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
        </button>
      </div>
    </Modal>
  );
}

function EduModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY_EDU);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Education`} onClose={onClose}>
      <FormField label="Degree / Qualification" value={form.degree} onChange={set("degree")} />
      <FormField label="Institution" value={form.institution} onChange={set("institution")} />
      <FormField label="Period" value={form.period} onChange={set("period")} />
      <FormField label="Description" value={form.description} onChange={set("description")} multiline />
      <FormField label="Display Order" value={form.order} onChange={(v) => set("order")(Number(v))} type="number" />
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
        <button type="button" onClick={() => onSave(form)} disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
        </button>
      </div>
    </Modal>
  );
}

export default function ExperienceAdmin({ mode = "work" }) {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const isWork = mode === "work";

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: [isWork ? "work-experience" : "education", "supabase"],
    queryFn: async () => {
      const table = isWork ? "work_experience" : "education";
      const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return sortByOrder((data || []).map(isWork ? mapWorkRow : mapEducationRow));
    },
  });

  const save = async (form) => {
    setSaving(true);
    const table = isWork ? "work_experience" : "education";
    const payload = isWork ? workToSupabasePayload(form) : educationToSupabasePayload(form);
    try {
      if (form.id) {
        const { error } = await supabase.from(table).update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: [isWork ? "work-experience" : "education"] });
      await qc.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this entry?")) return;
    const table = isWork ? "work_experience" : "education";
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: [isWork ? "work-experience" : "education"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage
      title={isWork ? "Work Experience" : "Education"}
      description={isWork ? "Manage your career history." : "Manage your educational background."}
      onAdd={() => setModal({})}
    >
      <ItemList
        items={data}
        isLoading={isLoading}
        error={error?.message}
        onRetry={refetch}
        onEdit={setModal}
        onDelete={del}
        primaryKey={isWork ? "role" : "degree"}
        secondaryKey={isWork ? "company" : "institution"}
        tertiaryKey="period"
      />
      {modal !== null && isWork && (
        <WorkModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
      {modal !== null && !isWork && (
        <EduModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
