import { useState } from "react";
import type { Project, ProjectPosition, TimelineMilestone } from "../data/types";
import type { TechItem } from "../lib/techGraph";
import {
  Checkbox,
  Field,
  ImageField,
  Select,
  StringList,
  TextArea,
  TextInput,
  inputClass,
} from "./fields";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function FormActions({ onCancel, saving }: { onCancel: () => void; saving: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:text-text"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:shadow-glow disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "in-progress", label: "In progress" },
  { value: "prototype", label: "Prototype" },
];
const POSITION_OPTIONS: { value: ProjectPosition; label: string }[] = [
  { value: "observatory", label: "Projects Observatory only" },
  { value: "gallery", label: "Gallery only" },
  { value: "both", label: "Both" },
];

export function ProjectForm({
  initial,
  defaultPosition,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Project;
  defaultPosition: ProjectPosition;
  onSave: (p: Project) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [p, setP] = useState<Project>(() =>
    initial
      ? { ...initial, links: { ...initial.links } }
      : {
          slug: "",
          title: "",
          oneLiner: "",
          status: "live",
          featured: false,
          position: defaultPosition,
          image: "",
          alt: "",
          links: {},
          overview: "",
          stack: [],
          features: [],
        }
  );
  const set = (patch: Partial<Project>) => setP((prev) => ({ ...prev, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.title.trim()) {
      alert("Title is required");
      return;
    }
    const slug = p.slug.trim() || slugify(p.title);
    if (!slug) {
      alert("A slug is required — set one or a title to auto-generate it.");
      return;
    }
    onSave({
      ...p,
      slug,
      links: {
        live: p.links.live?.trim() || undefined,
        repo: p.links.repo?.trim() || undefined,
      },
      image: p.image.trim(),
      alt: p.alt.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <TextInput value={p.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field label="Slug" hint="Auto-generated from the title if left blank.">
          <TextInput value={p.slug} onChange={(v) => set({ slug: v })} />
        </Field>
      </div>
      <Field label="One-liner">
        <TextInput value={p.oneLiner} onChange={(v) => set({ oneLiner: v })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status">
          <Select
            value={p.status}
            onChange={(v) => set({ status: v as Project["status"] })}
            options={STATUS_OPTIONS}
          />
        </Field>
        <Field label="Where it appears">
          <Select
            value={p.position}
            onChange={(v) => set({ position: v as ProjectPosition })}
            options={POSITION_OPTIONS}
          />
        </Field>
        <div className="flex items-end pb-2">
          <Checkbox
            label="Featured (large tile)"
            checked={p.featured}
            onChange={(v) => set({ featured: v })}
          />
        </div>
      </div>
      <ImageField
        label="Photo"
        hint="Paste a URL or upload a photo (compressed and stored in the DB)."
        value={p.image}
        onChange={(v) => set({ image: v })}
      />
      <Field label="Alt text">
        <TextInput value={p.alt} onChange={(v) => set({ alt: v })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL">
          <TextInput value={p.links.live ?? ""} onChange={(v) => set({ links: { ...p.links, live: v } })} />
        </Field>
        <Field label="Repo URL">
          <TextInput value={p.links.repo ?? ""} onChange={(v) => set({ links: { ...p.links, repo: v } })} />
        </Field>
      </div>
      <Field label="Overview">
        <TextArea rows={4} value={p.overview} onChange={(v) => set({ overview: v })} />
      </Field>
      <Field label="Architecture">
        <TextArea rows={3} value={p.architecture ?? ""} onChange={(v) => set({ architecture: v })} />
      </Field>
      <Field label="Lessons">
        <TextArea rows={3} value={p.lessons ?? ""} onChange={(v) => set({ lessons: v })} />
      </Field>
      <Field label="Stack">
        <StringList values={p.stack} onChange={(v) => set({ stack: v })} placeholder="Add a technology…" />
      </Field>
      <Field label="Features">
        <StringList values={p.features ?? []} onChange={(v) => set({ features: v })} placeholder="Add a feature…" />
      </Field>
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

const MISSION_STATUS_OPTIONS = [
  { value: "complete", label: "Mission Complete" },
  { value: "live", label: "Active Mission" },
  { value: "future", label: "Uncharted" },
];

export function MissionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: TimelineMilestone;
  onSave: (m: TimelineMilestone) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [m, setM] = useState<TimelineMilestone>(() =>
    initial
      ? {
          ...initial,
          links: { ...initial.links },
          certificate: initial.certificate ? { ...initial.certificate } : undefined,
        }
      : {
          id: 0,
          mission: "",
          chapter: "",
          chapterLabel: "",
          year: "",
          title: "",
          detail: "",
          badge: "",
          status: "complete",
          stack: [],
          links: {},
        }
  );
  const set = (patch: Partial<TimelineMilestone>) =>
    setM((prev) => ({ ...prev, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!m.mission.trim()) {
      alert("Mission number is required (e.g. 008)");
      return;
    }
    if (!m.title.trim()) {
      alert("Title is required");
      return;
    }
    onSave(m);
  };

  const cert = m.certificate;

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Mission number *" hint="e.g. 008">
          <TextInput value={m.mission} onChange={(v) => set({ mission: v })} />
        </Field>
        <Field label="Title *">
          <TextInput value={m.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field label="Year">
          <TextInput value={m.year} onChange={(v) => set({ year: v })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Chapter" hint="Planet, e.g. Saturn">
          <TextInput value={m.chapter} onChange={(v) => set({ chapter: v })} />
        </Field>
        <Field label="Chapter label" hint="HUD label, e.g. Rings">
          <TextInput value={m.chapterLabel} onChange={(v) => set({ chapterLabel: v })} />
        </Field>
        <Field label="Badge" hint="Achievement, e.g. Certified">
          <TextInput value={m.badge} onChange={(v) => set({ badge: v })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <Select
            value={m.status}
            onChange={(v) => set({ status: v as TimelineMilestone["status"] })}
            options={MISSION_STATUS_OPTIONS}
          />
        </Field>
        <Field label="Stack">
          <StringList values={m.stack} onChange={(v) => set({ stack: v })} placeholder="Add a technology…" />
        </Field>
      </div>
      <Field label="Detail">
        <TextArea rows={4} value={m.detail} onChange={(v) => set({ detail: v })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL">
          <TextInput value={m.links.live ?? ""} onChange={(v) => set({ links: { ...m.links, live: v } })} />
        </Field>
        <Field label="Repo URL">
          <TextInput value={m.links.repo ?? ""} onChange={(v) => set({ links: { ...m.links, repo: v } })} />
        </Field>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">
          Certificate (optional)
        </p>
        <div className="grid gap-4">
          <ImageField
            label="Certificate image"
            value={cert?.image ?? ""}
            onChange={(v) => set({ certificate: { image: v, alt: cert?.alt ?? "", ...(cert ?? {}) } })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="PDF link">
              <TextInput
                value={cert?.pdf ?? ""}
                onChange={(v) => set({ certificate: { image: cert?.image ?? "", alt: cert?.alt ?? "", pdf: v } })}
              />
            </Field>
            <Field label="Caption">
              <TextInput
                value={cert?.caption ?? ""}
                onChange={(v) => set({ certificate: { image: cert?.image ?? "", alt: cert?.alt ?? "", caption: v } })}
              />
            </Field>
          </div>
          <Field label="Alt text">
            <TextInput
              value={cert?.alt ?? ""}
              onChange={(v) => set({ certificate: { image: cert?.image ?? "", alt: v, ...(cert ?? {}) } })}
            />
          </Field>
        </div>
      </div>

      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

export function TechForm({
  initial,
  projects,
  onSave,
  onCancel,
  saving,
}: {
  initial?: TechItem;
  projects: Project[];
  onSave: (t: TechItem) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [t, setT] = useState<TechItem>(() =>
    initial
      ? { ...initial, projects: [...initial.projects] }
      : { name: "", icon: null, count: 1, projects: [] }
  );
  const set = (patch: Partial<TechItem>) => setT((prev) => ({ ...prev, ...patch }));

  const toggleProject = (slug: string) => {
    const has = t.projects.includes(slug);
    set({
      projects: has
        ? t.projects.filter((s) => s !== slug)
        : [...t.projects, slug],
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t.name.trim()) {
      alert("Technology name is required");
      return;
    }
    onSave({ ...t, name: t.name.trim() });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Name *">
          <TextInput value={t.name} onChange={(v) => set({ name: v })} />
        </Field>
        <Field label="Icon path" hint="e.g. /devicons/react.svg — blank for a text chip.">
          <TextInput value={t.icon ?? ""} onChange={(v) => set({ icon: v.trim() || null })} />
        </Field>
        <Field label="Prominence" hint="Higher shows it larger/earlier.">
          <input
            className={inputClass}
            type="number"
            min={1}
            value={t.count}
            onChange={(e) =>
              set({ count: Math.max(1, Number(e.target.value) || 1) })
            }
          />
        </Field>
      </div>
      <Field label="Used by (projects)">
        {projects.length === 0 ? (
          <p className="text-xs text-muted/70">
            No projects yet — add some in the Projects tab first.
          </p>
        ) : (
          <div className="grid max-h-56 gap-1 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2">
            {projects.map((p) => (
              <label
                key={p.slug}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={t.projects.includes(p.slug)}
                  onChange={() => toggleProject(p.slug)}
                  className="h-4 w-4 rounded accent-primary"
                />
                {p.title}
              </label>
            ))}
          </div>
        )}
      </Field>
      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  );
}
