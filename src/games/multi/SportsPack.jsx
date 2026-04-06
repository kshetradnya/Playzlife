'use client';

import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Trail, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Ultra Basketball Game logic
export const BasketballHoops = ({ leftHand, rightHand, onScore }) => {
  const ball = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const [holding, setHolding] = useState(true);
  const [score, setScore] = useState(0);

  const resetBall = () => {
    setHolding(true);
    velocity.current.set(0, 0, 0);
  };

  useFrame((state, delta) => {
    if (!ball.current) return;

    if (holding && leftHand && rightHand) {
      // Ball follows midpoint of hands
      ball.current.position.lerp(
        new THREE.Vector3().addVectors(leftHand, rightHand).multiplyScalar(0.5),
        0.1
      );
      
      // Release detection (Hands moving forward/up fast)
      const speed = leftHand.distanceTo(rightHand);
      if (speed > 1.5) {
        setHolding(false);
        velocity.current.set(0, 8, -12);
      }
    } else {
      // Physics flight
      ball.current.position.addScaledVector(velocity.current, delta);
      velocity.current.y -= 9.8 * delta;

      // Rim collision (Simple)
      if (ball.current.position.distanceTo(new THREE.Vector3(0, 4, -10)) < 0.5) {
        onScore?.();
        setScore(s => s + 3);
        setHolding(true);
        setTimeout(resetBall, 1000);
      }

      if (ball.current.position.y < -5) resetBall();
    }
  });

  return (
    <group>
      {/* 3D Hoop (Ultra Style) */}
      <group position={[0, 4, -10]}>
        <Torus args={[0.45, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={1} />
        </Torus>
        <Box args={[1.5, 1, 0.1]} position={[0, 0.5, -0.5]}>
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </Box>
      </group>

      <Sphere ref={ball} args={[0.24, 32, 32]}>
        <meshStandardMaterial color="#ff6600" roughness={0.3} />
      </Sphere>
    </group>
  );
};

// Ultra Archery logic
export const ArcheryBow = ({ leftHand, rightHand, onShoot }) => {
  const arrow = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (!arrow.current) return;

    if (!active && leftHand && rightHand) {
      // Bow string tension logic
      const tension = leftHand.distanceTo(rightHand);
      if (tension > 1.2) {
        setActive(true);
        velocity.current.set(
            (leftHand.x - rightHand.x) * 20,
            (leftHand.y - rightHand.y) * 20,
            -50
        );
        onShoot?.();
      }
    }

    if (active) {
      arrow.current.position.addScaledVector(velocity.current, delta);
      if (arrow.current.position.z < -50) setActive(false);
    } else {
        arrow.current.position.set(0, 1.5, -0.5);
    }
  });

  return (
    <group>
      {/* 3D Arrow */}
      <Box ref={arrow} args={[0.05, 0.05, 1]}>
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" />
      </Box>

      {/* Target (Ultra detailed) */}
      <group position={[0, 1.5, -30]}>
        <Torus args={[2, 0.1, 16, 64]}>
            <meshStandardMaterial color="#ff0000" />
        </Torus>
        <Torus args={[1, 0.1, 16, 64]}>
            <meshStandardMaterial color="#ffff00" />
        </Torus>
      </group>
    </group>
  );
};
