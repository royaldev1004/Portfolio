// ── Work Experience ─────────────────────────────────────────

export function mapWorkRow(row) {
  let highlights = row.highlights;
  if (typeof highlights === "string") {
    try { highlights = JSON.parse(highlights); } catch { highlights = []; }
  }
  if (!Array.isArray(highlights)) highlights = [];
  return {
    id: row.id,
    role: row.role,
    company: row.company,
    period: row.period,
    type: row.employment_type ?? "Full-time",
    description: row.description ?? "",
    highlights,
    order: row.sort_order ?? 0,
  };
}

export function workToSupabasePayload(form) {
  return {
    role: form.role,
    company: form.company,
    period: form.period,
    employment_type: form.type ?? "Full-time",
    description: form.description ?? "",
    highlights: form.highlights ?? [],
    sort_order: Number(form.order) || 0,
  };
}

// ── Education ────────────────────────────────────────────────

export function mapEducationRow(row) {
  return {
    id: row.id,
    degree: row.degree,
    institution: row.institution,
    period: row.period,
    description: row.description ?? "",
    order: row.sort_order ?? 0,
  };
}

export function educationToSupabasePayload(form) {
  return {
    degree: form.degree,
    institution: form.institution,
    period: form.period,
    description: form.description ?? "",
    sort_order: Number(form.order) || 0,
  };
}

// ── Projects ─────────────────────────────────────────────────

export function mapProjectRow(row) {
  let tags = row.tech_tags;
  if (typeof tags === "string") {
    try { tags = JSON.parse(tags); } catch { tags = []; }
  }
  if (!Array.isArray(tags)) tags = [];

  let screenshots = row.screenshot_urls;
  if (typeof screenshots === "string") {
    try { screenshots = JSON.parse(screenshots); } catch { screenshots = []; }
  }
  if (!Array.isArray(screenshots)) screenshots = [];

  return {
    id: row.id,
    title: row.title,
    category: row.category ?? "",
    role: row.role ?? "",
    description: row.description ?? "",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    image: row.image_url ?? "",
    url: row.external_url ?? "",
    tier: row.project_tier ?? "noteworthy",
    workCategory: row.work_category ?? null,
    subcategory: row.subcategory ?? "",
    tags,
    screenshots,
    feedbackText: row.feedback_text ?? "",
    feedbackAuthor: row.feedback_author ?? "",
    tall: Boolean(row.tall),
    order: row.sort_order ?? 0,
  };
}

export function projectToSupabasePayload(form) {
  return {
    title: form.title,
    category: form.category ?? "",
    role: form.role ?? "",
    description: form.description ?? "",
    challenge: form.challenge ?? "",
    solution: form.solution ?? "",
    image_url: form.image ?? "",
    external_url: form.url ?? "",
    project_tier: form.tier ?? "noteworthy",
    work_category: form.workCategory ?? null,
    subcategory: form.subcategory ?? "",
    tech_tags: Array.isArray(form.tags) ? form.tags : [],
    screenshot_urls: Array.isArray(form.screenshots) ? form.screenshots : [],
    feedback_text: form.feedbackText ?? "",
    feedback_author: form.feedbackAuthor ?? "",
    tall: Boolean(form.tall),
    sort_order: Number(form.order) || 0,
  };
}

// ── Testimonials ─────────────────────────────────────────────

export function mapTestimonialRow(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    avatar: row.avatar ?? "",
    rating: row.rating ?? 5,
    text: row.text ?? "",
    order: row.sort_order ?? 0,
  };
}

export function testimonialToSupabasePayload(form) {
  return {
    name: form.name,
    role: form.role ?? "",
    avatar: form.avatar ?? "",
    rating: Number(form.rating) || 5,
    text: form.text ?? "",
    sort_order: Number(form.order) || 0,
  };
}

// ── Certifications ───────────────────────────────────────────

export function mapCertRow(row) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer ?? "",
    year: row.year ?? "",
    certId: row.cert_id ?? "",
    category: row.category ?? "",
    colorKey: row.color_key ?? "blue",
    order: row.sort_order ?? 0,
  };
}

