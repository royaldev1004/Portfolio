import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  mapAboutStatRow,
  mapProjectRow,
  aboutStatToSupabasePayload,
  parseAboutRecentWorkSlots,
  serializeAboutRecentWorkSlots,
  settingsToObject,
} from "@/lib/experience-mappers";
import { Check, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { FormField, ToggleField, ItemList, Modal } from "./shared/AdminComponents";

const selectCls =
  "w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors";

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

function RecentWorkEditor() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState(null);

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["portfolio", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProjectRow);
    },
  });

  const baseSlots = useMemo(
    () => parseAboutRecentWorkSlots(settings?.about_recent_work_project_ids),
    [settings?.about_recent_work_project_ids],
  );
  const displaySlots = slots ?? baseSlots;
  const dirty = slots !== null;

  const setSlot = (index, value) => {
    setSlots((prev) => {
      const next = [...(prev ?? baseSlots)];
      next[index] = value;
      return next;
    });
  };

  const save = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      const value = serializeAboutRecentWorkSlots(slots);
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "about_recent_work_project_ids", value }, { onConflict: "key" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "about"] });
      toast.success("Recent work selection saved");
      setSlots(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center gap-3 py-8 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="font-heading font-semibold text-sm text-foreground">Recent work (About page)</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Choose up to three projects for the About card. Titles, descriptions, and links come from each project — edit them in{" "}
            <Link to="/admin/projects" className="text-primary hover:underline underline-offset-2">
              Projects
            </Link>
            . Leave a row on <span className="text-foreground/90">Auto</span> to fill from your first notable projects (or all projects if needed).
          </p>
        </div>
        {dirty && (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save recent work
          </button>
        )}
      </div>

      {loadingProjects ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          No projects yet. Add some under <Link to="/admin/projects" className="text-primary hover:underline">Projects</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-widest">
                About card — project {i + 1}
              </label>
              <select
                className={selectCls}
                value={displaySlots[i] || ""}
                onChange={(e) => setSlot(i, e.target.value)}
              >
                <option value="">Auto (first notable projects)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
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
      <div className="pt-1 pb-2 border-b border-border/50 space-y-3">
        <p className="text-xs font-medium text-foreground">About card (public page)</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Use <code className="bg-muted px-1 rounded">{`{name}`}</code> in the intro line where the highlighted name should appear.
        </p>
        <FormField
          label="Intro line (with optional {name})"
          value={current.about_intro ?? ""}
          onChange={set("about_intro")}
          multiline
          placeholder="Hello! My name is {name}, and I am passionate about…"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Section number" value={current.about_section_number ?? ""} onChange={set("about_section_number")} placeholder="01." />
          <FormField label="Section title" value={current.about_section_title ?? ""} onChange={set("about_section_title")} placeholder="About Me" />
        </div>
        <FormField label="Recent Work divider label" value={current.about_recent_work_label ?? ""} onChange={set("about_recent_work_label")} placeholder="Recent Work" />
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
        <p className="text-sm text-muted-foreground mt-1">Edit your bio, About card copy, recent-work picks, availability, and stats.</p>
        <div className="w-10 h-[0.5px] bg-primary/40 mt-4" />
      </div>

      <BioEditor />

      <RecentWorkEditor />

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
