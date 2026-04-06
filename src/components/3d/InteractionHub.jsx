'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePoseLandmarker } from '@/hooks/usePoseLandmarker';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';
import { PlayerAvatar } from './PlayerAvatar';
import { TennisBall } from '@/games/tennis/TennisLogic';
import { BoxingStage } from '@/games/boxing/BoxingLogic';
import { FootballStage } from '@/games/football/FootballLogic';
import { BasketballHoops, ArcheryBow } from '@/games/multi/SportsPack';
import { SwordQuest, DanceRhythm, FitnessRepCounter } from '@/games/multi/ActionPack';
import { DodgeFury, TableTennis } from '@/games/multi/FrenzyPack';
import * as THREE from 'three';

// Interaction Hub connecting AI, Audio, and 3D Scenes
export const InteractionHub = ({ videoRef, gameType = 'tennis' }) => {
  const { landmarker, isLoaded } = usePoseLandmarker();
  const { playEvent } = useSpatialAudio();
  const [landmarks, setLandmarks] = useState([]);
  const lastVideoTime = useRef(-1);

  useFrame(() => {
    if (!isLoaded || !landmarker || !videoRef.current) return;

    const video = videoRef.current;
    if (video.currentTime !== lastVideoTime.current) {
      lastVideoTime.current = video.currentTime;
      const results = landmarker.detectForVideo(video, performance.now());
      if (results.worldLandmarks && results.worldLandmarks.length > 0) {
        setLandmarks(results.worldLandmarks[0]);
      }
    }
  });

  const getJoint = (idx) => {
    if (!landmarks || landmarks.length <= idx) return null;
    const lm = landmarks[idx];
    return new THREE.Vector3((0.5 - lm.x) * 3, (0.5 - lm.y) * 3 + 1.2, -lm.z * 3);
  };

  return (
    <group>
      <PlayerAvatar landmarks={landmarks} />

      {gameType === 'tennis_3d' && (
        <TennisBall playerPos={getJoint(16)} onHit={() => playEvent('hit')} onScore={() => playEvent('score')} />
      )}
      {gameType === 'boxing_ultra' && (
        <BoxingStage playerPos={getJoint(16)} onPunch={() => playEvent('hit')} />
      )}
      {gameType === 'football_stadium' && (
        <FootballStage playerPos={getJoint(28)} onKick={() => playEvent('hit')} />
      )}
      {gameType === 'basketball_shoot' && (
        <BasketballHoops leftHand={getJoint(15)} rightHand={getJoint(16)} onScore={() => playEvent('score')} />
      )}
      {gameType === 'archery_quest' && (
        <ArcheryBow leftHand={getJoint(15)} rightHand={getJoint(16)} onShoot={() => playEvent('hit')} />
      )}
      {gameType === 'sword_battle' && (
        <SwordQuest wristPos={getJoint(16)} onSlash={() => playEvent('hit')} />
      )}
      {gameType === 'dance_rhythm' && (
        <DanceRhythm landmarks={landmarks} onPerfect={() => playEvent('score')} />
      )}
      {gameType === 'fitness_coach' && (
        <FitnessRepCounter landmarks={landmarks} onRep={() => playEvent('hit')} />
      )}
      {gameType === 'dodge_fury' && (
        <DodgeFury headPos={getJoint(0)} onHit={() => playEvent('hit')} />
      )}
      {gameType === 'table_tennis' && (
        <TableTennis handPos={getJoint(16)} onScore={() => playEvent('score')} />
      )}
    </group>
  );
};
