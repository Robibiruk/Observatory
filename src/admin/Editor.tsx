import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Database,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type {
  Project,
  ProjectPosition,
  TimelineMilestone,
} from "../data/types";
import { museumProjects } from "../data/projects";
import { timeline as localTimeline } from "../data/timeline";
import { deriveTechFromProjects, type TechItem } from "../lib/techGraph";
import { useContent } from "../lib/store";
import { MissionForm, ProjectForm, TechForm } from "./forms";
import {
  ApiError,
  createItem,
  deleteItem,
  reorderItems,
  seedItems,
  updateItem,
} from "./api";

type TabKey = "projects" | "missions" | "gallery" | "tech";
type FormKind = "project" | "mission" | "tech";

const TABS: { key: TabKey; label: string }[] = [
  { key: "projects", label: "Projects Observatory" },
  { key: "missions", label: "Missions" },
  { key: "gallery", label: "Gallery" },
  { key: "tech", label: "Technology" },
];

const byOrder = <T extends { sortOrder?: number }>(list: T[]): T[] =>
  [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-text">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-text hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type RowProps = {
  title: string;
  subtitle: string;
  thumb: string | null;
  chip: string | null;
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canUp: boolean;
  canDown: boolean;
};

function ItemRow({
  title,
  subtitle,
  thumb,
  chip,
  onUp,
  onDown,
  onEdit,
  onDelete,
  canUp,
  canDown,
}: RowProps) {
  const btn =
    "grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted hover:text-text disabled:opacity-30";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className="h-12 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
        />
      ) : (
        <div className="grid h-12 w-16 shrink-0 place-items-center rounded-lg bg-white/5 text-muted">
          <ImageIcon size={16} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-text">{title}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>
      {chip && (
        <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary sm:inline-block">
          {chip}
        </span>
      )}
      <div className="flex shrink-0 flex-col">
        <button className={btn} onClick={onUp} disabled={!canUp} aria-label="Move up">
          <ChevronUp size={14} />
        </button>
        <button className={btn} onClick={onDown} disabled={!canDown} aria-label="Move down">
          <ChevronDown size={14} />
        </button>
      </div>
      <button className={btn} onClick={onEdit} aria-label="Edit">
        <Pencil size={14} />
      </button>
      <button
        className={`${btn} hover:text-red-400`}
        onClick={onDelete}
        aria-label="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function Editor({ onLogout }: { onLogout: () => void }) {
  const {
    projects: allProjects,
    missions: allMissions,
    tech: allTech,
    fromDb,
    refresh,
  } = useContent();

  const [tab, setTab] = useState<TabKey>("projects");
  const [modal, setModal] = useState<{
    kind: FormKind;
    initial?: Project | TimelineMilestone | TechItem;
    position?: ProjectPosition;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const projects = byOrder(allProjects.filter((p) => p.position !== "gallery"));
  const gallery = byOrder(allProjects.filter((p) => p.position !== "observatory"));
  const missions = byOrder(allMissions);
  const tech = byOrder(allTech);

  const resourceFor = (t: TabKey): "projects" | "missions" | "tech" =>
    t === "missions" ? "missions" : t === "tech" ? "tech" : "projects";

  const handleError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      onLogout();
      return;
    }
    alert(err instanceof Error ? err.message : "Operation failed");
  };

  const move = async (
    list: { id?: number | string }[],
    index: number,
    dir: -1 | 1
  ) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    try {
      await reorderItems(
        resourceFor(tab),
        next.filter((x) => typeof x.id === "number").map((x) => x.id as number)
      );
      await refresh();
    } catch (err) {
      handleError(err);
    }
  };

  const remove = async (
    resource: "projects" | "missions" | "tech",
    label: string,
    id?: number
  ) => {
    if (id == null) return;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await deleteItem(resource, id);
      await refresh();
    } catch (err) {
      handleError(err);
    }
  };

  const save = async (item: unknown, initial?: unknown) => {
    setSaving(true);
    try {
      if (initial && (initial as { id?: unknown }).id != null) {
        await updateItem(resourceFor(tab), (initial as { id: number }).id, item);
      } else {
        await createItem(resourceFor(tab), item);
      }
      await refresh();
      setModal(null);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const seed = async () => {
    if (!window.confirm("Replace all current content with the bundled site data?")) return;
    setSaving(true);
    try {
      const localProjects = museumProjects;
      const payload = {
        projects: localProjects,
        missions: localTimeline,
        tech: deriveTechFromProjects(
          localProjects.filter((p) => p.position !== "gallery")
        ),
      };
      await seedItems(payload);
      await refresh();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    if (tab === "missions") setModal({ kind: "mission" });
    else if (tab === "tech") setModal({ kind: "tech" });
    else setModal({ kind: "project", position: tab === "gallery" ? "gallery" : "observatory" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-text">
          Content Editor
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={seed}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted hover:text-text"
            title="Import the bundled site content into the database"
          >
            <Database size={14} />
            Import site content
          </button>
          <button
            onClick={onLogout}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-text"
          >
            Log out
          </button>
        </div>
      </div>

      {fromDb && allProjects.length === 0 && allMissions.length === 0 && (
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-text">
          Your database is empty. Click <strong>Import site content</strong> to
          load the current projects, missions and tech, or add items below.
        </div>
      )}
      {!fromDb && (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          Showing bundled fallback data — the database isn't reachable. Run{" "}
          <code className="font-mono text-xs">netlify dev</code> with the env
          vars set so the admin API responds.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === t.key
                ? "bg-primary text-white"
                : "border border-white/10 bg-white/5 text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {tab === "projects" &&
          projects.map((p, i) => (
            <ItemRow
              key={p.id ?? p.slug}
              title={p.title}
              subtitle={p.oneLiner}
              thumb={p.image || null}
              chip={p.featured ? "featured" : p.position}
              onUp={() => move(projects, i, -1)}
              onDown={() => move(projects, i, 1)}
              onEdit={() => setModal({ kind: "project", initial: p, position: p.position })}
              onDelete={() => remove("projects", p.title, p.id)}
              canUp={i > 0}
              canDown={i < projects.length - 1}
            />
          ))}

        {tab === "gallery" &&
          gallery.map((p, i) => (
            <ItemRow
              key={p.id ?? p.slug}
              title={p.title}
              subtitle={p.oneLiner}
              thumb={p.image || null}
              chip={p.featured ? "featured" : p.position}
              onUp={() => move(gallery, i, -1)}
              onDown={() => move(gallery, i, 1)}
              onEdit={() => setModal({ kind: "project", initial: p, position: p.position })}
              onDelete={() => remove("projects", p.title, p.id)}
              canUp={i > 0}
              canDown={i < gallery.length - 1}
            />
          ))}

        {tab === "missions" &&
          missions.map((m, i) => (
            <ItemRow
              key={m.id}
              title={m.title}
              subtitle={`Mission ${m.mission} · ${m.year || "—"}`}
              thumb={m.certificate?.image ?? null}
              chip={m.status}
              onUp={() => move(missions, i, -1)}
              onDown={() => move(missions, i, 1)}
              onEdit={() => setModal({ kind: "mission", initial: m })}
              onDelete={() => remove("missions", m.title, typeof m.id === "number" ? m.id : undefined)}
              canUp={i > 0}
              canDown={i < missions.length - 1}
            />
          ))}

        {tab === "tech" &&
          tech.map((t, i) => (
            <ItemRow
              key={t.id ?? t.name}
              title={t.name}
              subtitle={`${t.projects.length} project${t.projects.length === 1 ? "" : "s"}`}
              thumb={t.icon}
              chip={null}
              onUp={() => move(tech, i, -1)}
              onDown={() => move(tech, i, 1)}
              onEdit={() => setModal({ kind: "tech", initial: t })}
              onDelete={() => remove("tech", t.name, t.id)}
              canUp={i > 0}
              canDown={i < tech.length - 1}
            />
          ))}

        {tab === "projects" && projects.length === 0 && (
          <EmptyRow label="No projects in the Observatory yet." />
        )}
        {tab === "gallery" && gallery.length === 0 && (
          <EmptyRow label="No projects in the Gallery yet." />
        )}
        {tab === "missions" && missions.length === 0 && (
          <EmptyRow label="No missions yet." />
        )}
        {tab === "tech" && tech.length === 0 && (
          <EmptyRow label="No technologies yet." />
        )}
      </div>

      <button
        onClick={openAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:shadow-glow"
      >
        <Plus size={16} />
        Add new{" "}
        {tab === "missions" ? "mission" : tab === "tech" ? "technology" : "project"}
      </button>

      {modal && (
        <Modal
          title={
            modal.initial
              ? "Edit item"
              : tab === "missions"
              ? "New mission"
              : tab === "tech"
              ? "New technology"
              : "New project"
          }
          onClose={() => setModal(null)}
        >
          {modal.kind === "project" && (
            <ProjectForm
              initial={modal.initial as Project | undefined}
              defaultPosition={modal.position ?? "observatory"}
              saving={saving}
              onCancel={() => setModal(null)}
              onSave={(p) => save(p, modal.initial)}
            />
          )}
          {modal.kind === "mission" && (
            <MissionForm
              initial={modal.initial as TimelineMilestone | undefined}
              saving={saving}
              onCancel={() => setModal(null)}
              onSave={(m) => save(m, modal.initial)}
            />
          )}
          {modal.kind === "tech" && (
            <TechForm
              initial={modal.initial as TechItem | undefined}
              projects={allProjects}
              saving={saving}
              onCancel={() => setModal(null)}
              onSave={(t) => save(t, modal.initial)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted">
      {label}
    </div>
  );
}
