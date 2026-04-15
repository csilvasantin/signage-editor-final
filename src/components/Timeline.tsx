import React, { useRef } from 'react';
import { useCompositionStore } from '../store/useCompositionStore';

export const Timeline: React.FC = () => {
  const { elements, durationInFrames, currentFrame, setCurrentFrame, updateElement } = useCompositionStore();
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.round(percentage * durationInFrames);
    setCurrentFrame(Math.max(0, Math.min(frame, durationInFrames)));
  };

  const moveElement = (id: string, newFrameStart: number) => {
    updateElement(id, { frameStart: Math.max(0, newFrameStart) });
  };

  return (
    <div className="flex flex-col h-full bg-editor-panel select-none">
      {/* Time Ruler */}
      <div 
        ref={timelineRef}
        className="h-8 border-b border-editor-border relative cursor-pointer bg-editor-bg/50"
        onClick={handleTimelineClick}
      >
        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
          style={{ left: `${(currentFrame / durationInFrames) * 100}%` }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -mt-1 shadow-sm"></div>
        </div>

        {/* Seconds markers (simplified) */}
        {Array.from({ length: Math.ceil(durationInFrames / 30) }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 bottom-0 border-l border-editor-border/30 text-[10px] text-gray-500 pl-1 pt-1"
            style={{ left: `${(i * 30 / durationInFrames) * 100}%` }}
          >
            {i}s
          </div>
        ))}
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-y-auto bg-[#1a1a1a] relative min-h-[100px]">
        {elements.map((el, index) => (
          <div 
            key={el.id} 
            className="h-10 border-b border-editor-border/50 relative group"
          >
            {/* Track Name Label */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-editor-panel border-r border-editor-border flex items-center px-3 text-[10px] font-medium text-gray-400 z-10">
               {el.type.toUpperCase()} #{index + 1}
            </div>

            {/* Clip Bar */}
            <div 
              className="absolute h-7 top-1.5 bg-editor-accent/30 border border-editor-accent/50 rounded cursor-move hover:bg-editor-accent/40 transition-colors flex items-center px-2 text-[10px] text-white overflow-hidden"
              style={{ 
                left: `calc(128px + ${(el.frameStart / durationInFrames) * (100 - (128 / timelineRef.current?.clientWidth! * 100))}% )`,
                width: `${(el.durationInFrames / durationInFrames) * (100 - (128 / (timelineRef.current?.clientWidth || 1000) * 100))}%`,
                // Simplified calculation for demo, normally we'd use a more robust container-aware logic
                left: `${(el.frameStart / durationInFrames) * 100}%`,
                marginLeft: '128px',
                width: `calc(${(el.durationInFrames / durationInFrames) * 100}% - 128px)`
              }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startFrame = el.frameStart;
                
                const onMouseMove = (moveEvent: MouseEvent) => {
                  if (!timelineRef.current) return;
                  const deltaX = moveEvent.clientX - startX;
                  const deltaFrames = Math.round((deltaX / timelineRef.current.clientWidth) * durationInFrames);
                  moveElement(el.id, startFrame + deltaFrames);
                };
                
                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };
                
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
            >
              {el.properties.text || el.type}
            </div>
          </div>
        ))}
        
        {/* Playhead line extends through tracks */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-red-500/30 pointer-events-none"
          style={{ left: `${(currentFrame / durationInFrames) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
