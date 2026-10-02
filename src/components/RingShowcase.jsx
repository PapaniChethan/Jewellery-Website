import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useJewelleryMaterials } from './JewelleryModel.jsx';

/**
 * RingShowcase
 * -------------------------------------------------------------------------
 * The homepage hero ring, staged like a display piece: the same gold band
 * and diamond as the product viewer (shared materials), stood upright in a
 * solitaire setting so it reads as a ring from the front.
 *
 * Motion, all eased and slow:
 *   1. Entrance — once the intro lifts, the ring rises from below, turning
 *      in from a tilted angle and settling into a three-quarter view.
 *   2. Showcase — a gentle sway and float (no continuous spinning), with a
 *      warm light slowly orbiting so reflections travel across the metal,
 *      and an occasional soft glint on the stone and band.
 *   3. On desktop (fine pointer only) the ring leans a little towards the
 *      cursor. Touch devices keep the ambient motion only.
 *
 * Group nesting keeps each layer of motion independent:
 *   entrance (GSAP) → tilt (pointer) → sway (idle loop) → ring meshes
 *
 * With reduced motion the ring is shown at rest, fully still.
 */
const REST = { x: 0.16, y: -0.55 };
const GLINTS = [
  // [x, y, z, size, phase] — on the stone, and on each side of the band
  [0.06, 1.48, 0.22, 0.55, 0],
  [-0.97, 0.12, 0.16, 0.38, 2.1],
  [0.72, -0.7, 0.16, 0.32, 4.2],
];

