import type { StateCreator } from 'zustand'
import { sliceResetFns } from './store'
import type { OptionsSlice } from './options.slice'

const initialVisualizerState = {
  isRunning: false,
  isPaused: false,
  isComplete: false,
  isGenerationComplete: false
}

export interface VisualizerSlice {
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  isGenerationComplete: boolean
  shouldReset: () => boolean
  runVisualizer: () => void
  pauseVisualizer: () => void
  resetVisualizer: () => void
  visualizationComplete: () => void
  generationComplete: () => void
}

export const createVisualizerSlice: StateCreator<
  VisualizerSlice & OptionsSlice,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  VisualizerSlice
> = (set, get) => {
  sliceResetFns.add(() => set(initialVisualizerState))
  return {
    ...initialVisualizerState,
    runVisualizer: () => set({ isRunning: true, isPaused: false }),
    pauseVisualizer: () => set({ isRunning: false, isPaused: true }),
    resetVisualizer: () =>
      set({
        isRunning: false,
        isComplete: false,
        isGenerationComplete: false,
        isPaused: false
      }),
    visualizationComplete: () => set({ isRunning: false, isComplete: true, isPaused: false }),
    generationComplete: () =>
      set({ isRunning: false, isGenerationComplete: true, isPaused: false }),
    shouldReset: () =>
      !(get().isRunning || get().isPaused || get().isComplete || get().isGenerationComplete)
  }
}
