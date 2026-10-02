/**
 * PlaceholderImage
 * -------------------------------------------------------------------------
 * REPLACEABLE ASSET PLACEHOLDER.
 * Renders a brand-toned gradient panel with a caption instead of a real
 * product/lifestyle photograph, so the site runs fully offline with zero
 * external image dependencies. Swap these out for real photography before
 * launch — see README.md → "Replacing placeholder assets".
 *
 * Usage:
 *   <PlaceholderImage label="Temple Kasu Necklace" tone="gold" />
 *
 * tone: 'gold' | 'maroon' | 'ivory' | 'emerald' | 'noir'  — picks a gradient
 * family that matches the brand palette so placeholders never look out of
 * place. The caption is rendered in its own translucent chip
 * (.ph-img__label) so it stays legible against light or dark tone families
 * alike.
 */
const TONES = {
  gold: ['#f3d998', '#c9932f', '#7c5a17'],
  maroon: ['#c65a72', '#8a1338', '#4a0a1e'],
  ivory: ['#fffaf1', '#ead2a0', '#c9932f'],
  emerald: ['#4f8a70', '#2c5443', '#12241d'],
  noir: ['#5a4636', '#3a160f', '#1c0a06'],
};

export default function PlaceholderImage({ label = 'Image placeholder', tone = 'gold', sub }) {
  const [c1, c2, c3] = TONES[tone] ?? TONES.gold;
  return (
    <div
      className="ph-img"
      style={{
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
      }}
      role="img"
      aria-label={label}
    >
      <span className="ph-img__label">
        {label}
        {sub ? <><br /><em style={{ opacity: 0.85 }}>{sub}</em></> : null}
        <br />
        <span style={{ opacity: 0.75 }}>— replace with photography —</span>
      </span>
    </div>
  );
}
