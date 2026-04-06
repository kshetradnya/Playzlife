'use client';

import { useState, useRef, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { usePoseLandmarker } from '@/hooks/usePoseLandmarker';
import { Experience } from '@/components/3d/Experience';
import { 
  Play, 
  Settings, 
  Trophy, 
  User, 
  Camera, 
  Zap,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pre-defined Games
const GAMES = [
  { id: 'tennis_3d', title: 'Tennis Pro', icon: '🎾', color: '#00f5ff', difficulty: 'Medium' },
  { id: 'boxing_ultra', title: 'Cyber Boxing', icon: '🥊', color: '#ff0055', difficulty: 'Hard' },
  { id: 'football_stadium', title: 'Football Hero', icon: '⚽', color: '#00ff66', difficulty: 'Easy' },
  { id: 'basketball_shoot', title: 'Hoops Master', icon: '🏀', color: '#ff8800', difficulty: 'Medium' },
  { id: 'table_tennis', title: 'Table Tennis VR', icon: '🏓', color: '#ffffff', difficulty: 'V-Hard' },
  { id: 'archery_quest', title: 'Bow Master', icon: '🏹', color: '#ffd700', difficulty: 'Hard' },
  { id: 'dance_rhythm', title: 'Rhythm Dancer', icon: '💃', color: '#ff00ff', difficulty: 'Medium' },
  { id: 'fitness_coach', title: 'Pure Fitness', icon: '🏋️', color: '#00ccff', difficulty: 'Easy' },
  { id: 'sword_battle', title: 'Sword Quest', icon: '⚔️', color: '#6600ff', difficulty: 'Hard' },
  { id: 'dodge_fury', title: 'Neon Dodge', icon: '🚨', color: '#ff3300', difficulty: 'Extreme' },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [ultraMode, setUltraMode] = useState(true);
  const { videoRef, isActive: cameraActive, startCamera, stopCamera } = useCamera();
  const { isLoaded: aiLoaded } = usePoseLandmarker();

  return (
    <div className="relative min-h-screen">
      {/* 3D Background / Main Stage */}
      <div className="fixed inset-0 z-0">
        <Experience ultra={ultraMode}>
          {/* Main Home Scene content goes here */}
          {!selectedGame && (
            <group position={[0, 1.6, 0]}>
              <mesh position={[2, 0, -5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.5} />
              </mesh>
            </group>
          )}
        </Experience>
      </div>

      {/* Hero UI Layer */}
      <AnimatePresence>
        {!selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 p-8 pt-16 md:p-16 max-w-7xl mx-auto"
          >
            {/* Header Overlay */}
            <div className="flex justify-between items-center mb-16">
              <div>
                <motion.h1 
                  initial={{ x: -20 }} animate={{ x: 0 }}
                  className="text-6xl font-black neon-text italic tracking-tighter"
                >
                  PLAYZLIFE 
                  <span className="text-white block text-2xl font-light not-italic mt-2">
                    MOTION VR ECOSYSTEM
                  </span>
                </motion.h1>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setUltraMode(!ultraMode)}
                  className={`px-4 py-2 glass-panel rounded-full text-xs font-bold transition-all ${ultraMode ? 'neon-border text-cyan-400' : 'text-zinc-500'}`}
                >
                  {ultraMode ? 'ULTRA RENDERING ON' : 'PERFORMANCE MODE'}
                </button>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {GAMES.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedGame(game)}
                  className="group relative cursor-pointer glass-panel p-6 flex flex-col items-center justify-center gap-4 hover:neon-border overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-5xl group-hover:scale-125 transition-transform animate-float">
                    {game.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-black">
                      {game.difficulty}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="fixed left-8 bottom-8 flex flex-col gap-4">
              <div className="glass-panel p-4 flex items-center gap-4">
                <div className={`p-2 rounded-full ${cameraActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Camera size={16} />
                </div>
                <div>
                  <div className="text-[10px] opacity-50 font-bold uppercase">Tracking status</div>
                  <div className="text-xs font-bold">{cameraActive ? 'CAMERA CONNECTED' : 'WAITING FOR SENSOR'}</div>
                </div>
              </div>

              <div className="glass-panel p-4 flex items-center gap-4">
                <div className={`p-2 rounded-full ${aiLoaded ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-[10px] opacity-50 font-bold uppercase">AI Engine</div>
                  <div className="text-xs font-bold">{aiLoaded ? 'READY' : 'LOADING MODELS...'}</div>
                </div>
              </div>
            </div>

            <div className="fixed right-8 bottom-8">
              <button 
                onClick={cameraActive ? stopCamera : startCamera}
                className="px-8 py-4 glass-panel rounded-full font-black tracking-widest text-sm hover:neon-border flex items-center gap-4"
              >
                {cameraActive ? 'STOP SESSION' : 'INITIALIZE SENSOR'}
                <Play size={16} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Calibration Video / Canvas for Processing */}
      <div className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <video 
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-48 h-36 glass-panel rounded-lg mirror scale-x-[-1]"
        />
        <canvas id="pose-overlay" className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
