import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal.jsx';
import JewelleryImage from '../components/JewelleryImage.jsx';
import { getProductById } from '../data/products.js';
import { getProductImages } from '../data/images.js';

/**
 * ProductDetail
 * -------------------------------------------------------------------------
 * Individual product page: a large primary photo with gallery thumbnails
 * from the same category, alongside the product's name and description.
 */
export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const photos = getProductImages(product);
  // Index into `photos`.
  const [view, setView] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setView(0);
  }, [id]);

  if (!product) {
    return (
      <section className="page-hero">
        <div className="wrap">
          <h1>Piece not found</h1>
          <p>
            We couldn't find that item. <Link to="/shop" className="gold-text">Return to the shop</Link>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 'clamp(7rem, 14vw, 9rem)' }}>
      <div className="wrap story-block">
        <SectionReveal as="div" className="product-gallery" direction="left">
          <div className="story-block__media">
            {photos[view] && (
              <JewelleryImage
                key={photos[view].src}
                image={photos[view]}
                alt={view === 0 ? `${product.name} — ${photos[0].alt}` : undefined}
                priority
              />
            )}
          </div>
          {photos.length > 0 && (
            <div className="product-gallery__thumbs" role="group" aria-label="Product images">
              {photos.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  className={view === i ? 'active' : ''}
                  aria-pressed={view === i}
                  aria-label={`Show image ${i + 1}: ${photo.alt}`}
                  onClick={() => setView(i)}
                >
                  <JewelleryImage image={photo} alt="" />
                </button>
              ))}
            </div>
          )}
        </SectionReveal>

        <SectionReveal as="div" className="story-block__copy" direction="right">
          <p className="label">{product.category}</p>
          <h1 style={{ fontSize: 'var(--step3)' }}>{product.name}</h1>
          <p>{product.description}</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/shop" className="product-card__link" style={{ borderBottomColor: 'var(--color-gold-bright)' }}>
              ← Back to all pieces
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
