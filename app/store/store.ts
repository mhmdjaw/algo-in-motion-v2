import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { VisualizerSlice } from './visualizer.slice'
import { createVisualizerSlice } from './visualizer.slice'
import type { OptionsSlice } from './options.slice'
import { createOptionsSlice } from './options.slice'

export const sliceResetFns = new Set<() => void>()

export const resetAllSlices = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn()
  })
}

const useBoundStore = create<VisualizerSlice & OptionsSlice>()(
  devtools(
    immer((...a) => ({
      ...createVisualizerSlice(...a),
      ...createOptionsSlice(...a)
    })),
    { enabled: true }
  )
)

export default useBoundStore