/** Soft four-point star, drawn once into a small canvas texture. */
function useGlintTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;
    const glow = ctx.createRadialGradient(c, c, 0, c, c, c);
    glow.addColorStop(0, 'rgba(255,250,235,1)');
    glow.addColorStop(0.18, 'rgba(255,236,190,0.55)');
    glow.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255,248,228,0.9)';
    for (const [w, h] of [[size, 3], [3, size]]) {
      ctx.beginPath();
      ctx.ellipse(c, c, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** Four claws from the collet up to the stone's girdle. */
const PRONG_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

export default function RingShowcase({ start, reduceMotion, finePointer, anchor }) {
  const { viewport, size } = useThree();
  const entrance = useRef(null);
  const tilt = useRef(null);
  const sway = useRef(null);
  const orbitLight = useRef(null);
  const glints = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });
  const showcaseSince = useRef(null);

  const { goldMaterial, gemMaterial } = useJewelleryMaterials();
  // Faceted copy of the stone material, so the cut catches light per facet.
  const facetMaterial = useMemo(() => {
    const m = gemMaterial.clone();
    m.flatShading = true;
    return m;
  }, [gemMaterial]);
  const glintTexture = useGlintTexture();

  // Placement: to the right of the copy on landscape screens (where the
  // hero glow sits). On portrait screens HeroScene passes `anchor` — the
  // open space beside the buttons, in px — so the ring never sits behind
  // the headline or the buttons.
  const portrait = !!anchor;
  const unitsPerPx = viewport.width / size.width;
  const scale = anchor
    ? (anchor.size * unitsPerPx) / 2
    : Math.min(0.7, viewport.height / 4.8, viewport.width / 8);
  const posX = anchor ? (anchor.x / size.width - 0.5) * viewport.width : viewport.width * 0.23;
  // The stone sits above the band, so drop the ring slightly to centre the whole piece.
  const posY = anchor ? (0.5 - anchor.y / size.height) * viewport.height - 0.2 * scale : 0.02;

  // Entrance: plays once `start` flips true (the intro has lifted).
  useEffect(() => {
    const g = entrance.current;
    if (!g) return undefined;
    if (reduceMotion) {
      g.scale.setScalar(1);
      g.position.set(0, 0, 0);
      g.rotation.set(REST.x, REST.y, 0);
      showcaseSince.current = 0;
      return undefined;
    }
    g.scale.setScalar(0.55);
    g.position.set(0, -0.9, -0.6);
    g.rotation.set(0.95, REST.y - Math.PI * 1.25, -0.3);
    if (!start) return undefined;

    const tl = gsap.timeline({ onComplete: () => (showcaseSince.current = performance.now()) });
    tl.to(g.position, { y: 0, z: 0, duration: 2.2, ease: 'power3.out' }, 0)
      .to(g.scale, { x: 1, y: 1, z: 1, duration: 2.0, ease: 'power3.out' }, 0)
      .to(g.rotation, { x: REST.x, y: REST.y, z: 0, duration: 2.8, ease: 'expo.out' }, 0);
    return () => tl.kill();
  }, [start, reduceMotion]);

  // Desktop-only pointer tracking (normalised -1..1 across the window).
  useEffect(() => {
    if (!finePointer || reduceMotion) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer, reduceMotion]);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    const t = state.clock.elapsedTime;

    // Warm light slowly circling the ring — moving reflections on the gold.
    if (orbitLight.current) {
      const a = t * 0.45;
      orbitLight.current.position.set(posX + Math.cos(a) * 2.6, posY + 1.4 + Math.sin(a * 0.7) * 0.6, Math.sin(a) * 2 + 2.2);
    }

    // Lean towards the cursor, softly damped.
    if (tilt.current) {
      const k = 1 - Math.exp(-3 * delta);
      tilt.current.rotation.y += (pointer.current.x * 0.32 - tilt.current.rotation.y) * k;
      tilt.current.rotation.x += (pointer.current.y * 0.18 - tilt.current.rotation.x) * k;
    }

    // Idle showcase: sway + float, faded in after the entrance settles.
    if (sway.current && showcaseSince.current != null) {
      const s = (performance.now() - showcaseSince.current) / 1000;
      const ramp = Math.min(1, s / 2.5);
      const e = ramp * ramp * (3 - 2 * ramp); // smoothstep
      sway.current.rotation.y = Math.sin(s * 0.35) * 0.42 * e;
      sway.current.rotation.z = Math.sin(s * 0.27) * 0.05 * e;
      sway.current.position.y = Math.sin(s * 0.8) * 0.06 * e;

      // Brief, soft glints — a gentle swell every few seconds, never a flash.
      glints.current.forEach((sprite, i) => {
        if (!sprite) return;
        const [, , , size, phase] = GLINTS[i];
        const pulse = Math.pow(Math.max(0, Math.sin(s * 0.85 + phase)), 14) * e;
        sprite.scale.setScalar(size * pulse + 0.0001);
        sprite.material.rotation = s * 0.4 + i;
      });
    }
  });

  return (
    <>
      <pointLight ref={orbitLight} intensity={reduceMotion ? 0 : 5} distance={9} decay={1.6} color="#ffe2a8" />

      <group position={[posX, posY, 0]} scale={scale}>
        <group ref={entrance}>
          <group ref={tilt}>
            <group ref={sway}>
              {/* Band — torus widened along z for a comfort-fit profile */}
              <mesh material={goldMaterial} scale={[1, 1, 1.7]}>
                <torusGeometry args={[1, 0.1, 48, 160]} />
              </mesh>

              {/* Setting: collet + four claws */}
              <mesh material={goldMaterial} position={[0, 1.15, 0]}>
                <cylinderGeometry args={[0.2, 0.11, 0.18, 32]} />
              </mesh>
              {PRONG_ANGLES.map((a) => (
                <group key={a} position={[0, 1.31, 0]} rotation={[0, a, 0]}>
                  <mesh material={goldMaterial} position={[0.245, 0, 0]} rotation={[0, 0, -0.32]}>
                    <cylinderGeometry args={[0.02, 0.026, 0.27, 10]} />
                  </mesh>
                </group>
              ))}

              {/* Round brilliant stone: crown above the girdle, pavilion below */}
              <mesh material={facetMaterial} position={[0, 1.42, 0]}>
                <cylinderGeometry args={[0.17, 0.3, 0.1, 16]} />
              </mesh>
              <mesh material={facetMaterial} position={[0, 1.22, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.3, 0.3, 16]} />
              </mesh>

              {GLINTS.map(([x, y, z], i) => (
                <sprite key={i} ref={(el) => (glints.current[i] = el)} position={[x, y, z]} scale={0.0001}>
                  <spriteMaterial
                    map={glintTexture}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                  />
                </sprite>
              ))}
            </group>
          </group>
        </group>

        <Sparkles
          count={portrait ? 14 : 26}
          scale={[3.2, 3.2, 1.4]}
          size={2.2}
          speed={reduceMotion ? 0 : 0.25}
          color="#eccb82"
          opacity={0.55}
        />
      </group>

      <ContactShadows
        position={[posX, posY - 1.35 * scale, 0]}
        opacity={0.26}
        scale={4 * scale}
        blur={2.6}
        far={2}
        frames={reduceMotion ? 1 : Infinity}
      />
    </>
  );
}
