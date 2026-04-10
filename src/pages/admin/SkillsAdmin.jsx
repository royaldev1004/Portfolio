import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapSkillGroupRow, skillGroupToSupabasePayload } from "@/lib/experience-mappers";
import { Check, Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPage, FormField, HighlightsInput, ColorKeyField, Modal, ICON_OPTIONS, COLOR_THEME } from "./shared/AdminComponents";

const EMPTY_GROUP = { label: "", caption: "", iconName: "Globe", colorKey: "blue", order: 0 };

function GroupModal({ item, onClose, onSave, saving }) {
  const [form, setForm] = useState(item ? { ...item, skills: item.skills || [] } : { ...EMPTY_GROUP, skills: [] });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal title={`${item?.id ? "Edit" : "Add"} Skill Group`} onClose={onClose}>
      <FormField label="Group Label" value={form.label} onChange={set("label")} placeholder="e.g. AI Development" />
      <FormField label="Caption" value={form.caption} onChange={set("caption")} placeholder="e.g. Models & Deployment" />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Icon" value={form.iconName} onChange={set("iconName")} options={ICON_OPTIONS} />
        <FormField label="Display Order" value={form.order} onChange={(v) => set("order")(Number(v))} type="number" />
      </div>
      <ColorKeyField label="Color Theme" value={form.colorKey} onChange={set("colorKey")} />
      <HighlightsInput label="Skills (tools / languages)" value={form.skills} onChange={set("skills")} />
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

function GroupRow({ group, onEdit, onDelete, onAddSkill, onDeleteSkill }) {
  const [open, setOpen] = useState(false);
  const theme = COLOR_THEME[group.colorKey] || COLOR_THEME.blue;
  return (
    <div className="border border-border/70 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors">
        <button type="button" onClick={() => setOpen((o) => !o)} className="p-1 text-muted-foreground hover:text-foreground">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className={`w-7 h-7 rounded-lg ${theme.bg} flex items-center justify-center shrink-0`}>
          <span className={`text-[10px] font-bold ${theme.color}`}>{group.label?.[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-sm text-foreground">{group.label}</p>
          <p className={`font-mono text-[10px] uppercase tracking-wider ${theme.color}`}>{group.caption}</p>
        </div>
        <span className="font-mono text-xs text-muted-foreground/50 mr-2">{group.skills?.length || 0} skills</span>
        <button type="button" onClick={() => onEdit(group)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
        <button type="button" onClick={() => onDelete(group.id)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-destructive hover:text-destructive transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {open && (
        <div className="px-4 pb-3 pt-1 border-t border-border/60 bg-background/50">
          <div className="flex flex-wrap gap-2 mt-2">
            {(group.skills || []).map((skill, i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs border border-border/50">
                {skill}
                <button type="button" onClick={() => onDeleteSkill(group.id, group.skillRows?.[i]?.id, i)} className="text-muted-foreground hover:text-destructive ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Edit the group to add or rearrange skills.</p>
        </div>
      )}
    </div>
  );
}

export default function SkillsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: groups = [], isLoading, error, refetch } = useQuery({
    queryKey: ["skill-groups", "supabase"],
    queryFn: async () => {
      const { data: groupRows, error: gErr } = await supabase.from("skill_groups").select("*").order("sort_order");
      if (gErr) throw gErr;
      const { data: skillRows, error: sErr } = await supabase.from("skills").select("*").order("sort_order");
      if (sErr) throw sErr;
      return (groupRows || []).map((g) => {
        const mine = (skillRows || []).filter((s) => s.group_id === g.id);
        return mapSkillGroupRow(g, mine);
      });
    },
  });

  const save = async (form) => {
    setSaving(true);
    try {
      const payload = skillGroupToSupabasePayload(form);
      let groupId = form.id;
      if (groupId) {
        const { error } = await supabase.from("skill_groups").update(payload).eq("id", groupId);
        if (error) throw error;
        // Replace skills: delete all then re-insert
        await supabase.from("skills").delete().eq("group_id", groupId);
      } else {
        const { data, error } = await supabase.from("skill_groups").insert(payload).select().single();
        if (error) throw error;
        groupId = data.id;
      }
      if (form.skills?.length) {
        const skillInserts = form.skills.map((name, idx) => ({ group_id: groupId, skill_name: name, sort_order: idx }));
        const { error } = await supabase.from("skills").insert(skillInserts);
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["skill-groups"] });
      await qc.invalidateQueries({ queryKey: ["portfolio", "skills"] });
      toast.success("Saved");
      setModal(null);
    } catch (e) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this skill group and all its skills?")) return;
    try {
      const { error } = await supabase.from("skill_groups").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["skill-groups"] });
      toast.success("Deleted");
    } catch (e) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <AdminPage title="Skills" description="Manage skill groups and their tools." onAdd={() => setModal({})}>
      {isLoading && (
        <div className="flex items-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Loading…</span>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
          <p className="text-sm text-destructive mb-2">{error.message}</p>
          <button type="button" onClick={refetch} className="text-sm text-primary underline">Try again</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-3">
          {groups.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No skill groups yet.</p>}
          {groups.map((g) => (
            <GroupRow key={g.id} group={g} onEdit={setModal} onDelete={del} />
          ))}
        </div>
      )}
      {modal !== null && (
        <GroupModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={save} saving={saving} />
      )}
    </AdminPage>
  );
}
