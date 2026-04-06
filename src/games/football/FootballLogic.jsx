'use client';

import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Trail, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Ultra Football Kicking Simulation
export const FootballStage = ({ playerPos, onKick }) => {
  const ball = useRef();
  const [active, setActive] = useState(false);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  const resetBall = () => {
    ball.current.position.set(0, 0.2, -5);
    velocity.current.set(0, 0, 0);
    setActive(true);
  };

  useEffect(() => resetBall(), []);

  useFrame((state, delta) => {
    if (!active || !ball.current) return;

    // Detect Kick (Leg lift + snap forward)
    if (playerPos && playerPos.distanceTo(ball.current.position) < 0.8) {
        velocity.current.set(
            (ball.current.position.x - playerPos.x) * 10,
            Math.abs(ball.current.position.y - playerPos.y) * 20,
            -15
        );
        onKick?.();
    }

    // Ball Physics
    ball.current.position.addScaledVector(velocity.current, delta);
    velocity.current.y -= 9.8 * delta;
    velocity.current.multiplyScalar(0.99); // Drag

    if (ball.current.position.y < 0.2) {
      ball.current.position.y = 0.2;
      velocity.current.y *= -0.6;
    }

    if (ball.current.position.z < -20) resetBall();
  });

  return (
    <group>
      {/* 3D Goal Post (Ultra Graphics) */}
      <mesh position={[0, 2.5, -15]}>
        <boxGeometry args={[10, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-5, 1.25, -15]}>
        <boxGeometry args={[0.2, 2.5, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[5, 1.25, -15]}>
        <boxGeometry args={[0.2, 2.5, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 3D Football */}
      <Trail 
        width={1} 
        length={15} 
        color={new THREE.Color('#ffffff')} 
        attenuation={(t) => t * t}
      >
        <Sphere ref={ball} args={[0.25, 32, 32]}>
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.5} />
        </Sphere>
      </Trail>

      {/* Pitch Lighting */}
      <spotLight position={[0, 10, -5]} intensity={3} color="#00ff66" />
    </group>
  );
};
