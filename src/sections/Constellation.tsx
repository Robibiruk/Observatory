import { useEffect, useState } from "react";
import { Section } from "../components/Section";
import { toolCategories, type Tool } from "../data/tools";
import { getIconSource, getThesvgSvg } from "../data/icon-resolver";

/**
 * Icon component that resolves tool icons using devicons (preferred) or thesvg.
 */
function ToolIcon({ toolName, size = 24 }: { toolName: string; size?: number }) {
  const source = getIconSource(toolName);

  if (!source) {
    return (
      <div
        className="flex items-center justify-center rounded bg-white/10 text-[8px] font-bold text-muted"
        style={{ width: size, height: size }}
      >
        ??
      </div>
    );
  }

  if (source.type === "thesvg") {
    const svg = getThesvgSvg(source.value);
    if (svg) {
      return (
        <div
          style={{ width: size, height: size, overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      );
    }
    return (
      <div
        className="flex items-center justify-center rounded bg-white/10 text-[8px] font-bold text-muted"
        style={{ width: size, height: size }}
      >
        ??
      </div>
    );
  }

  // devicon: load SVG from public path
  return <DeviconImg src={source.value} size={size} />;
}

function DeviconImg({ src, size }: { src: string; size: number }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvg(text);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [src]);

  if (!svg) {
    return <div style={{ width: size, height: size }} />;
  }

  return <div style={{ width: size, height: size, overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function Constellation({ glow = false }: { glow?: boolean }) {
  return (
    <Section id="constellation" className="section-pad" glow={glow}>
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Tools</p>
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          The tools I reach for
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Every tool I use to build, ship, and run my work.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-6xl space-y-10">
        {toolCategories.map((cat) => (
          <div key={cat.label}>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              {cat.label}
            </h3>
            <div className="flex flex-wrap gap-3">
              {cat.tools.map((tool: Tool) => (
                <div
                  key={tool.name}
                  className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-surface px-3 py-2 transition-all hover:border-primary/50 hover:shadow-glow"
                >
                  <ToolIcon toolName={tool.name} size={20} />
                  <span className="font-mono text-sm text-text">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
