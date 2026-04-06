'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

// 3D Tennis Ball Physics
export const TennisBall = ({ playerPos, onScore, onHit }) => {
  const ball = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, -5));
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);

  // Ball Reset logic
  const resetBall = () => {
    ball.current.position.set(0, 2, -10);
    velocity.current.set(
      (Math.random() - 0.5) * 4,
      Math.random() * 2 + 1,
      5 + Math.random() * 5
    );
    setActive(true);
  };

  useEffect(() => {
    resetBall();
  }, []);

  useFrame((state, delta) => {
    if (!active || !ball.current) return;

    // Apply Velocity
    ball.current.position.addScaledVector(velocity.current, delta);
    
    // Gravity simulation
    velocity.current.y -= 9.8 * delta * 0.1;

    // Bounce on floor
    if (ball.current.position.y < 0.1) {
      ball.current.position.y = 0.1;
      velocity.current.y *= -0.8; // Lose energy
      onHit?.('floor');
    }

    // Wall / Boundary check
    if (Math.abs(ball.current.position.x) > 10) velocity.current.x *= -1;
    if (ball.current.position.z < -20) velocity.current.z *= -1;

    // Player Hit Detection (Racquet is the right wrist)
    if (playerPos && ball.current.position.distanceTo(playerPos) < 1.5) {
      // Check for swing velocity/timing
      velocity.current.z = -Math.abs(velocity.current.z) * 1.5; // Reflect back
      velocity.current.x += (playerPos.x - ball.current.position.x) * 2;
      velocity.current.y += 2;
      onHit?.('racquet');
      console.log("HIT!");
    }

    // Out of bounds / Scoring
    if (ball.current.position.z > 5) {
      setActive(false);
      onScore?.(10);
      setScore(s => s + 10);
      setTimeout(resetBall, 2000); // 2s delay for reset
    }
  });

  return (
    <group>
      <Trail 
        width={1} 
        length={20} 
        color={new THREE.Color('#ffff00')} 
        attenuation={(t) => t * t}
      >
        <Sphere ref={ball} args={[0.1, 16, 16]}>
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </Sphere>
      </Trail>
      
      {/* Floating Score (Ultra Style) */}
      <Center position={[0, 5, -10]} rotation={[0, 0, 0]}>
        <Text font="/fonts/Inter-Bold.woff" fontSize={2} color="#00f5ff" maxWidth={200} lineHeight={1} letterSpacing={0.02} textAlign="left">
          {score}
        </Text>
      </Center>
    </group>
  );
};
