import SectionReveal from '../components/SectionReveal.jsx';
import JewelleryImage from '../components/JewelleryImage.jsx';
import { IMAGES } from '../data/images.js';
import StoryTimeline from '../components/StoryTimeline.jsx';

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="label">Our Story</p>
          <h1>Slow jewellery, made to last generations.</h1>
          <p>
            Sri Ranganatha Jewellers was founded on a simple belief: that jewellery should be
            made as carefully as it is worn. Every piece begins as a sketch, not a
            spreadsheet.
          </p>
        </div>
      </section>

      {/* ---------------- MISSION / CRAFTSMANSHIP BLOCKS ---------------- */}
      <section className="section section--tight">
        <div className="wrap" style={{ display: 'grid', gap: 'clamp(4rem, 8vw, 7rem)' }}>
          <div className="story-block">
            <SectionReveal as="div" className="story-block__media" direction="left">
              <JewelleryImage image={IMAGES.OurStory[0]} priority />
            </SectionReveal>
            <SectionReveal as="div" className="story-block__copy" direction="right">
              <p className="label">Our Mission</p>
              <h2>Jewellery, not inventory</h2>
              <p>
                We design in small, deliberate collections rather than chasing
                seasonal trends. Every piece is made to be worn for decades — and
                repaired, resized and passed on rather than replaced.
              </p>
            </SectionReveal>
          </div>

          <div className="story-block story-block--reverse">
            <SectionReveal as="div" className="story-block__media" direction="right">
              <JewelleryImage image={IMAGES.Earrings[1]} />
            </SectionReveal>
            <SectionReveal as="div" className="story-block__copy" direction="left">
              <p className="label">Craftsmanship</p>
              <h2>Every stone, set by hand</h2>
              <p>
                Our setters spend up to eleven years training before setting a
                stone on a client piece. We use only recycled 18k gold and
                platinum, and stones traceable to their country of origin.
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ---------------- TIMELINE ---------------- */}
      <section className="section section--deep">
        <div className="wrap">
          <SectionReveal as="div" className="section-head" direction="up">
            <h2>A Brief History</h2>
            <p>The journey of our founder, Nageswar Rao — from a young goldsmith to Sri Ranganatha Jewellery.</p>
          </SectionReveal>

          <StoryTimeline />
        </div>
      </section>
    </>
  );
}
