'use client';

import { use, useState, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { usePoseLandmarker } from '@/hooks/usePoseLandmarker';
import { Experience } from '@/components/3d/Experience';
import { InteractionHub } from '@/components/3d/InteractionHub';
import { Stadium } from '@/components/3d/Stadium';
import { ArrowLeft, Maximize, Settings, Camera, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GamePage({ params }) {
  const { id } = use(params);
  const { videoRef, isActive, startCamera, stopCamera } = useCamera();
  const { isLoaded: aiLoaded } = usePoseLandmarker();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Game Canvas (Ultra Rendering) */}
      <div className="absolute inset-0 z-0">
        <Experience ultra={true}>
          <Stadium cheering={true} />
          <InteractionHub videoRef={videoRef} gameType={id} />
        </Experience>
      </div>

      {/* Controller HUD (Glassmorphism) */}
      <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/">
            <button className="glass-panel p-4 flex items-center gap-3 hover:neon-border">
              <ArrowLeft size={18} />
              <span className="font-bold tracking-widest text-xs uppercase">Dashboard</span>
            </button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 items-end">
          <div className="glass-panel px-6 py-4">
            <h2 className="text-2xl font-black neon-text italic uppercase">{id.replace('_', ' ')}</h2>
            <div className="h-1 bg-cyan-500/20 mt-2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className={`glass-panel p-3 ${isActive ? 'text-cyan-400 border-cyan-400/50' : 'text-red-400'}`}>
              <Camera size={16} />
            </div>
            <div className={`glass-panel p-3 ${aiLoaded ? 'text-purple-400 border-purple-400/50' : 'text-zinc-600'}`}>
              <Zap size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Privacy Feed (Top Right) */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="glass-panel p-2 overflow-hidden border-2 border-white/5 shadow-2xl">
          <video 
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-48 h-36 rounded-xl mirror scale-x-[-1] grayscale contrast-125"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-widest">LIVE SENSOR</span>
          </div>
        </div>
      </div>

      {/* Game Context Hints */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <div className="glass-panel p-6 max-w-xs">
          <div className="text-[10px] opacity-50 font-black tracking-widest uppercase mb-2">Instructions</div>
          <p className="text-xs leading-relaxed opacity-80">
            Swing your **RIGHT ARM** to hit the ball. <br/>
            Make sure your full body is visible in the sensor feed.
          </p>
        </div>
      </div>
    </div>
  );
}
