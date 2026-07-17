import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Mail, Github, Linkedin } from "lucide-react";
import { site } from "../data/site";
import { Section } from "../components/Section";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * Contact / Mission Control — "Transmit Signal" form.
 * Powered by Netlify Forms (no backend, no third-party service). The form is
 * detected at build time via the static `public/contact-form.html` stub; this
 * live form posts to the same origin ("/") and Netlify routes it to the
 * "contact" form. Success = small confirmation animation, never a page
 * redirect.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    try {
      const data = new FormData(form);
      // Netlify routes the submission by the hidden `form-name` field.
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString()
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
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
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={onSubmit}
          className="glass mx-auto mt-10 space-y-4 rounded-3xl p-6 text-left sm:p-8"
        >
          {/* Netlify: hidden form-name must match the detected form */}
          <input type="hidden" name="form-name" value="contact" />
          {/* Honeypot: hidden from humans, catches bots */}
          <p className="hidden">
            <label>
              Don&apos;t fill this out if you&apos;re human:
              <input name="bot-field" />
            </label>
          </p>

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
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-white shadow-glow transition-shadow hover:shadow-glow-accent disabled:opacity-60"
          >
            <Send size={16} />
            {status === "submitting" ? "Transmitting…" : "Transmit Signal"}
          </button>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-emerald-400"
                role="status"
              >
                <CheckCircle2 size={16} />
                Signal received — I&apos;ll reply soon.
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-red-400"
                role="alert"
              >
                <AlertCircle size={16} />
                Transmission failed — try emailing me directly.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </Section>
  );
}