export function certToSupabasePayload(form) {
  return {
    title: form.title,
    issuer: form.issuer ?? "",
    year: form.year ?? "",
    cert_id: form.certId ?? "",
    category: form.category ?? "",
    color_key: form.colorKey ?? "blue",
    sort_order: Number(form.order) || 0,
  };
}

// ── Skill Groups ─────────────────────────────────────────────

export function mapSkillGroupRow(row, skills = []) {
  return {
    id: row.id,
    label: row.label,
    caption: row.caption ?? "",
    iconName: row.icon_name ?? "Globe",
    colorKey: row.color_key ?? "blue",
    skills: skills.map((s) => s.skill_name),
    skillRows: skills,
    order: row.sort_order ?? 0,
  };
}

export function skillGroupToSupabasePayload(form) {
  return {
    label: form.label,
    caption: form.caption ?? "",
    icon_name: form.iconName ?? "Globe",
    color_key: form.colorKey ?? "blue",
    sort_order: Number(form.order) || 0,
  };
}

// ── Process Steps ────────────────────────────────────────────

export function mapProcessStepRow(row) {
  let details = row.details;
  if (typeof details === "string") {
    try { details = JSON.parse(details); } catch { details = []; }
  }
  if (!Array.isArray(details)) details = [];
  return {
    id: row.id,
    number: row.number_label ?? "01",
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    details,
    iconName: row.icon_name ?? "Compass",
    order: row.sort_order ?? 0,
  };
}

export function processStepToSupabasePayload(form) {
  return {
    number_label: form.number ?? "01",
    title: form.title,
    subtitle: form.subtitle ?? "",
    description: form.description ?? "",
    details: form.details ?? [],
    icon_name: form.iconName ?? "Compass",
    sort_order: Number(form.order) || 0,
  };
}

// ── About Stats ──────────────────────────────────────────────

export function mapAboutStatRow(row) {
  return {
    id: row.id,
    value: row.value,
    label: row.label,
    order: row.sort_order ?? 0,
  };
}

export function aboutStatToSupabasePayload(form) {
  return {
    value: form.value,
    label: form.label,
    sort_order: Number(form.order) || 0,
  };
}

// ── Site Settings ────────────────────────────────────────────

export function settingsToObject(rows) {
  return Object.fromEntries((rows || []).map((r) => [r.key, r.value]));
}

/** Three slot values for About “Recent work” pickers (empty = use auto fill). */
export function parseAboutRecentWorkSlots(raw) {
  let ids = [];
  try {
    ids = JSON.parse(raw || "[]");
  } catch {
    ids = [];
  }
  if (!Array.isArray(ids)) ids = [];
  return [0, 1, 2].map((i) => (ids[i] != null && String(ids[i]).trim() !== "" ? String(ids[i]) : ""));
}

export function serializeAboutRecentWorkSlots(slots) {
  const raw = [0, 1, 2].map((i) => (slots[i] && String(slots[i]).trim() ? String(slots[i]).trim() : ""));
  const seen = new Set();
  const ordered = [];
  for (const id of raw) {
    if (!id) continue;
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push(id);
    }
  }
  if (!ordered.length) return "[]";
  while (ordered.length < 3) ordered.push("");
  return JSON.stringify(ordered.slice(0, 3));
}

export function parseAboutRecentWorkIds(raw) {
  const slots = parseAboutRecentWorkSlots(raw).filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const id of slots) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }
  return unique;
}

/** Resolve up to 3 projects for About: ordered by saved ids, then fill from notable / all. */
export function resolveRecentWorkProjects(projects, idsJson) {
  const ids = parseAboutRecentWorkIds(idsJson);
  const byId = new Map(projects.map((p) => [String(p.id), p]));
  const picked = ids.map((id) => byId.get(String(id))).filter(Boolean);
  if (picked.length >= 3) return picked.slice(0, 3);
  const notable = projects.filter((p) => p.tier === "notable");
  const pool = notable.length >= 3 ? notable : projects;
  const seen = new Set(picked.map((p) => String(p.id)));
  for (const p of pool) {
    if (picked.length >= 3) break;
    const id = String(p.id);
    if (!seen.has(id)) {
      picked.push(p);
      seen.add(id);
    }
  }
  return picked.slice(0, 3);
}
