import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { navigate } from "../lib/navigate";
import { clearToken, getToken, login, verify } from "./api";
import { inputClass } from "./fields";
import { Editor } from "./Editor";

function Login({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(password);
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold text-text">
          Mission Control
        </h1>
        <p className="mt-1 text-sm text-muted">
          Enter the admin password to edit content.
        </p>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={`mt-6 ${inputClass}`}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full rounded-full bg-primary py-2.5 font-medium text-white hover:shadow-glow disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 w-full text-center text-xs text-muted hover:text-text"
        >
          ← Back to site
        </button>
      </form>
    </div>
  );
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setAuthed(false);
      return;
    }
    verify()
      .then(() => setAuthed(true))
      .catch(() => {
        clearToken();
        setAuthed(false);
      });
  }, []);

  if (authed === null) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted">
        Checking session…
      </div>
    );
  }

  if (!authed) return <Login onAuthed={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text"
          >
            <ArrowLeft size={16} /> Observatory
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
            Admin
          </span>
        </div>
      </header>
      <Editor
        onLogout={() => {
          clearToken();
          setAuthed(false);
        }}
      />
    </div>
  );
}
