import type { StateCreator } from 'zustand'
import { sliceResetFns } from './store'
import type { OptionsSlice } from './options.slice'

const initialVisualizerState = {
  isRunning: false,
  isPaused: false,
  isGenerating: false,
  isComplete: false
}

export interface VisualizerSlice {
  isRunning: boolean
  isPaused: boolean
  isGenerating: boolean
  isComplete: boolean
  isReset: () => void
  runVisualizer: () => void
  pauseVisualizer: () => void
  resetVisualizer: () => void
  visualizationComplete: () => void
  generateVisualizer: () => void
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
    // isReset: get()
    //   ? !(get().isRunning || get().isPaused || get().isGenerating || get().isComplete)
    //   : true,
    runVisualizer: () => set({ isRunning: true, isPaused: false }),
    pauseVisualizer: () => set({ isRunning: false, isPaused: true }),
    resetVisualizer: () =>
      set({ isRunning: false, isComplete: false, isPaused: false, isGenerating: false }),
    visualizationComplete: () => set({ isRunning: false, isComplete: true, isPaused: false }),
    generateVisualizer: () => set({ isGenerating: true, isPaused: false }),
    generationComplete: () => set({ isGenerating: false, isPaused: false }),
    isReset: () => !(get().isRunning || get().isPaused || get().isGenerating || get().isComplete)
  }
}
