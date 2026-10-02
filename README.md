# Sri Ranganatha Jewellers — Luxury Jewellery Website

A complete, production-ready marketing/e-commerce front end for a fictional luxury
jewellery house, **Sri Ranganatha Jewellers**. Built with React + Vite, React Three Fiber
(Three.js), GSAP/ScrollTrigger, and Lenis smooth scrolling.

> Everything in this project runs immediately with placeholder content, copy and
> "photography" (generated gradient panels, clearly labelled) so you can see the
> whole site working before swapping in real assets. See **"Replacing placeholder
> content"** below for exactly what to change before launch.

---

## 1. Quick start

Requirements: **Node.js 18+** and npm (or yarn/pnpm).

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (opens http://localhost:5173)
npm run dev

# 3. Build for production → outputs to /dist
npm run build

# 4. Preview the production build locally
npm run preview
```

Deploy the contents of `/dist` to any static host (Vercel, Netlify, Cloudflare
Pages, S3 + CloudFront, GitHub Pages, etc.) — this is a fully static single-page
app, no server/backend is required to run it.

---

## 2. Tech stack & why

| Concern | Library | Notes |
|---|---|---|
| Build tool | **Vite** | Fast dev server + optimized production bundling, with manual code-splitting for the heavy 3D/animation vendor libs (see `vite.config.js`). |
| UI | **React 18** | Function components + hooks throughout. |
| Routing | **react-router-dom v6** | Client-side routing between Home / Shop / Product / About / Contact. |
| 3D | **three** + **@react-three/fiber** + **@react-three/drei** | Declarative Three.js scenes: the hero's rotating ring, and the per-product 3D viewer. |
| Scroll animation | **gsap** + **ScrollTrigger** | Fade/slide/scale-in reveals, staggered grids, filter transitions. |
| Smooth scrolling | **lenis** | Buttery inertial scrolling across the whole site, synced to GSAP's ticker so ScrollTrigger stays accurate (see `src/lib/SmoothScroll.jsx`). |

No CSS framework is used — the design system is a small, hand-written set of CSS
custom properties in `src/styles/global.css` (colors, type scale, spacing,
easing), which keeps the bundle light and the visual language consistent.

---

## 3. Folder structure

```
luxury-jewellery-site/
├── index.html                 # HTML shell — loads Google Fonts, mounts #root
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg            # Simple gold "A" monogram favicon
└── src/
    ├── main.jsx                # App entry point — mounts <App /> in <BrowserRouter>
    ├── App.jsx                 # Loader + SmoothScroll + Navbar/Footer + <Routes>
    ├── styles/
    │   └── global.css          # Design tokens (color/type/spacing) + all component CSS
    ├── lib/
    │   └── SmoothScroll.jsx    # Lenis provider, synced to gsap.ticker + ScrollTrigger
    ├── hooks/
    │   └── useScrollReveal.js  # useScrollReveal() + useStaggerReveal() GSAP hooks
    ├── components/
    │   ├── Navbar.jsx          # Sticky nav, scroll-aware styling, animated mobile menu
    │   ├── Footer.jsx
    │   ├── Loader.jsx          # Branded loading screen shown once on first mount
    │   ├── HeroScene.jsx       # Full-bleed R3F <Canvas> for the homepage hero
    │   ├── ProductViewer.jsx   # R3F <Canvas> + OrbitControls for the product page
    │   ├── JewelleryModel.jsx  # Procedural 3D geometry (ring/necklace/earring/bracelet)
    │   ├── GoldEnvironment.jsx # Procedural (network-free) reflection map for the gold material
    │   ├── ProductCard.jsx     # Shop grid tile with pointer-driven 3D tilt on hover
    │   ├── SectionReveal.jsx   # Declarative wrapper around useScrollReveal
    │   ├── Testimonials.jsx    # Auto-advancing quote carousel
    │   ├── Newsletter.jsx      # Validated email capture (stubbed submission)
    │   ├── ContactForm.jsx     # Validated contact form (stubbed submission)
    │   └── PlaceholderImage.jsx# Brand-toned gradient stand-in for real photography
    ├── data/
    │   ├── products.js         # Placeholder product catalogue (18 items, 5 categories)
    │   └── testimonials.js     # Placeholder client quotes
    └── pages/
        ├── Home.jsx             # Hero → Collections → Bestsellers → Story → Testimonials → Newsletter
        ├── Shop.jsx              # Category filter tabs + product grid
        ├── ProductDetail.jsx     # Single product + 3D viewer + "Add to bag" stub
        ├── About.jsx             # Mission, craftsmanship, timeline, artisans
        └── Contact.jsx           # Form + store info + embedded map
```

---

## 4. Page-by-page notes

### Home (`/`)
Full-viewport hero with the rotating 3D ring behind the headline, a scroll cue,
then Featured Collections (asymmetric image grid — not identical cards),
a horizontally-scrolling Bestsellers rail, a two-column Brand Story teaser on a
warm champagne accent section, an auto-advancing Testimonials carousel, and a
Newsletter signup. Every section below the hero animates in on scroll via
`SectionReveal` / `useStaggerReveal`.

### Shop (`/shop`)
Pill-style category tabs (`All`, `Rings`, `Necklaces`, `Earrings`, `Bracelets`,
`Bangles`) filter a responsive product grid client-side. Switching category
re-triggers a staggered fade so filtering itself feels intentional, not just a
DOM swap.

### Product detail (`/shop/:id`)
Looks up the product by its `id` from `src/data/products.js`. The left column
is a fully interactive 3D viewer (drag to orbit, scroll/pinch to zoom, gentle
auto-rotate when idle) built from `ProductViewer.jsx` + `JewelleryModel.jsx`.

### About (`/about`)
Mission and craftsmanship copy in alternating two-column blocks, a vertical
timeline (four real milestones — replace with your own brand history), and an
artisans/team grid.

### Contact (`/contact`)
Validated contact form (name / email / message, inline error states) on the
left, store info + social links + an embedded map on the right. Fields and
info blocks animate in via `SectionReveal`.

---

## 5. Design system

Defined as CSS custom properties at the top of `src/styles/global.css`:

- **Color** — a bright, warm palette built on a soft peach-blush background
  (`--color-bg` / `--color-bg-soft` / `--color-bg-soft-2`) — deliberately not
  a flat white/cream — with deep maroon-brown for primary text (`--color-ink`
  / `--color-ink-dim`), rich maroon for readable accent text, links and
  borders (`--color-maroon`), and antique gold for decorative fills, buttons
  and shimmer (`--color-gold` / `--color-gold-bright`). Every background on
  the site — the body, the loader, the scrolled navbar, alternating
  sections, the footer — is drawn from the same peach/terracotta family
  (just shifted lighter/darker/richer), rather than jumping between
  unrelated hues, so scrolling and page transitions never show a jarring
  color seam. Maroon is used for small accent text (labels, captions, footer
  headings) because it reads reliably on the blush background at any size;
  gold is reserved for large display text and decorative fills/borders. The
  background leans peach/terracotta rather than golden on purpose, so gold
  accents keep their contrast instead of blending into a same-hue backdrop.
- **Depth** — soft, warm-toned shadows (`--shadow-soft` / `--shadow-lift`)
  and rounded panel corners (`--radius-sm` / `--radius-md`) give product
  cards, collection tiles and imagery a sense of lift against the bright
  background. A faint jali-inspired lattice texture (`body::before`) — a nod
  to pierced stone temple screens — washes the whole page at ~5% opacity for
  quiet richness without ever competing with the content on top of it.
- **Type** — **Playfair Display** (serif) for all headings/display type,
  **Manrope** (sans) for body copy and UI chrome. Loaded via Google Fonts in
  `index.html`.
- **Motion** — a single shared easing curve (`--ease-luxe`,
  `cubic-bezier(0.22,1,0.36,1)`) is reused across hovers, reveals and
  transitions so the whole site feels like one consistent, high-end motion
  language rather than mismatched per-component easing.
- **Accessibility** — visible gold focus rings (`:focus-visible`), and a
  global `prefers-reduced-motion` media query that collapses all animation
  durations for users who've asked for reduced motion.

---

## 6. Replacing placeholder content

This project is fully functional out of the box, but **every piece of content
below is a placeholder** and should be replaced before a real launch.

### Replacing placeholder images
Every "photograph" in the site is actually `<PlaceholderImage />`
(`src/components/PlaceholderImage.jsx`) — a labelled, brand-toned gradient
panel, so the whole project runs with **zero external image requests**.

To swap one out for a real photo:
```jsx
// Before
<PlaceholderImage label="Solstice Solitaire Ring" tone="gold" />

// After — drop your image in /public/images/ and reference it directly
<img src="/images/solstice-solitaire-ring.jpg" alt="Solstice Solitaire Ring" />
```
You'll likely want a small `ProductImage` wrapper component if you're doing
this across the whole catalogue, so `object-fit`/aspect-ratio stays consistent
with `.product-card__media img` in `global.css`.

### Replacing the 3D models
The hero and product-viewer 3D pieces (`src/components/JewelleryModel.jsx`)
are built from **primitive Three.js geometry** (torus + polyhedra), not
imported 3D files — so there are no binary assets to track in git and the
project has zero setup steps to see 3D working.

To use real, scanned/modelled jewellery instead:
1. Export your model as a `.glb` and place it in `public/models/` (e.g.
   `public/models/ring.glb`).
2. In `JewelleryModel.jsx`, replace the procedural `<mesh>` markup with:
   ```jsx
   import { useGLTF } from '@react-three/drei';

   export default function JewelleryModel() {
     const { scene } = useGLTF('/models/ring.glb');
     return <primitive object={scene} />;
   }

   useGLTF.preload('/models/ring.glb');
   ```
3. Keep it wrapped in the existing `<Suspense fallback={null}>` in
   `HeroScene.jsx` / `ProductViewer.jsx` — GLTF loads asynchronously, and
   Suspense is already wired up to handle that gracefully.

**Why the ring needs `<GoldEnvironment />`:** the gold material is a fully
metallic PBR material (`metalness: 1`), which has no diffuse component — it
only shows color via *reflections*. Without an environment/reflection map,
a metal:1 material renders almost black except for hard specular hotspots.
`src/components/GoldEnvironment.jsx` builds that reflection map procedurally
from a few `<Lightformer>` panels (tinted with the site's own gold and
maroon brand colors) instead of fetching an HDRI file from a CDN, so it
costs zero network requests and renders identically every time. If you swap
in a real `.glb` model with its own baked-in materials, you can likely
remove `<GoldEnvironment />`; if you keep using metallic materials on the
new model, keep it (or swap it for `<Environment preset="studio" />` if
you're fine with the one external HDRI fetch that requires).

### Replacing product & catalogue data
Edit `src/data/products.js`. Each product needs: `id` (used in the product
detail URL), `name`, `category` (must match one of `CATEGORIES`), `price`,
`variant` (`ring` | `necklace` | `earring` | `bracelet` — controls which
procedural 3D silhouette is shown), `tone` (which placeholder gradient family
to use), and `description`. In production, swap this static array for a
fetch to your commerce backend/CMS — every component that consumes
`PRODUCTS`/`getProductById` will keep working unchanged as long as the shape
matches.

### Replacing testimonials
Edit `src/data/testimonials.js` — an array of `{ quote, name, location }`.

### Wiring up real form submissions
Both `Newsletter.jsx` and `ContactForm.jsx` currently validate input
client-side and then just flip to a "success" state — there's a `// TODO`
comment at the exact line to replace with a real request (e.g. to Klaviyo/
Mailchimp for the newsletter, and to Formspree, a serverless function, or
your own API route for the contact form).

### Replacing the map
`src/pages/Contact.jsx` embeds the boutique's address as a Google Maps
query via iframe (`mapQuery`, currently set to the Khammam address below).
Update it if the address changes, or swap the iframe for Mapbox/Google Maps
JS SDK if you want a styled, interactive map instead.

### Brand name & copy
"Sri Ranganatha Jewellers" appears in `Navbar.jsx`, `Footer.jsx`, `Loader.jsx`, and
`index.html`'s `<title>`/meta description — search the project for
"Sri Ranganatha Jewellers" to find and replace every instance, along with the
placeholder legal text in the footer.

---

## 7. Performance notes

- The Vite config manually splits `three`, `@react-three/fiber` +
  `@react-three/drei`, and `gsap` into their own chunks so the initial JS
  payload for a first paint stays small and the heavy 3D/animation code can
  be cached independently.
- 3D scenes are wrapped in `<Suspense>` so swapping in real, asynchronously-
  loaded `.glb` models (see above) won't require any additional loading-state
  code.
- All images are currently CSS-gradient placeholders (zero network requests);
  once you add real photography, serve modern formats (WebP/AVIF) at
  appropriate sizes and consider `loading="lazy"` on any images below the
  fold.
- `prefers-reduced-motion` is respected globally — verify this still holds
  after any custom animation work you add.

---

## 8. Browser support

Targets evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions).
Three.js/WebGL requires a browser/device with WebGL2 support; on devices
without WebGL, the `<Canvas>` will fail to render the 3D scene but the rest of
the page (copy, layout, non-3D animation) will continue to work normally.
If you need a WebGL-unavailable fallback image, wrap `<HeroScene />` /
`<ProductViewer />` in a small feature-detection check and render a
`<PlaceholderImage />` instead when WebGL isn't available.
