'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

// Ultra spatial audio management for audience and game events
export const useSpatialAudio = () => {
  const sounds = useRef({});

  useEffect(() => {
    // SFX Definitions
    sounds.current = {
      cheer: new Howl({ src: ['https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg'], volume: 0.5, spatial: true }),
      hush: new Howl({ src: ['https://actions.google.com/sounds/v1/crowds/stadium_ambience.ogg'], volume: 0.2, loop: true }),
      hit: new Howl({ src: ['https://actions.google.com/sounds/v1/sports/tennis_hit.ogg'], volume: 1.0 }),
      score: new Howl({ src: ['https://actions.google.com/sounds/v1/crowds/applause.ogg'], volume: 0.7 })
    };

    sounds.current.hush.play();

    return () => {
      Object.values(sounds.current).forEach(s => s.stop());
    };
  }, []);

  const playEvent = (name, position = [0, 0, 0]) => {
    const sound = sounds.current[name];
    if (sound) {
      // Apply spatial position
      sound.pos(position[0], position[1], position[2]);
      sound.play();
    }
  };

  return { playEvent };
};
