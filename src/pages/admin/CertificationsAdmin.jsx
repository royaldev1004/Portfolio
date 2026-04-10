import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapCertRow, certToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ColorKeyField, ItemList, Modal } from "./shared/AdminComponents";

const EMPTY = { title: "", issuer: "", year: "", certId: "", category: "", colorKey: "blue", order: 0 };

function CertModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Certification`} onClose={onClose}>
      <FormField label="Title" value={form.title} onChange={set("title")} placeholder="Certification name" />
      <FormField label="Issuer" value={form.issuer} onChange={set("issuer")} placeholder="e.g. Amazon Web Services" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Year" value={form.year} onChange={set("year")} placeholder="2024" />
        <FormField label="Certificate ID" value={form.certId} onChange={set("certId")} placeholder="e.g. AWS-DEV-2024" />
      </div>
      <FormField label="Category" value={form.category} onChange={set("category")} placeholder="e.g. Cloud, AI / ML" />
      <ColorKeyField label="Color Theme" value={form.colorKey} onChange={set("colorKey")} />
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

export default function CertificationsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["certifications", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapCertRow);
    },
  });

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = certToSupabasePayload(form);
      if (form.id) {
        const { error } = await supabase.from("certifications").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certifications").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["certifications"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "certifications"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this certification?")) return;
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage title="Certifications" description="Manage your verified credentials and licenses." onAdd={() => setModal({})}>
      <ItemList
        items={data} isLoading={isLoading} error={error?.message} onRetry={refetch}
        onEdit={setModal} onDelete={del}
        primaryKey="title" secondaryKey="issuer" tertiaryKey="year"
      />
      {modal !== null && (
        <CertModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
