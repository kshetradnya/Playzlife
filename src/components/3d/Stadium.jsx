'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Box, Sphere, GradientTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Audience Simulation (Detailed / Ultra)
// Uses InstancedMesh for performance with high visual count
export const Stadium = ({ cheering = false }) => {
  const fansCount = 200;
  
  // Distribute fans in an arc / stadium shape
  const fanPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < fansCount; i++) {
        const angle = (i / fansCount) * Math.PI * 1.5 - Math.PI * 0.75;
        const radius = 10 + Math.random() * 2;
        const height = (radius - 10) * 2 + Math.random() * 0.5;
        pos.push({
            position: [Math.sin(angle) * radius, height, Math.cos(angle) * radius],
            color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
            offset: Math.random() * Math.PI * 2
        });
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Stadium Structure (High-Detail Procedural) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
      </mesh>

      {/* Floodlights (Ultra Volumetric-ish) */}
      <group position={[0, 10, -15]}>
        <spotLight 
          position={[0, 0, 0]} 
          intensity={5} 
          angle={0.8} 
          penumbra={0.5} 
          color="#00f5ff" 
          castShadow 
        />
        <mesh>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>
      </group>

      {/* Instanced Audience */}
      <Instances range={fansCount}>
        <boxGeometry args={[0.3, 0.5, 0.3]} />
        <meshStandardMaterial roughness={0.8} />
        {fanPositions.map((fan, i) => (
          <FanInstance key={i} {...fan} cheering={cheering} />
        ))}
      </Instances>

      {/* Atmosphere / Fog-like depth */}
      <fog color="#050a14" attach="fog" near={5} far={30} />
    </group>
  );
};

const FanInstance = ({ position, color, offset, cheering }) => {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const jump = cheering 
      ? Math.sin(time * 10 + offset) * 0.2 
      : Math.sin(time * 2 + offset) * 0.05;
    
    ref.current.position.y = position[1] + jump;
  });

  return (
    <Instance 
      ref={ref} 
      position={position} 
      color={color} 
      scale={[1, 1 + Math.random() * 0.2, 1]} 
    />
  );
};
