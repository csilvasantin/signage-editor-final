import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { CompositionState, CompositionElement } from '../types';

const ElementRenderer: React.FC<{ element: CompositionElement }> = ({ element }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de Entrada (Entrance)
  let entranceOpacity = 1;
  let entranceTranslateY = 0;
  let entranceScale = 1;

  if (element.animations?.entrance) {
    const { type, durationInFrames } = element.animations.entrance;
    const progress = spring({
      frame,
      fps,
      config: { damping: 12 },
      durationInFrames,
    });

    if (type === 'fade') {
      entranceOpacity = progress;
    } else if (type === 'slide') {
      entranceTranslateY = interpolate(progress, [0, 1], [50, 0]);
      entranceOpacity = progress;
    } else if (type === 'zoom') {
      entranceScale = interpolate(progress, [0, 1], [0.8, 1]);
      entranceOpacity = progress;
    }
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `scale(${element.scale * entranceScale}) rotate(${element.rotation}deg) translateY(${entranceTranslateY}px)`,
    opacity: element.opacity * entranceOpacity,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  return (
    <div style={style}>
      {element.type === 'text' && (
        <span style={{ fontSize: element.properties.fontSize, color: element.properties.color, fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          {element.properties.text}
        </span>
      )}

      {element.type === 'widget-clima' && (
        <div className="bg-blue-600/80 text-white p-4 rounded-xl w-full h-full flex flex-col items-center justify-center border-2 border-white/20">
          <span className="text-4xl">☀️</span>
          <span className="text-2xl font-bold">24°C</span>
          <span className="text-[10px] uppercase tracking-wider opacity-80">Madrid</span>
        </div>
      )}

      {element.type === 'widget-rss' && (
        <div className="bg-gray-900 text-white p-4 w-full h-full border-l-4 border-editor-accent flex flex-col justify-center">
          <span className="text-[10px] text-editor-accent font-bold uppercase mb-1">Última Hora</span>
          <span className="text-sm leading-tight">{element.properties.rssText || 'Cargando noticias de última hora...'}</span>
        </div>
      )}
    </div>
  );
};

export const MainComposition: React.FC<CompositionState> = ({ elements }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      {elements.map((element) => (
        <Sequence
          key={element.id}
          from={element.frameStart}
          durationInFrames={element.durationInFrames}
        >
          <ElementRenderer element={element} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
