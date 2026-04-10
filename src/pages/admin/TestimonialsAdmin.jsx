import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapTestimonialRow, testimonialToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ItemList, Modal } from "./shared/AdminComponents";

const EMPTY = { name: "", role: "", avatar: "", rating: 5, text: "", order: 0 };

function TestimonialModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Testimonial`} onClose={onClose}>
      <FormField label="Name" value={form.name} onChange={set("name")} placeholder="Client full name" />
      <FormField label="Role / Company" value={form.role} onChange={set("role")} placeholder="e.g. CEO, Acme Corp" />
      <FormField label="Avatar initials" value={form.avatar} onChange={set("avatar")} placeholder="e.g. JD" />
      <FormField label="Rating (1–5)" value={form.rating} onChange={(v) => set("rating")(Number(v))} type="number" />
      <FormField label="Testimonial text" value={form.text} onChange={set("text")} multiline placeholder="What they said about working with you…" />
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

export default function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["testimonials", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapTestimonialRow);
    },
  });

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = testimonialToSupabasePayload(form);
      if (form.id) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["testimonials"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "testimonials"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage title="Testimonials" description="Manage client reviews and social proof." onAdd={() => setModal({})}>
      <ItemList
        items={data} isLoading={isLoading} error={error?.message} onRetry={refetch}
        onEdit={setModal} onDelete={del}
        primaryKey="name" secondaryKey="role"
      />
      {modal !== null && (
        <TestimonialModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
