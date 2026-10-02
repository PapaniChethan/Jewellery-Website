import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * SectionReveal
 * -------------------------------------------------------------------------
 * Thin declarative wrapper around useScrollReveal so any block of markup
 * can be animated in on scroll just by wrapping it, e.g.:
 *   <SectionReveal direction="up"><h2>Title</h2></SectionReveal>
 */
export default function SectionReveal({ children, as: Tag = 'div', className, ...opts }) {
  const ref = useScrollReveal(opts);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
