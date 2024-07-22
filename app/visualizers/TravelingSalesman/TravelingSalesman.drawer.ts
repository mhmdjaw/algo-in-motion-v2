import type { TSAnimation } from '~/algorithms'
import type Konva from 'konva'

interface Colors {
  PINK: string
  BLUE: string
}

export const drawTSAnimation = (
  animation: TSAnimation,
  city: (Konva.Circle | null)[],
  edgesPoss: (Konva.Line | null)[],
  edgesSol: (Konva.Line | null)[],
  colors: Colors
) => {
  const { PINK, BLUE } = colors

  switch (animation.action) {
    case 'CURRENT_POSSIBILITY': {
      for (let i = 0; i < animation.indexes.length - 1; i++) {
        const currentCity = animation.indexes[i]
        const nextCity = animation.indexes[i + 1]
        const x1 = city[currentCity]?.x() as number
        const y1 = city[currentCity]?.y() as number
        const x2 = city[nextCity]?.x() as number
        const y2 = city[nextCity]?.y() as number
        edgesPoss[i]?.points([x1, y1, x2, y2])
        edgesPoss[i]?.stroke(BLUE)
      }

      break
    }

    case 'CURRENT_SOLUTION': {
      for (let i = 0; i < animation.indexes.length; i++) {
        if (i === animation.indexes.length - 1) {
          const lastCity = animation.indexes[i]
          city[lastCity]?.fill(PINK)
          break
        }
        const currentCity = animation.indexes[i]
        const nextCity = animation.indexes[i + 1]
        const x1 = city[currentCity]?.x() as number
        const y1 = city[currentCity]?.y() as number
        const x2 = city[nextCity]?.x() as number
        const y2 = city[nextCity]?.y() as number
        edgesSol[i]?.points([x1, y1, x2, y2])
        city[currentCity]?.fill(PINK)
        edgesSol[i]?.stroke(PINK)
      }

      break
    }

    case 'SOLUTION_FOUND': {
      for (let i = 0; i < animation.indexes.length; i++) {
        edgesPoss[i]?.points([0, 0, 0, 0])
      }

      break
    }

    default:
      break
  }
}
