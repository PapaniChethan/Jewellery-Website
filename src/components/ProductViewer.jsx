import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import JewelleryModel from './JewelleryModel.jsx';
import GoldEnvironment from './GoldEnvironment.jsx';

/**
 * ProductViewer
 * -------------------------------------------------------------------------
 * Click-to-rotate 3D viewer used on the product detail page. Drag to orbit;
 * auto-rotates gently when idle. See JewelleryModel.jsx for how to swap the
 * procedural placeholder geometry for a real .glb product scan, and
 * GoldEnvironment.jsx for why the metal needs an environment map to read as
 * gold at all.
 */
export default function ProductViewer({ variant = 'ring' }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} color="#fff8ec" />
      <pointLight position={[-3, -2, -2]} intensity={0.55} color="#c65a72" />
      <pointLight position={[2, -1, 3]} intensity={0.5} color="#e0a83c" />

      <Suspense fallback={null}>
        <GoldEnvironment />
        <JewelleryModel variant={variant} autoRotateSpeed={0.2} />
        <ContactShadows position={[0, -1.3, 0]} opacity={0.3} scale={7} blur={2.4} far={2} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.6}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
