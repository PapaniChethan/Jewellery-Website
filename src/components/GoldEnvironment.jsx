import { Environment, Lightformer } from '@react-three/drei';

/**
 * GoldEnvironment
 * -------------------------------------------------------------------------
 * Fully-metallic PBR materials (metalness: 1, as used for the ring/jewellery
 * gold — see JewelleryModel.jsx) only reflect their *environment*; with only
 * direct lights they render almost black except for hard specular hotspots.
 *
 * Rather than fetching an HDRI file from a CDN (an external network
 * dependency, and one more thing that can fail to load), this builds the
 * reflection environment procedurally from a few <Lightformer> panels —
 * drei renders them into a small cubemap behind the scenes. It costs zero
 * network requests and renders identically every time.
 *
 * The panels are tinted with the site's own gold and maroon brand colors,
 * so the metal's reflections pick up a warm, on-brand glow instead of
 * generic white studio light.
 */
export default function GoldEnvironment({ rimColor = '#8a1338' }) {
  return (
    <Environment resolution={128} background={false}>
      {/* Large soft key light from above */}
      <Lightformer form="rect" intensity={3.2} color="#fff8ec" position={[0, 5, 2]} rotation={[-Math.PI / 2.5, 0, 0]} scale={[8, 8, 1]} />
      {/* Warm gold fill from one side */}
      <Lightformer form="rect" intensity={2.4} color="#e0a83c" position={[-5, 0.5, 1]} rotation={[0, Math.PI / 2.2, 0]} scale={[5, 5, 1]} />
      {/* Maroon brand-tinted fill from the other side, for a subtle on-brand rim reflection */}
      <Lightformer form="rect" intensity={1.8} color={rimColor} position={[5, 0.5, 1]} rotation={[0, -Math.PI / 2.2, 0]} scale={[5, 5, 1]} />
      {/* Soft ring light from below to lift shadowed facets */}
      <Lightformer form="ring" intensity={1.4} color="#fff8ec" position={[0, -4, 2]} scale={4} />
    </Environment>
  );
}
