/**
 * RotatingEarth — pure CSS, no images, no libraries.
 * Faithful port of the provided drop-in template. Scoped to the Timeline
 * (Timeline.css) so it never leaks to other sections. Used as the Earth
 * chapter marker in The Observatory Expedition.
 */
export default function RotatingEarth({ size = 150 }: { size?: number }) {
  return (
    <div className="obs-earth-wrap" style={{ width: size, height: size }}>
      <div className="obs-earth-atmo" />
      <div className="obs-earth">
        <div className="obs-earth-surface" />
        <div className="obs-earth-clouds" />
      </div>
    </div>
  );
}
