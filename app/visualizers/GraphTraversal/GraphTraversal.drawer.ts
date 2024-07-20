import type { BFSAnimation, DFSAnimation } from '~/algorithms'
import type Konva from 'konva'

interface Colors {
  PINK: string
  BLUE: string
}

export const drawBFSAnimation = (
  animation: BFSAnimation,
  nodes: (Konva.Circle | null)[],
  edges: (Konva.Line | null)[][],
  colors: Colors
) => {
  const { PINK, BLUE } = colors

  switch (animation.action) {
    case 'VISIT_NODE': {
      const i = animation.index[0]
      nodes[i]?.fill(PINK)

      break
    }

    case 'VISIT_EDGE': {
      const from = animation.index[0]
      const to = animation.index[1]

      edges[from][to]?.stroke(PINK)

      break
    }

    case 'DEQUEUE_NODE': {
      const i = animation.index[0]
      nodes[i]?.fill(BLUE)

      break
    }

    default:
      break
  }
}

export const drawDFSAnimation = (
  animation: DFSAnimation,
  nodes: (Konva.Circle | null)[],
  edges: (Konva.Line | null)[][],
  colors: Colors
) => {
  const { PINK, BLUE } = colors

  switch (animation.action) {
    case 'VISIT_NODE': {
      const i = animation.index[0]
      nodes[i]?.fill(PINK)

      break
    }

    case 'VISIT_EDGE': {
      const from = animation.index[0]
      const to = animation.index[1]
      const edge = edges[from][to]

      edge?.stroke(PINK)

      break
    }

    case 'BACKTRACK_EDGE': {
      const from = animation.index[0]
      const to = animation.index[1]
      const edge = edges[from][to]

      edge?.stroke(BLUE)

      break
    }

    case 'BACKTRACK_NODE': {
      const i = animation.index[0]
      nodes[i]?.fill(BLUE)

      break
    }

    default:
      break
  }
}