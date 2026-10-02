/**
 * JewelleryImage
 * -------------------------------------------------------------------------
 * Renders one entry from src/data/images.js as a cover-fitted <img> that
 * fills its (aspect-ratio-locked) container. The entry's `crop` box is
 * applied as a scale about a computed origin, so the edge artifacts in the
 * source files are trimmed without distorting the photo or editing it.
 *
 * Scaling by s about origin o shows the source range [o - o/s, o + (1-o)/s],
 * so to start the visible window at `start` we need o = start * s / (s - 1).
 */
function cropStyle([x0, y0, x1, y1], position) {
  const style = position ? { '--jw-pos': position } : {};
  const w = x1 - x0;
  const h = y1 - y0;
  const s = 1 / Math.min(w, h);
  if (s <= 1.001) return style;
  const origin = (start, size) => ((start + (size - 1 / s) / 2) * s) / (s - 1);
  return {
    ...style,
    '--jw-scale': s.toFixed(4),
    '--jw-origin': `${(origin(x0, w) * 100).toFixed(2)}% ${(origin(y0, h) * 100).toFixed(2)}%`,
  };
}

export default function JewelleryImage({ image, alt, priority = false, className = '' }) {
  if (!image?.src) return null;
  const loading = priority ? 'eager' : 'lazy';

  // Whole-photo mode: the picture is letterboxed inside the frame, and the
  // spare space is filled by a blurred, cover-fitted copy of the same file
  // (same URL, so no second download).
  if (image.fit === 'contain') {
    return (
      <>
        <img className="jw-img jw-img--backdrop" src={image.src} alt="" aria-hidden="true" loading={loading} decoding="async" draggable="false" />
        <img
          className={`jw-img jw-img--contain ${className}`.trim()}
          src={image.src}
          alt={alt ?? image.alt}
          loading={loading}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          draggable="false"
        />
      </>
    );
  }

  return (
    <img
      className={`jw-img ${className}`.trim()}
      src={image.src}
      alt={alt ?? image.alt}
      loading={loading}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      draggable="false"
      style={cropStyle(image.crop, image.position)}
    />
  );
}
