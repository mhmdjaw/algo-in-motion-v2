import type { MazeGenerationAnimation, PahtfindingAnimation } from '~/algorithms'

interface Colors {
  PINK: string
  BLUE: string
}

export const drawMazeGenerationAnimation = (
  animation: MazeGenerationAnimation,
  maze: (HTMLDivElement | null)[][]
) => {
  const { row, col } = animation
  const cell = maze[row][col]?.style
  if (cell) cell.background = '#fff'
}

export const drawPathfindingAnimation = (
  animation: PahtfindingAnimation,
  maze: (HTMLDivElement | null)[][],
  colors: Colors
) => {
  const { PINK, BLUE } = colors

  switch (animation.action) {
    case 'FIND_TARGET': {
      const { row, col } = animation
      const cell = maze[row][col]?.style
      if (cell) cell.background = PINK
      break
    }

    case 'TARGET_FOUND': {
      const { row, col } = animation
      const cell = maze[row][col]?.style
      if (cell) cell.background = BLUE
      break
    }

    default:
      break
  }
}
