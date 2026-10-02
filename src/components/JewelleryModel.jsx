import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The shared gold + stone materials, also used by the homepage
 * RingShowcase so the hero ring and the product viewer match exactly.
 */
export function useJewelleryMaterials() {
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#d9a83e', // exact --color-gold-bright from the site's CSS theme
        metalness: 1,
        roughness: 0.22,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        reflectivity: 0.9,
        envMapIntensity: 1.3,
      }),
    []
  );

  const gemMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#fffaf1',
        metalness: 0,
        roughness: 0.03,
        transmission: 0.94,
        thickness: 1.4,
        ior: 2.2,
        clearcoat: 1,
      }),
    []
  );

  return { goldMaterial, gemMaterial };
}

/**
 * JewelleryModel
 * -------------------------------------------------------------------------
 * PLACEHOLDER 3D GEOMETRY — built procedurally from primitive Three.js
 * geometry (torus + polyhedra) so the site has a working, dependency-free
 * 3D centerpiece without shipping any binary .glb/.gltf files.
 *
 * To use real jewellery models instead:
 *   1. Drop a .glb file into /public/models/ (e.g. /public/models/ring.glb)
 *   2. Replace the contents of this component with drei's useGLTF, e.g.
 *        import { useGLTF } from '@react-three/drei';
 *        const { scene } = useGLTF('/models/ring.glb');
 *        return <primitive object={scene} />;
 *   3. See README.md → "Replacing the 3D models" for a full walkthrough.
 *
 * variant: 'ring' | 'necklace' | 'earring' | 'bracelet' — swaps the
 * procedural silhouette so each shop category still reads as distinct.
 *
 * Note on the gold material: a fully metallic PBR material (metalness: 1)
 * only reflects light from its *environment* — it has no diffuse
 * component — so without an environment/reflection map it renders almost
 * black except for direct specular hotspots. The actual gold reflections
 * come from the procedural <Environment>/<Lightformer> rig set up in
 * HeroScene.jsx and ProductViewer.jsx, not from this material alone.
 */
export default function JewelleryModel({ variant = 'ring', autoRotateSpeed = 0.35 }) {
  const group = useRef(null);
  const gem = useRef(null);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * autoRotateSpeed;
    if (gem.current) gem.current.rotation.y -= delta * 0.9;
  });

  const { goldMaterial, gemMaterial } = useJewelleryMaterials();

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <group ref={group}>
        {variant === 'ring' && (
          <>
            <mesh material={goldMaterial} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <torusGeometry args={[1, 0.16, 48, 128]} />
            </mesh>
            <mesh ref={gem} material={gemMaterial} position={[0, 1.05, 0]} castShadow>
              <octahedronGeometry args={[0.42, 0]} />
            </mesh>
          </>
        )}

        {variant === 'necklace' && (
          <>
            <mesh material={goldMaterial} rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[1.3, 0.035, 32, 200, Math.PI * 1.5]} />
            </mesh>
            <mesh ref={gem} material={gemMaterial} position={[0, -1.05, 0]}>
              <icosahedronGeometry args={[0.34, 0]} />
            </mesh>
          </>
        )}

        {variant === 'earring' && (
          <group>
            {[-0.55, 0.55].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh material={goldMaterial} position={[0, 0.55, 0]}>
                  <torusGeometry args={[0.18, 0.03, 16, 48]} />
                </mesh>
                <mesh material={gemMaterial} position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.22, 32, 32]} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {variant === 'bracelet' && (
          <mesh material={goldMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.1, 0.1, 24, 96]} />
          </mesh>
        )}
      </group>
      <Sparkles count={40} scale={4} size={2.4} speed={0.35} color="#eccb82" opacity={0.6} />
    </Float>
  );
}
