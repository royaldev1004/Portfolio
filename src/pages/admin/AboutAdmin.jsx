import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapAboutStatRow, aboutStatToSupabasePayload, settingsToObject } from "@/lib/experience-mappers";
import { Check, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, ToggleField, ItemList, Modal } from "./shared/AdminComponents";

const EMPTY_STAT = { value: "", label: "", order: 0 };

function StatModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item || EMPTY_STAT);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Stat`} onClose={onClose}>
      <FormField label="Value" value={form.value} onChange={set("value")} placeholder="e.g. 8+" />
      <FormField label="Label" value={form.label} onChange={set("label")} placeholder="e.g. Years Experience" />
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

function BioEditor() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const [form, setForm] = useState(null);
  const current = form ?? settings ?? {};
  const set = (k) => (v) => setForm((f) => ({ ...(f ?? settings ?? {}), [k]: v }));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const upserts = Object.entries(form).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "about"] });
      toast.success("About content saved");
      setForm(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center gap-3 py-8 text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="text-sm">Loading…</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-heading font-semibold text-sm text-foreground">Bio & Availability</p>
        {form && (
          <button type="button" onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save changes
          </button>
        )}
      </div>
      <FormField label="Bio paragraph 1" value={current.about_bio_1 ?? ""} onChange={set("about_bio_1")} multiline />
      <FormField label="Bio paragraph 2" value={current.about_bio_2 ?? ""} onChange={set("about_bio_2")} multiline />
      <FormField label="Bio paragraph 3" value={current.about_bio_3 ?? ""} onChange={set("about_bio_3")} multiline />
      <div className="pt-2 border-t border-border/50">
        <ToggleField
          label="Available for new work"
          value={current.about_available === "true"}
          onChange={(v) => set("about_available")(v ? "true" : "false")}
        />
        <div className="mt-3">
          <FormField label="Availability badge — main text" value={current.about_available_text ?? ""} onChange={set("about_available_text")} placeholder="I'm taking new work" />
        </div>
        <div className="mt-3">
          <FormField label="Availability badge — sub text" value={current.about_available_sub ?? ""} onChange={set("about_available_sub")} placeholder="Freelance & consulting" />
        </div>
      </div>
    </div>
  );
}

export default function AboutAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: stats = [], isLoading, error, refetch } = useQuery({
    queryKey: ["about-stats", "supabase"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_stats").select("*").order("sort_order");
      if (error) throw error;
      return (data || []).map(mapAboutStatRow);
    },
  });

  const saveStat = async (form) => {
    setSaving(true);
    try {
      const payload = aboutStatToSupabasePayload(form);
      if (form.id) {
        const { error } = await supabase.from("about_stats").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_stats").insert(payload);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["about-stats"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "about"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const delStat = async (id) => {
    if (!confirm("Delete this stat?")) return;
    try {
      const { error } = await supabase.from("about_stats").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["about-stats"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Manage</p>
        <h1 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">About &amp; Stats</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit your bio text, availability status, and stats cards.</p>
        <div className="w-10 h-[0.5px] bg-primary/40 mt-4" />
      </div>

      <BioEditor />

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-heading font-semibold text-sm text-foreground">Stats</p>
          <button type="button" onClick={() => setModal({})}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            + Add Stat
          </button>
        </div>
        <ItemList
          items={stats} isLoading={isLoading} error={error?.message} onRetry={refetch}
          onEdit={setModal} onDelete={delStat}
          primaryKey="value" secondaryKey="label"
        />
      </div>

      {modal !== null && (
        <StatModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={saveStat} saving={saving} />
      )}
    </div>
  );
}
