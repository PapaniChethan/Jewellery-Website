import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import HeroScene from '../components/HeroScene.jsx';
import SectionReveal from '../components/SectionReveal.jsx';
import ProductCard from '../components/ProductCard.jsx';
import JewelleryImage from '../components/JewelleryImage.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { BESTSELLER_IDS, getProductById } from '../data/products.js';
import { IMAGES } from '../data/images.js';
import { useStaggerReveal } from '../hooks/useScrollReveal.js';
import { useIntroDone } from '../lib/introState.js';

// The rail uses the BestSellers photo set, so it doesn't repeat the
// category shots used by the collection tiles above it.
const BESTSELLERS = BESTSELLER_IDS.map(getProductById).filter(Boolean);

// Tile photos come from each category's own folder (a flower ring, a temple
// necklace and ruby jhumkas).
const COLLECTIONS = [
  { name: 'Rings', tone: 'gold', copy: 'Solitaires, bands and stacking rings.', image: IMAGES.Rings[0] },
  { name: 'Necklaces', tone: 'emerald', copy: 'Pendants, collars and layered chains.', image: IMAGES.Necklaces[0] },
  { name: 'Earrings', tone: 'ivory', copy: 'Hoops, studs and articulated drops.', image: IMAGES.Earrings[2] },
];

export default function Home() {
  const railRef = useStaggerReveal({ stagger: 0.1 });
  const collectionsRef = useStaggerReveal({ stagger: 0.12, distance: 40 });
  const heroRef = useRef(null);
  const introDone = useIntroDone();

  // Hero copy rises in alongside the ring's entrance, once the intro lifts.
  // Held hidden (transform/opacity only — no layout shift) until then.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const items = '.hero__eyebrow, .hero__title, .hero__sub, .hero__cta, .hero__scroll-cue';
      if (!introDone) {
        gsap.set(items, { autoAlpha: 0, y: 28 });
        return;
      }
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.45 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [introDone]);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero" ref={heroRef}>
        <HeroScene />
        <div className="hero__content wrap">
          <p className="label hero__eyebrow">Fine Jewellery, Since 2016</p>
          <h1 className="hero__title">
            Jewellery made to be <span className="gold-text">carried forward.</span>
          </h1>
          <p className="hero__sub">
            Each piece is hand-finished in our atelier from recycled gold and
            responsibly sourced stones — designed to outlast trends, and be
            passed down.
          </p>
          <div className="hero__cta">
            <Link to="/shop" className="btn btn--solid">Explore the Collection</Link>
            <Link to="/about" className="btn">Our Craftsmanship</Link>
          </div>
        </div>
        <div className="hero__scroll-cue">
          <div className="hero__scroll-line"><span /></div>
          Scroll
        </div>
      </section>

      {/* ---------------- FEATURED COLLECTIONS ---------------- */}
      <section className="section">
        <div className="wrap">
          <SectionReveal as="div" className="section-head" direction="up">
            <h2>Featured Collections</h2>
            <p>Three signatures of the house, each built around a single idea: light, line and form.</p>
          </SectionReveal>

          <div className="collections-grid" ref={collectionsRef}>
            {COLLECTIONS.map((c) => (
              <Link to="/shop" className="collection-tile" key={c.name}>
                <div className="collection-tile__img">
                  <JewelleryImage image={c.image} alt={`${c.name} — ${c.image.alt}`} />
                </div>
                <div className="collection-tile__label">
                  <span className="label">Shop the edit</span>
                  <h3>{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BESTSELLERS ---------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <SectionReveal as="div" className="section-head" direction="up">
            <h2>Bestsellers</h2>
            <p>The pieces our clients return for, again and again.</p>
          </SectionReveal>
          <div className="rail" ref={railRef}>
            {BESTSELLERS.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BRAND STORY TEASER ---------------- */}
      <section className="section section--deep">
        <div className="wrap story-teaser">
          <SectionReveal as="div" className="story-teaser__media" direction="left">
            <JewelleryImage image={IMAGES.OurStory[0]} />
          </SectionReveal>
          <SectionReveal as="div" className="story-teaser__copy" direction="right">
            <p className="label">Our Story</p>
            <h2>Three generations of goldsmiths</h2>
            <p>
              Sri Ranganatha Jewellers began as a single workbench in 2016. Today the same
              hand-finishing techniques are used across every piece we make —
              slower, by design, than mass production ever could be.
            </p>
            <Link to="/about" className="btn">Read Our Story</Link>
          </SectionReveal>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section">
        <div className="wrap">
          <SectionReveal direction="up" scaleFrom={0.97}>
            <Testimonials />
          </SectionReveal>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="section section--tight section--deep">
        <div className="wrap">
          <SectionReveal direction="up">
            <Newsletter />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
