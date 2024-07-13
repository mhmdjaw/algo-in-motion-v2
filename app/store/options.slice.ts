import type { StateCreator } from 'zustand'
import { sliceResetFns } from './store'
import type { VisualizerSlice } from './visualizer.slice'

const initialOptionsState = {
  speed: 100,
  size: 310,
  nodes: 12,
  edges: 0,
  points: 200,
  cities: 8
}

export interface OptionsSlice {
  speed: number
  size: number
  nodes: number
  edges: number
  points: number
  cities: number
  changeSpeed: (speed: number) => void
  changeSize: (size: number) => void
  changeNodes: (nodes: number) => void
  changeEdges: (edges: number) => void
  changePoints: (points: number) => void
  changeCities: (cities: number) => void
}

export const createOptionsSlice: StateCreator<
  VisualizerSlice & OptionsSlice,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  OptionsSlice
> = (set) => {
  sliceResetFns.add(() => set(initialOptionsState))
  return {
    ...initialOptionsState,
    changeSpeed: (speed: number) => set({ speed }),
    changeSize: (size: number) => set({ size }),
    changeNodes: (nodes: number) => set({ nodes }),
    changeEdges: (edges: number) => set({ edges }),
    changePoints: (points: number) => set({ points }),
    changeCities: (cities: number) => set({ cities })
  }
}
