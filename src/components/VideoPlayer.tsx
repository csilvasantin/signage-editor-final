import React, { useEffect, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { MainComposition } from '../remotion/Composition';
import { useCompositionStore } from '../store/useCompositionStore';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { width, height, fps, durationInFrames, elements, currentFrame, setCurrentFrame } = useCompositionStore();

  const compositionState = { width, height, fps, durationInFrames, elements };

  // Sync store currentFrame to Player
  useEffect(() => {
    const player = playerRef.current;
    if (player && player.getCurrentFrame() !== currentFrame) {
      player.seekTo(currentFrame);
    }
  }, [currentFrame]);

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
      }}
    >
      <Player
        ref={playerRef}
        component={MainComposition}
        inputProps={compositionState}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          width: '100%',
          height: '100%',
        }}
        onFrameUpdate={(frame) => {
          // Sync Player currentFrame back to Store
          setCurrentFrame(frame);
        }}
        controls
      />
    </div>
  );
};
