'use client';

import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Trail, MeshWobbleMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Ultra-detailed Cyber Boxing Mechanics
export const BoxingStage = ({ playerPos, onPunch }) => {
  const opponent = useRef();
  const [health, setHealth] = useState(100);
  const [isHit, setIsHit] = useState(false);
  const lastPunchTime = useRef(0);

  useFrame((state, delta) => {
    if (!opponent.current) return;

    // Opponent Animation (Ultra fluid)
    const time = state.clock.getElapsedTime();
    opponent.current.position.y = 1.6 + Math.sin(time * 2) * 0.1;
    opponent.current.position.x = Math.sin(time * 3) * 0.5;

    // Detect Punch (Rapid wrist movement forward)
    if (playerPos && !isHit && Date.now() - lastPunchTime.current > 500) {
      const dist = playerPos.distanceTo(opponent.current.position);
      if (dist < 1.2) {
        setHealth(h => Math.max(0, h - 10));
        setIsHit(true);
        lastPunchTime.current = Date.now();
        onPunch?.();
        setTimeout(() => setIsHit(false), 200);
      }
    }
  });

  return (
    <group>
      {/* 3D Cyber Opponent */}
      <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={opponent} position={[0, 1.6, -2]}>
          <boxGeometry args={[0.8, 1.2, 0.4]} />
          <MeshWobbleMaterial 
            color={isHit ? "#ff0055" : "#7c3aed"} 
            factor={isHit ? 2 : 0.5} 
            speed={10} 
            emissive={isHit ? "#ff0055" : "#000000"}
            emissiveIntensity={isHit ? 2 : 0}
          />
        </mesh>
      </Float>

      {/* Arena Lighting (Boxing Specific) */}
      <spotLight 
        position={[0, 5, -2]} 
        intensity={5} 
        angle={0.5} 
        penumbra={1} 
        color="#ff0055" 
        castShadow 
      />

      {/* Floating Health Bar (Ultra Style) */}
      <group position={[0, 3, -2]}>
        <mesh>
          <planeGeometry args={[2, 0.1]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[(-1 + health/100), 0, 0.01]}>
          <planeGeometry args={[2 * (health/100), 0.1]} />
          <meshBasicMaterial color={health > 30 ? "#00f5ff" : "#ff0055"} />
        </mesh>
      </group>
    </group>
  );
};
