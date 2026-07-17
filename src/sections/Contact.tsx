import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { Send, CheckCircle2, Mail, Github, Linkedin } from "lucide-react";
import { site } from "../data/site";
import { Section } from "../components/Section";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const FORMSPREE_READY =
  FORMSPREE_ID && FORMSPREE_ID !== "your-formspree-form-id";

/**
 * Contact / Mission Control — "Transmit Signal" form.
 * POSTs to Formspree when VITE_FORMSPREE_ID is set; otherwise falls back to a
 * mailto: link (no backend, ever). Success = small confirmation animation,
 * never a page redirect.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const [mailtoSent, setMailtoSent] = useState(false);

  // useForm must be called unconditionally; pass a dummy id when not configured.
  const [state, handleSubmit] = useForm(
    FORMSPREE_READY ? FORMSPREE_ID! : "xgebkzvq"
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (FORMSPREE_READY) {
      handleSubmit(e); // Formspree handles it
      return;
    }
    // mailto fallback
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const message = (
      form.elements.namedItem("message") as HTMLTextAreaElement
    ).value;
    const subject = encodeURIComponent(`Signal from ${name || "a visitor"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setMailtoSent(true);
  };

  return (
    <Section id="contact" className="section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-3">Mission Control</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          Transmit a signal
        </h2>
        <p className="mt-4 text-muted">
          Have a project, a role, or just a thought? Send it my way.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-highlight"
          >
            <Mail size={16} /> {site.email}
          </a>
          <a
            href="https://github.com/Robibiruk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-highlight"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/robel-biruk-72084636b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-highlight"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass mx-auto mt-10 space-y-4 rounded-3xl p-6 text-left sm:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition-colors focus:border-primary"
              placeholder="Your name"
            />
            <ValidationError
              prefix="Name"
              field="name"
              errors={state.errors}
              className="mt-1 text-xs text-red-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition-colors focus:border-primary"
              placeholder="you@domain.com"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="mt-1 text-xs text-red-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition-colors focus:border-primary"
              placeholder="What's on your mind?"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="mt-1 text-xs text-red-400"
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-white shadow-glow transition-shadow hover:shadow-glow-accent disabled:opacity-60"
          >
            <Send size={16} />
            {state.submitting
              ? "Transmitting…"
              : FORMSPREE_READY
              ? "Transmit Signal"
              : "Transmit via email"}
          </button>

          <AnimatePresence>
            {(state.succeeded || mailtoSent) && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-emerald-400"
                role="status"
              >
                <CheckCircle2 size={16} />
                {FORMSPREE_READY
                  ? "Signal received — I'll reply soon."
                  : "Opening your mail client…"}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </Section>
  );
}
