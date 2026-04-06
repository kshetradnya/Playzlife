'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Avatar that mirrors MediaPipe landmarks
export const PlayerAvatar = ({ landmarks }) => {
  const group = useRef();

  // Create joint refs
  const joints = useMemo(() => ({
    nose: new THREE.Vector3(),
    leftWrist: new THREE.Vector3(),
    rightWrist: new THREE.Vector3(),
    leftAnkle: new THREE.Vector3(),
    rightAnkle: new THREE.Vector3(),
    leftHip: new THREE.Vector3(),
    rightHip: new THREE.Vector3(),
    leftShoulder: new THREE.Vector3(),
    rightShoulder: new THREE.Vector3(),
  }), []);

  // Map 2D landmarks to 3D space with depth simulation
  useFrame(() => {
    if (!landmarks || landmarks.length === 0) return;

    const scale = 3; // Scale the landmarks to 3D units
    const offset = [0, 1.6, -1]; // Position in front of camera

    // Mapping function: MediaPipe (x: 0-1, y: 0-1) -> R3F (x: -1.5to1.5, y: -2to2)
    const mapJoint = (idx) => {
      const lm = landmarks[idx];
      return [
        (0.5 - lm.x) * scale, // Flip X for mirror
        (0.5 - lm.y) * scale + 1.2,
        -lm.z * scale // Depth from MediaPipe
      ];
    };

    // Update joint positions
    const updateMesh = (name, lmIdx) => {
      const pos = mapJoint(lmIdx);
      const mesh = group.current.getObjectByName(name);
      if (mesh) {
        mesh.position.set(...pos);
      }
    };

    // Body parts mapping
    updateMesh('nose', 0);
    updateMesh('leftWrist', 15);
    updateMesh('rightWrist', 16);
    updateMesh('leftAnkle', 27);
    updateMesh('rightAnkle', 28);
    updateMesh('leftHip', 23);
    updateMesh('rightHip', 24);
    updateMesh('leftShoulder', 11);
    updateMesh('rightShoulder', 12);
  });

  return (
    <group ref={group}>
      {/* Head */}
      <Sphere name="nose" args={[0.15, 32, 32]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0} metalness={1} />
      </Sphere>

      {/* Hands with Glow Trails (Ultra Graphics) */}
      <Trail 
        width={2} 
        length={10} 
        color={new THREE.Color('#00f5ff')} 
        attenuation={(t) => t * t}
      >
        <Sphere name="leftWrist" args={[0.08, 16, 16]}>
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2} />
        </Sphere>
      </Trail>

      <Trail 
        width={2} 
        length={10} 
        color={new THREE.Color('#7c3aed')} 
        attenuation={(t) => t * t}
      >
        <Sphere name="rightWrist" args={[0.08, 16, 16]}>
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} />
        </Sphere>
      </Trail>

      {/* Torso & Limbs (Simplified for Performance/Ultra Look) */}
      {['leftAnkle', 'rightAnkle', 'leftHip', 'rightHip', 'leftShoulder', 'rightShoulder'].map(name => (
        <Sphere key={name} name={name} args={[0.06, 16, 16]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} transparent opacity={0.8} />
        </Sphere>
      ))}

      {/* Dynamic Lighting from the player */}
      <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#00f5ff" />
    </group>
  );
};
