import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TESTIMONIALS } from '../data/testimonials.js';

/**
 * Testimonials
 * -------------------------------------------------------------------------
 * Auto-advancing quote carousel. Crossfades between quotes with GSAP and
 * pauses auto-advance while the user has a dot focused/hovered so it never
 * fights with someone trying to read or navigate manually.
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const items = trackRef.current?.querySelectorAll('.testimonial');
    // Strip any inline styles GSAP left on *every* quote first. Without
    // this, the previously-active quote keeps its last inline
    // `opacity: 1` (inline styles win over the .testimonial CSS rule that
    // would otherwise hide it), so the outgoing and incoming quotes were
    // rendering on top of each other — this is what fixes that.
    items?.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform' }));

    const active = trackRef.current?.querySelector('.testimonial.is-active');
    if (active) {
      gsap.fromTo(active, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }
  }, [index]);

  return (
    <div className="testimonials" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div className="testimonial-track" ref={trackRef}>
        {TESTIMONIALS.map((t, i) => (
          <figure className={`testimonial ${i === index ? 'is-active' : ''}`} key={t.name} aria-hidden={i !== index}>
            <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption>
              <cite>{t.name} — {t.location}</cite>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="testimonial-dots">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            className={i === index ? 'active' : ''}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
