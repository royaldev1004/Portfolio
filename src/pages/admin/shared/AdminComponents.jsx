import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

// ── Page wrapper ─────────────────────────────────────────────
export function AdminPage({ title, description, onAdd, addLabel = "Add", children }) {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Manage</p>
          <h1 className="font-heading font-semibold text-2xl md:text-3xl text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          <div className="w-10 h-[0.5px] bg-primary/40 mt-4" />
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Generic item list ────────────────────────────────────────
export function ItemList({ items, isLoading, error, onRetry, onEdit, onDelete, primaryKey, secondaryKey, tertiaryKey }) {
  if (isLoading) return (
    <div className="flex items-center gap-3 py-16 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span className="text-sm">Loading…</span>
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
      <p className="text-sm text-destructive mb-2">{error}</p>
      {onRetry && <button type="button" onClick={onRetry} className="text-sm text-primary underline underline-offset-2">Try again</button>}
    </div>
  );

  if (!items.length) return (
    <p className="py-16 text-center text-sm text-muted-foreground">No entries yet. Click Add to create the first one.</p>
  );

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden divide-y divide-border/70">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-sm text-foreground leading-snug">{item[primaryKey]}</p>
            {secondaryKey && <p className="font-mono text-xs text-primary mt-0.5 tracking-tight">{item[secondaryKey]}</p>}
            {tertiaryKey && <p className="text-xs text-muted-foreground mt-0.5">{item[tertiaryKey]}</p>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => onDelete(item.id)}
              className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
              aria-label="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Modal wrapper ────────────────────────────────────────────
export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-card rounded-2xl border border-border w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto shadow-xl`}>
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h3 className="font-heading font-semibold text-base">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Form field ───────────────────────────────────────────────
export function FormField({ label, value, onChange, multiline, type = "text", options, placeholder }) {
  const cls = "w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors";
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-widest">{label}</label>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={cls}>
          {options.map((o) =>
            typeof o === "object"
              ? <option key={o.value} value={o.value}>{o.label}</option>
              : <option key={o}>{o}</option>
          )}
        </select>
      ) : multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className={`${cls} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

// ── Toggle field ─────────────────────────────────────────────
export function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</label>
      <button type="button" onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

// ── Highlights / string array input ─────────────────────────
export function HighlightsInput({ label = "Highlights", value = [], onChange }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim()) { onChange([...value, input.trim()]); setInput(""); } };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((h, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs border border-border/50">
            {h}
            <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add item & press Enter"
          className="flex-1 text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Color key selector ────────────────────────────────────────
export const COLOR_KEYS = ["blue","violet","emerald","amber","rose","sky","teal","orange","cyan","pink","indigo"];

export const COLOR_THEME = {
  blue:    { color: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  violet:  { color: "text-violet-500",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  emerald: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  amber:   { color: "text-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  rose:    { color: "text-rose-500",    bg: "bg-rose-500/10",    border: "border-rose-500/20" },
  sky:     { color: "text-sky-500",     bg: "bg-sky-500/10",     border: "border-sky-500/20" },
  teal:    { color: "text-teal-500",    bg: "bg-teal-500/10",    border: "border-teal-500/20" },
  orange:  { color: "text-orange-500",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  cyan:    { color: "text-cyan-500",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
  pink:    { color: "text-pink-500",    bg: "bg-pink-500/10",    border: "border-pink-500/20" },
  indigo:  { color: "text-indigo-500",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20" },
};

export function ColorKeyField({ label = "Color Theme", value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLOR_KEYS.map((k) => {
          const t = COLOR_THEME[k];
          return (
            <button key={k} type="button" onClick={() => onChange(k)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${t.border} ${t.color} ${t.bg} ${value === k ? "ring-2 ring-primary ring-offset-1" : "opacity-60 hover:opacity-100"}`}>
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Icon name selector ────────────────────────────────────────
export const ICON_OPTIONS = [
  "Globe","Bot","Cpu","Zap","Code2","Database","Smartphone","Settings",
  "Compass","Layers","TrendingUp","Award","Star","Briefcase","BookOpen",
  "BarChart","Lightbulb","Shield","Terminal","Rocket",
];
