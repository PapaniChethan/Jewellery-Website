/**
 * Jewellery photography map
 * -------------------------------------------------------------------------
 * Single source of truth for the photographs in src/images. Vite resolves
 * each file to a hashed asset URL at build time (import.meta.glob), so the
 * images stay where they are — nothing is copied into /public.
 *
 * The globs below list only the photo sets the site uses, so files that are
 * kept in src/images but no longer shown (older bangle shots, duplicates)
 * are not bundled into the build.
 *
 * `crop` is the clean region of each file as [left, top, right, bottom]
 * fractions; the <JewelleryImage /> component trims to this box with CSS
 * instead of editing the originals. The current photos are clean edge to
 * edge, so most use the full frame. `position` optionally overrides
 * object-position to keep the piece centred in the 4:5 card frames.
 * `fit: 'contain'` shows the whole photo (for artwork with text baked in)
 * over a soft, blurred copy of itself instead of cropping it to the frame.
 */
const files = import.meta.glob(
  [
    '../images/*/*.png',
    '../images/04_Rings/*.jpg',
    '../images/07_BestSellers/*.jpeg',
  ],
  { eager: true, import: 'default' }
);

function img(path, alt, crop = [0, 0, 1, 1], position, fit) {
  const src = files[`../images/${path}`];
  if (!src && import.meta.env.DEV) console.warn(`[images] Missing file: src/images/${path}`);
  return { src, alt, crop, position, fit };
}

export const IMAGES = {
  Necklaces: [
    img('01_Necklaces/necklace-1.png', 'Gold temple necklace with a Lakshmi pendant and ruby accents'),
    img('01_Necklaces/necklace-2.png', 'Gold coin necklace with a round floral pendant and bead drops'),
    img('01_Necklaces/necklace-3.png', 'Gold necklace with a teardrop Lakshmi pendant'),
    img('01_Necklaces/necklace-4.png', 'Traditional gold necklace with a round floral pendant'),
  ],
  // earring-2.png is an exact copy of earring-1.png, so it is left out.
  Earrings: [
    img('02_Earrings/earring-1.png', 'Gold jhumkas with flower-shaped white stone studs'),
    img('02_Earrings/earring-3.png', 'Long gold drop earrings with green and white stones'),
    img('02_Earrings/earring-4.png', 'Gold jhumkas with ruby teardrop studs and pearl drops'),
  ],
  Bangles: [
    img('03_Bangles/bangle-1.png', 'Pair of gold bangles set with white stone flowers'),
    img('03_Bangles/bangle-2.png', 'Pair of gold bangles with ruby and white stones'),
    img('03_Bangles/bangle-3.png', 'Pair of slim gold bangles with small stone flowers'),
    img('03_Bangles/bangle-4.png', 'Slim gold bangles with stone flower work'),
  ],
  Rings: [
    img('04_Rings/ring_design_1_4k.jpg', 'Gold ring with a five-petal flower and a centre stone'),
    img('04_Rings/ring_design_2_4k.jpg', 'Gold twist ring with a solitaire stone'),
    img('04_Rings/ring_design_3_4k.jpg', 'Gold band set with a row of heart-shaped stones', [0, 0, 1, 1], '50% 40%'),
    img('04_Rings/ring_design_4_4k.jpg', 'Double gold band ring with a three-stone bar', [0, 0, 1, 1], '50% 40%'),
  ],
  Chains: [
    img('05_Chains/chain-1.png', 'Bold gold rope chain with stone-set links'),
    img('05_Chains/chain-2.png', 'Gold bead chain with a small stone flower'),
    img('05_Chains/chain-3.png', 'Fine gold chain with a leaf motif and a solitaire stone'),
    img('05_Chains/chain-4.png', 'Fine gold chain with a stone-set heart pendant'),
  ],
  // braclet-2.png shows the same flower bracelet from another angle.
  Bracelets: [
    img('06_Bracelets/braclet-1.png', 'Gold chain bracelet with a stone flower and leaf links'),
    img('06_Bracelets/braclet-2.png', 'Gold chain bracelet with a sparkling stone flower'),
  ],
  BestSellers: [
    img('07_BestSellers/image-1.jpeg', 'Antique gold jhumkas with ruby studs and pearl drops'),
    img('07_BestSellers/image-2.jpeg', 'Pair of antique gold kadas with ruby accents'),
    img('07_BestSellers/image-3.jpeg', 'Gold bead necklace with a ruby centre and matching earrings'),
    img('07_BestSellers/image-4.jpeg', 'Gold bracelet with round white stones and leaf links'),
    img('07_BestSellers/image-5.jpeg', 'Gold choker necklace with matching jhumkas'),
    img('07_BestSellers/image-6.jpeg', 'Gold ring with a lotus-shaped stone setting'),
  ],
  OurStory: [
    // Square artwork with the logo and a quote baked in, so it is shown
    // whole rather than cropped into the portrait story frames.
    img(
      '11_Our_Story/Story image.png',
      'Sri Ranganatha Jewellers — a gold temple necklace and jhumkas on maroon velvet, with the quote: Jewellery is not just an ornament, it’s a timeless expression of love, tradition and you.',
      [0, 0, 1, 1],
      undefined,
      'contain'
    ),
  ],
};

/**
 * Primary + gallery images for a product. The primary photo comes from
 * `imageSet` (defaults to the product's category); the gallery is filled
 * with other photos from the product's own category, up to four in total.
 */
export function getProductImages(product) {
  const set = IMAGES[product?.imageSet ?? product?.category];
  if (!set || product.imageIndex == null) return [];
  const primary = set[product.imageIndex];
  if (!primary) return [];
  const gallery = (IMAGES[product.category] ?? []).filter((image) => image !== primary);
  return [primary, ...gallery].slice(0, 4);
}
