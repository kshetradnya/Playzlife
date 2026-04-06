'use client';

import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Trail, Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

// Ultra Sword Quest logic
export const SwordQuest = ({ wristPos, onSlash }) => {
  const sword = useRef();
  const trail = useRef();

  useFrame((state) => {
    if (!sword.current || !wristPos) return;
    
    // Sword follows wrist with rotation
    sword.current.position.lerp(wristPos, 0.5);
    sword.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
    
    // Trail logic
    if (onSlash) onSlash();
  });

  return (
    <group ref={sword}>
      <Trail width={5} length={20} color={new THREE.Color('#00f5ff')} attenuation={(t) => t * t}>
        <Box args={[0.05, 1, 0.05]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={5} />
        </Box>
      </Trail>
      <Torus args={[0.1, 0.02, 16, 32]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333333" metalness={1} roughness={0} />
      </Torus>
    </group>
  );
};

// Ultra Dance Rhythm logic
export const DanceRhythm = ({ landmarks, onPerfect }) => {
  const [activeNote, setActiveNote] = useState(0);
  const cube = useRef();

  useFrame((state) => {
    if (!cube.current) return;
    cube.current.position.y = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
    
    // Simple pose matching logic
    if (landmarks && landmarks[15] && landmarks[15].y < 0.3) {
      onPerfect?.();
    }
  });

  return (
    <group position={[0, 1.5, -5]}>
      <Box ref={cube} args={[1, 1, 1]}>
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </Box>
      <Text position={[0, 1.5, 0]} fontSize={0.5} color="white">DANCE!</Text>
    </group>
  );
};

// Ultra Fitness Rep Counter
export const FitnessRepCounter = ({ landmarks, onRep }) => {
  const [reps, setReps] = useState(0);
  const [wasSquat, setWasSquat] = useState(false);

  useFrame(() => {
    if (!landmarks || landmarks.length < 24) return;
    
    const hipY = landmarks[23].y;
    const isSquatting = hipY > 0.6; // Normed y

    if (isSquatting && !wasSquat) {
      setWasSquat(true);
    } else if (!isSquatting && wasSquat) {
      setReps(r => r + 1);
      setWasSquat(false);
      onRep?.();
    }
  });

  return (
    <Center position={[0, 3, -10]}>
      <Text fontSize={2} color="#00ff66" font="/fonts/Inter-Bold.woff">{reps} REPS</Text>
    </Center>
  );
};
