'use client';

import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Trail, Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

// Ultra Dodge Fury logic
export const DodgeFury = ({ headPos, onHit }) => {
  const projectile = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 10));
  const [active, setActive] = useState(true);

  const resetProjectile = () => {
    projectile.current.position.set((Math.random() - 0.5) * 4, 1.5, -20);
    velocity.current.z = 10 + Math.random() * 10;
    setActive(true);
  };

  useFrame((state, delta) => {
    if (!projectile.current || !active) return;

    projectile.current.position.addScaledVector(velocity.current, delta);
    
    // Collision check
    if (headPos && projectile.current.position.distanceTo(headPos) < 0.8) {
      onHit?.();
      setActive(false);
      setTimeout(resetProjectile, 1000);
    }

    if (projectile.current.position.z > 5) resetProjectile();
  });

  return (
    <group>
      <Float speed={10} rotationIntensity={2} floatIntensity={1}>
        <mesh ref={projectile} position={[0, 1.5, -10]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#ff3300" emissive="#ff3300" emissiveIntensity={5} />
        </mesh>
      </Float>
      
      {/* Laser lines */}
      <mesh position={[0, 1.5, -10]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 100]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Ultra Table Tennis logic (Fast rally)
export const TableTennis = ({ handPos, onScore }) => {
  const ball = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, -10));

  useFrame((state, delta) => {
    if (!ball.current) return;

    ball.current.position.addScaledVector(velocity.current, delta);
    
    // Table bounce
    if (ball.current.position.y < 0.8 && Math.abs(ball.current.position.z) < 2) {
      velocity.current.y *= -1;
    }

    // Paddle Hit
    if (handPos && ball.current.position.distanceTo(handPos) < 0.5) {
      velocity.current.z = -Math.abs(velocity.current.z) * 1.2;
      onScore?.();
    }

    if (ball.current.position.z < -10) velocity.current.z *= -1;
    if (ball.current.position.z > 5) velocity.current.z *= -1;
  });

  return (
    <group position={[0, 0.8, -2]}>
      {/* 3D Table */}
      <Box args={[1.5, 0.05, 2.7]}>
        <meshStandardMaterial color="#0044ff" roughness={0.1} />
      </Box>
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Fast Ball */}
      <Sphere ref={ball} args={[0.04, 16, 16]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
};
