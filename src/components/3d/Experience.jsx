'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Float, 
  Text,
  Center,
  Preload
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  SSAO, 
  Vignette, 
  ChromaticAberration,
  Noise
} from '@react-three/postprocessing';
import { Perf } from 'r3f-perf';

// High-fidelity Neon Grid Floor
const NeonGrid = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial 
      color="#0a0e1a" 
      emissive="#00f5ff" 
      emissiveIntensity={0.05} 
      roughness={0.1}
      metalness={0.8}
    />
  </mesh>
);

// Immersive 3D Experience Root
export const Experience = ({ children, ultra = true }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      camera={{ position: [0, 1.6, 5], fov: 45 }}
      style={{ background: '#050a14' }}
    >
      <color attach="background" args={['#050a14']} />
      
      {/* Lighting & Environment */}
      <Suspense fallback={null}>
        <Environment preset="city" intensity={0.5} />
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          castShadow 
          intensity={2} 
          shadow-bias={-0.0001}
        />
        
        {/* Main Floor & Props */}
        <ContactShadows 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
          resolution={512} 
          color="#000000" 
        />
        <NeonGrid />
        
        {/* Game Content */}
        {children}

        {/* Post-Processing (Ultra Graphics) */}
        {ultra && (
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={1.2} 
              mipmapBlur 
              intensity={0.5} 
              radius={0.4} 
            />
            <SSAO 
              intensity={10} 
              radius={0.05} 
              luminanceInfluence={0.5} 
              color="#000000" 
            />
            <ChromaticAberration offset={[0.001, 0.001]} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <Noise opacity={0.02} />
          </EffectComposer>
        )}

        <Preload all />
      </Suspense>

      <Perf position="bottom-right" theme="dark" />
    </Canvas>
  );
};
