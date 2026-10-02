import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import RingShowcase from './RingShowcase.jsx';
import GoldEnvironment from './GoldEnvironment.jsx';
import { useIntroDone } from '../lib/introState.js';

/**
 * HeroScene
 * -------------------------------------------------------------------------
 * Full-bleed Three.js canvas used behind the homepage hero copy. Direct
 * lights provide the main illumination and shading; GoldEnvironment (a
 * procedural, zero-network reflection map) is what makes the metallic gold
 * ring actually read as gold rather than near-black — see its file for why.
 * The ring itself and its motion live in RingShowcase.jsx.
 *
 * The canvas is pinned absolutely (R3F's wrapper sets an inline
 * `position: relative`, which would otherwise override .hero__canvas),
 * ignores pointer events so it never blocks the copy, buttons or touch
 * scrolling, and stops rendering while the hero is scrolled out of view.
 *
 * Wrapped in <Suspense> so any future swap to real .glb models (which load
 * asynchronously) will show the Loader's spinner state gracefully rather
 * than throwing.
 */
const media = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export default function HeroScene() {
  const introDone = useIntroDone();
  const canvasRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [reduceMotion] = useState(() => media('(prefers-reduced-motion: reduce)'));
  const [finePointer] = useState(() => media('(hover: hover) and (pointer: fine)'));
  // Portrait screens: the open space beside the call-to-action buttons,
  // measured in px within the hero (offsets ignore the copy's reveal
  // transforms). Landscape screens use RingShowcase's default placement.
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    const hero = canvasRef.current?.closest('.hero');
    const buttons = [...(hero?.querySelector('.hero__cta')?.children ?? [])];
    if (!buttons.length) return undefined;
    // Sum offsets up to the hero (a transformed ancestor can become the
    // offsetParent, so a single offsetTop/offsetLeft isn't enough).
    const offset = (el) => {
      let x = 0;
      let y = 0;
      for (let n = el; n && n !== hero; n = n.offsetParent) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    };
    const measure = () => {
      if (hero.clientWidth >= hero.clientHeight) return setAnchor(null);
      const boxes = buttons.map((b) => ({ ...offset(b), w: b.offsetWidth, h: b.offsetHeight }));
      const right = Math.max(...boxes.map((b) => b.x + b.w));
      const top = Math.min(...boxes.map((b) => b.y));
      const bottom = Math.max(...boxes.map((b) => b.y + b.h));
      const free = hero.clientWidth - right;
      setAnchor({ x: right + free / 2, y: (top + bottom) / 2, size: Math.min(free * 0.7, 240) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      className={`hero__canvas${introDone ? ' is-shown' : ''}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      frameloop={reduceMotion ? 'demand' : inView ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} color="#fff8ec" />
      <pointLight position={[-3, -2, -2]} intensity={0.55} color="#c65a72" />
      <pointLight position={[2, -1, 3]} intensity={0.6} color="#e0a83c" />

      <Suspense fallback={null}>
        {/* Champagne rim instead of maroon: the upright hero ring shows its
            inner face, which would otherwise read as red. */}
        <GoldEnvironment rimColor="#c98a3a" />
        <RingShowcase start={introDone} reduceMotion={reduceMotion} finePointer={finePointer} anchor={anchor} />
      </Suspense>
    </Canvas>
  );
}
