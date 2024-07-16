import type { QuickSortAnimation } from '~/algorithms'

interface Colors {
  PINK: string
  BLUE: string
  YELLOW: string
  GREEN: string
  RED: string
}

export const drawQuickSorAnimation = (
  animation: QuickSortAnimation,
  bars: (HTMLDivElement | null)[],
  colors: Colors
) => {
  const { BLUE, YELLOW, GREEN, RED } = colors

  switch (animation.action) {
    case 'PIVOT': {
      const pivot = animation.index[0]
      const i = animation.index[1]
      const j = animation.index[2]
      const pivotBar = bars[pivot]?.style
      const iBar = bars[i]?.style
      const jBar = bars[j]?.style

      if (pivotBar) pivotBar.background = YELLOW
      if (iBar) iBar.background = GREEN
      if (jBar) jBar.background = GREEN

      break
    }

    case 'ITERATE_LOW': {
      const i = animation.index[0]
      const iBar = bars[i]?.style
      const nextBar = bars[i + 1]?.style

      if (iBar) iBar.background = BLUE
      if (nextBar) nextBar.background = GREEN

      break
    }

    case 'ITERATE_HIGH': {
      const j = animation.index[0]
      const jBar = bars[j]?.style
      const nextBar = bars[j - 1]?.style

      if (jBar) jBar.background = BLUE
      if (nextBar) nextBar.background = GREEN

      break
    }

    case 'SWAP_COLOR': {
      const i = animation.index[0]
      const j = animation.index[1]
      const iBar = bars[i]?.style
      const jBar = bars[j]?.style

      if (iBar) iBar.background = RED
      if (jBar) jBar.background = RED

      break
    }

    case 'SWAP_VALUES': {
      const i = animation.index[0]
      const iHeight = animation.index[1]
      const j = animation.index[2]
      const jHeight = animation.index[3]
      const iBar = bars[i]?.style
      const jBar = bars[j]?.style

      if (iBar) iBar.height = `${iHeight}%`
      if (jBar) jBar.height = `${jHeight}%`

      break
    }

    case 'SWAP_DONE': {
      const i = animation.index[0]
      const j = animation.index[1]
      const iBar = bars[i]?.style
      const jBar = bars[j]?.style
      const nextiBar = bars[i + 1]?.style
      const nextjBar = bars[j - 1]?.style

      if (iBar) iBar.background = BLUE
      if (jBar) jBar.background = BLUE
      if (nextiBar) nextiBar.background = GREEN
      if (nextjBar) nextjBar.background = GREEN

      break
    }

    case 'SWAP_PIVOT': {
      const pivot = animation.index[0]
      const j = animation.index[1]
      const i = animation.index[2]
      const pivotBar = bars[pivot]?.style
      const jBar = bars[j]?.style
      const iBar = bars[i]?.style

      if (pivotBar) pivotBar.background = RED
      if (jBar) jBar.background = RED
      if (iBar) iBar.background = BLUE

      break
    }

    case 'SWAP_PIVOT_DONE': {
      const pivot = animation.index[0]
      const j = animation.index[1]
      const pivotBar = bars[pivot]?.style
      const jBar = bars[j]?.style

      if (pivotBar) pivotBar.background = BLUE
      if (jBar) jBar.background = BLUE

      break
    }

    default:
      break
  }
}
