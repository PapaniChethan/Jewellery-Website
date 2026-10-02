import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Loader
 * -------------------------------------------------------------------------
 * Brand intro shown once per browser session (see App.jsx). The brand name
 * rises in letter by letter over a warm glow, a gold rule draws out from a
 * small gem, a soft light reflection sweeps across the name while a few
 * sparkles twinkle, then the screen lifts away to reveal the site.
 *
 * Only transform / opacity / clip-path are animated, so it never triggers
 * layout. Clicking, tapping or pressing any key skips straight to the
 * reveal, and reduced-motion users get a short, still fade instead.
 */
const BRAND = 'Sri Ranganatha';

// [left %, top %, size px, delay s] — fixed so the layout is stable.
const SPARKLES = [
  [24, 38, 22, 1.3], [77, 36, 28, 1.6], [31, 61, 16, 1.9], [70, 62, 20, 1.45],
  [52, 30, 14, 2.0], [14, 52, 14, 1.75], [87, 52, 16, 2.1], [58, 70, 12, 1.55],
];

const splitChars = (text) =>
  [...text].map((ch, i) => (
    <span className="loader__char" key={i}>{ch === ' ' ? ' ' : ch}</span>
  ));

export default function Loader({ onReveal, onFinish }) {
  const rootRef = useRef(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  // Fired as the screen starts to lift, so the page can begin its own
  // entrance underneath the reveal.
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let tl;

    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, onComplete: () => finishRef.current?.() });

      if (reduce) {
        tl.addLabel('exit', 0.5)
          .call(() => revealRef.current?.(), null, 'exit')
          .to(root, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 'exit');
        return;
      }

      tl.from('.loader__glow', { scale: 0.6, autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0)
        .from('.loader__inner', { scale: 0.94, duration: 2.6, ease: 'power2.out' }, 0)
        .from('.loader__eyebrow', { autoAlpha: 0, y: 12, duration: 0.8, ease: 'power3.out' }, 0.2)
        .from('.loader__name--base .loader__char', {
          yPercent: 115,
          autoAlpha: 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.045,
        }, 0.35)
        .from('.loader__sub', { autoAlpha: 0, letterSpacing: '0.2em', duration: 1.1, ease: 'power3.out' }, 1.0)
        .from('.loader__gem', { scale: 0, rotate: -90, duration: 0.6, ease: 'back.out(2)' }, 1.05)
        .from('.loader__rule', { scaleX: 0, duration: 0.9, ease: 'power3.inOut' }, 1.15)
        .to('.loader__shine', { backgroundPosition: '0% 0', duration: 1.3, ease: 'power2.inOut' }, 1.45)
        .addLabel('exit', 2.45)
        .to('.loader__inner', { autoAlpha: 0, y: -24, duration: 0.55, ease: 'power2.in' }, 'exit')
        .call(() => revealRef.current?.(), null, 'exit+=0.2')
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'power4.inOut' }, 'exit+=0.2');
    }, root);

    // Let the brand font arrive first (capped, so a slow network never
    // holds the site back) to avoid the name swapping typefaces mid-reveal.
    // The still, reduced-motion version has no reveal to protect.
    const fontsReady = reduce ? Promise.resolve() : document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 600))]).then(() => {
      if (!cancelled) tl.play();
    });

    const skip = () => {
      if (tl.time() < tl.labels.exit) tl.play('exit');
    };
    root.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);

    return () => {
      cancelled = true;
      root.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      ctx.revert();
    };
  }, []);

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="loader__glow" />
      {SPARKLES.map(([x, y, size, delay], i) => (
        <span
          className="loader__sparkle"
          key={i}
          style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s` }}
        />
      ))}
      <div className="loader__inner">
        <p className="loader__eyebrow">Fine Gold &amp; Diamond Jewellery</p>
        <div className="loader__brand">
          <span className="loader__name loader__name--base">{splitChars(BRAND)}</span>
          {/* Same text, unsplit, painted with a moving highlight on top. */}
          <span className="loader__name loader__shine">{BRAND}</span>
        </div>
        <div className="loader__ornament">
          <span className="loader__rule loader__rule--left" />
          <span className="loader__gem" />
          <span className="loader__rule loader__rule--right" />
        </div>
        <p className="loader__sub">Jewellers</p>
      </div>
    </div>
  );
}
