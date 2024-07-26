import type { StateCreator } from 'zustand'
import { sliceResetFns } from './store'
import type { VisualizerSlice } from './visualizer.slice'

const initialOptionsState = {
  speed: 100,
  size: 310,
  nodes: 12,
  edges: 0,
  points: 600,
  cities: 6
}

interface Options {
  speed: number
  size: number
  nodes: number
  edges: number
  points: number
  cities: number
}

export interface OptionsSlice extends Options {
  changeOption: (optionName: keyof Options, cb?: () => void) => (newValue: number) => void
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
    changeOption: (optionName: keyof Options, cb) => (newValue: number) => {
      set({ [optionName]: newValue })
      if (cb) cb()
    }
  }
}
