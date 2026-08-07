import { useRef, useState, type ReactNode } from "react";
import { Plus, X, Upload } from "lucide-react";
import { compressImage } from "./imageUtil";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text placeholder:text-muted/40 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted/70">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className={`${inputClass} resize-y`}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className={`${inputClass} appearance-none`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-background text-text">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
      />
      {label}
    </label>
  );
}

/** Editable list of short strings (stack, features). */
export function StringList({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-text hover:bg-white/10"
          aria-label="Add item"
        >
          <Plus size={16} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-text"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="text-muted hover:text-text"
                aria-label={`Remove ${v}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Image: paste a URL or upload a file (compressed, stored as data URI). */
export function ImageField({
  value,
  onChange,
  label,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUri = await compressImage(file);
      onChange(dataUri);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <Field label={label} hint={hint}>
      <TextInput value={value} onChange={onChange} placeholder="https://… or upload below" />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text hover:bg-white/10 disabled:opacity-50"
        >
          <Upload size={14} />
          {busy ? "Processing…" : "Upload image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
        {value && (
          <img
            src={value}
            alt="preview"
            className="h-12 w-20 rounded-lg border border-white/10 object-cover"
          />
        )}
      </div>
    </Field>
  );
}
