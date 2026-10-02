import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal
 * -------------------------------------------------------------------------
 * Attaches a gsap.fromTo() reveal animation, driven by ScrollTrigger, to the
 * returned ref. Centralising this in one hook keeps every "fade/slide/scale
 * in on scroll" moment across the site consistent and easy to tune in one
 * place, instead of hand-rolled ScrollTriggers scattered through pages.
 *
 * @param {object} options
 * @param {'up'|'left'|'right'|'none'} options.direction - slide direction
 * @param {number} options.distance - px to slide from
 * @param {number} options.duration
 * @param {number} options.delay
 * @param {number} options.start - ScrollTrigger "start" position (0-1 of viewport)
 * @param {number} options.scaleFrom - initial scale (1 = no scale animation)
 */
export function useScrollReveal({
  direction = 'up',
  distance = 48,
  duration = 1.1,
  delay = 0,
  start = 0.85,
  scaleFrom = 1,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const offsets = {
      up: { y: distance, x: 0 },
      left: { y: 0, x: -distance },
      right: { y: 0, x: distance },
      none: { y: 0, x: 0 },
    };
    const from = offsets[direction] ?? offsets.up;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: from.x, y: from.y, scale: scaleFrom },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: `top ${start * 100}%`,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction, distance, duration, delay, start, scaleFrom]);

  return ref;
}

/**
 * useStaggerReveal
 * -------------------------------------------------------------------------
 * Same idea as useScrollReveal but for a parent element whose *direct
 * children* should reveal in a staggered sequence (grids, nav links, list
 * items). Attach the returned ref to the parent/container element.
 */
export function useStaggerReveal({ stagger = 0.12, distance = 32, start = 0.85 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const children = Array.from(el.children);
    if (!children.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: `top ${start * 100}%`,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, distance, start]);

  return ref;
}
