import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import PlaceholderImage from './PlaceholderImage.jsx';
import JewelleryImage from './JewelleryImage.jsx';
import { getProductImages } from '../data/images.js';

/**
 * ProductCard
 * -------------------------------------------------------------------------
 * Product tile used in the shop grid and bestsellers rail. On pointer move
 * the card frame gets a subtle 3D tilt (rotateX/rotateY) that follows the
 * cursor, springing back to flat on pointer leave — a small, high-end
 * "the object responds to you" detail rather than a generic card lift.
 */
export default function ProductCard({ product }) {
  const frameRef = useRef(null);
  const [photo] = getProductImages(product);

  const handleMove = (e) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 10,
      rotateX: -py * 10,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    gsap.to(frameRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
  };

  return (
    <article className="product-card" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <Link to={`/shop/${product.id}`}>
        <div className="product-card__frame" ref={frameRef}>
          <div className="product-card__media">
            {photo ? (
              <JewelleryImage image={photo} alt={`${product.name} — ${photo.alt}`} />
            ) : (
              <PlaceholderImage label={product.name} tone={product.tone} />
            )}
          </div>
        </div>
        <div className="product-card__body">
          <div>
            <div className="product-card__name">{product.name}</div>
            <div className="product-card__cat">{product.category}</div>
          </div>
        </div>
      </Link>
    </article>
  );
}
