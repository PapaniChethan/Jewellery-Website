import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import ProductCard from '../components/ProductCard.jsx';
import SectionReveal from '../components/SectionReveal.jsx';
import { CATEGORIES, PRODUCTS } from '../data/products.js';

/**
 * Shop
 * -------------------------------------------------------------------------
 * Category-filterable product grid. Filtering is done client-side against
 * the static PRODUCTS array — swap PRODUCTS for data fetched from your
 * commerce API and this page needs no other changes.
 *
 * Switching category re-triggers a stagger fade-in on the grid: motion here
 * answers the user's own action (the filter click) rather than being a
 * generic scroll reveal, so it uses a plain GSAP effect keyed on `active`
 * instead of the ScrollTrigger-based useScrollReveal hook.
 */
export default function Shop() {
  const [active, setActive] = useState('All');
  const gridRef = useRef(null);

  const filtered = useMemo(
    () => (active === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }
      );
    }, el);
    return () => ctx.revert();
  }, [active]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="label">The Collection</p>
          <h1>Every piece, one place.</h1>
          <p>
            Filter by category to browse rings, necklaces, earrings, bracelets and
            bangles — or view the full collection below.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <SectionReveal direction="up">
            <div className="filter-tabs" role="tablist" aria-label="Filter by category">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active === cat}
                  className={active === cat ? 'active' : ''}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionReveal>

          <div className="product-grid" ref={gridRef}>
            {filtered.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
