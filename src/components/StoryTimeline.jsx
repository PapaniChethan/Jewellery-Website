import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * StoryTimeline
 * -------------------------------------------------------------------------
 * The founder's journey on the About page: labels on the left, milestone
 * copy on the right, joined by a fine vertical line with a gold dot at
 * each milestone (single column on small screens).
 *
 * Scroll motion: the gold line draws down as the reader moves through the
 * story; each milestone's label fades up, its heading and text follow in a
 * short stagger, and its dot warms to a soft gold glow. Only transform and
 * opacity are animated. With reduced motion everything is simply shown.
 */
export const STORY = [
  {
    label: '1992',
    title: 'The Beginning of a Passion',
    copy: 'After completing his 10th standard, Nageswar Rao began his journey in gold jewellery craftsmanship. With dedication and a love for the craft, he started making gold ornaments, learning and refining his skills through years of hands-on work.',
  },
  {
    label: 'The years that followed',
    title: 'Crafting with Trust',
    copy: 'As his experience grew, he began taking orders directly from customers, carefully crafting each ornament and creating designs to suit their wishes. His commitment to quality, detailed craftsmanship and customer satisfaction helped him build lasting relationships and trust.',
  },
  {
    label: '2016',
    title: 'A Dream Becomes Reality',
    copy: 'Taking the next step in his journey, Nageswar Rao opened his own jewellery shop, Sri Ranganatha Jewellery — turning years of craftsmanship and experience into a business of his own.',
  },
  {
    label: 'Since 2016',
    title: 'A Journey of Trust and Tradition',
    copy: 'Since then, Sri Ranganatha Jewellery has served customers with custom-made jewellery orders and a collection of ready-made gold and silver ornaments — with a continued focus on attractive designs, quality craftsmanship and fulfilling every customer’s jewellery needs.',
  },
];

export default function StoryTimeline() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // The gold line follows the reader through the story.
      gsap.fromTo(
        '.timeline__progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
        }
      );

      gsap.utils.toArray('.timeline-row', root).forEach((row) => {
        const q = gsap.utils.selector(row);
        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' },
          })
          .fromTo(q('.timeline-row__dot'), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.2)' }, 0)
          .fromTo(q('.timeline-row__dot'), { '--dot-glow': 0 }, { '--dot-glow': 1, duration: 0.9, ease: 'power2.out' }, 0.1)
          .fromTo(q('.timeline-row__year'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.05)
          .fromTo(
            q('.timeline-row__copy > *'),
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
            0.18
          );
      });
    }, root);

    return () => mm.revert();
  }, []);

  return (
    <div className="timeline" ref={rootRef}>
      <span className="timeline__progress" aria-hidden="true" />
      <ol className="timeline__list">
        {STORY.map((row) => (
          <li className="timeline-row" key={row.title}>
            <span className="timeline-row__dot" aria-hidden="true" />
            <div className={`timeline-row__year${/^\d{4}$/.test(row.label) ? '' : ' timeline-row__year--text'}`}>
              {row.label}
            </div>
            <div className="timeline-row__copy">
              <h3>{row.title}</h3>
              <p>{row.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
