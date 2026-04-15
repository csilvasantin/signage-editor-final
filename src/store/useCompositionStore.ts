import { create } from 'zustand';
import { CompositionState, CompositionElement } from '../types';

interface CompositionStore extends CompositionState {
  addElement: (element: CompositionElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<CompositionElement>) => void;
  updateComposition: (updates: Partial<CompositionState>) => void;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  isRendering: boolean;
  renderProgress: number;
  setRendering: (status: boolean) => void;
  setRenderProgress: (progress: number) => void;
}

export const useCompositionStore = create<CompositionStore>((set) => ({
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300, 
  elements: [
    {
      id: 'test-text',
      type: 'text',
      frameStart: 0,
      durationInFrames: 150,
      x: 100,
      y: 100,
      width: 400,
      height: 100,
      scale: 1,
      rotation: 0,
      opacity: 1,
      properties: {
        text: 'Editor de Video Signage',
        fontSize: 60,
        color: '#ffffff',
      },
      animations: { entrance: { type: 'slide', durationInFrames: 30 } }
    },
  ],
  currentFrame: 0,
  isRendering: false,
  renderProgress: 0,
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  removeElement: (id) => set((state) => ({ elements: state.elements.filter((el) => el.id !== id) })),
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    })),
  updateComposition: (updates) => set((state) => ({ ...state, ...updates })),
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setRendering: (status) => set({ isRendering: status }),
  setRenderProgress: (progress) => set({ renderProgress: progress }),
}));
