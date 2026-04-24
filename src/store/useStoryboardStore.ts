import { create } from 'zustand';

export interface Shot {
  id: string;
  shotNumber: number;
  duration: string;
  prompt: string;
  narration: string;
  videoUrl?: string; // Local Object URL for preview
}

interface StoryboardState {
  shots: Shot[];
  isGenerating: boolean;
  setShots: (shots: Shot[]) => void;
  updateShotVideo: (id: string, file: File) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  clearShots: () => void;
}

export const useStoryboardStore = create<StoryboardState>((set) => ({
  shots: [],
  isGenerating: false,
  setShots: (shots) => set({ shots }),
  updateShotVideo: (id, file) => set((state) => {
    // Create a local object URL for the uploaded video file
    const videoUrl = URL.createObjectURL(file);
    return {
      shots: state.shots.map((shot) => 
        shot.id === id ? { ...shot, videoUrl } : shot
      )
    };
  }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  clearShots: () => set({ shots: [] }),
}));
