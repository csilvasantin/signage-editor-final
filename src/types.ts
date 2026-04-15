export type ElementType = 'image' | 'video' | 'text' | 'widget-clima' | 'widget-rss';

export interface ElementAnimation {
  type: 'fade' | 'slide' | 'zoom';
  direction?: 'left' | 'right' | 'up' | 'down';
  durationInFrames: number;
}

export interface CompositionElement {
  id: string;
  type: ElementType;
  frameStart: number;
  durationInFrames: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  opacity: number;
  properties: Record<string, any>;
  animations?: {
    entrance?: ElementAnimation;
    exit?: ElementAnimation;
  };
}

export interface CompositionState {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  elements: CompositionElement[];
}
