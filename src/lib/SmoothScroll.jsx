import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll
 * -------------------------------------------------------------------------
 * Wraps the app in a Lenis smooth-scroll instance and wires it up to GSAP's
 * ticker + ScrollTrigger so scroll-triggered animations stay perfectly in
 * sync with the eased scroll position (rather than the raw, native scroll).
 *
 * Also resets scroll to the top whenever the route changes (client-side
 * page navigation), and refreshes ScrollTrigger so newly-mounted page
 * content gets correct trigger offsets.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger's internal scroll position reading in sync with Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's own rAF ticker instead of a second rAF loop,
    // so easing and scroll-triggered animation frames never drift apart.
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // Reset to top + refresh triggers on every route change.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return children;
}
