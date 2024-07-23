export interface MazeGenerationAnimation {
  row: number
  col: number
}

enum dir {
  N,
  E,
  W,
  S
}

interface Edge {
  row: number
  col: number
  direction: dir
}

export const mazeGeneration = (graph: number[][]): MazeGenerationAnimation[] => {
  const animations: MazeGenerationAnimation[] = []

  const edges: Edge[] = []

  //add first sell and its edges
  animations.push({ row: graph.length - 1, col: 0 })
  graph[graph.length - 1][0] = 1
  edges.push({ row: graph.length - 2, col: 0, direction: dir.N })
  edges.push({ row: graph.length - 1, col: 1, direction: dir.E })

  while (edges.length !== 0) {
    const { row, col, direction } = edges.splice(randomIndex(edges.length), 1)[0]
    const { rowCell, colCell } = cellPosition(row, col, direction)

    if (graph[rowCell][colCell] === 0) {
      // color edge and cell
      animations.push({ row: row, col: col })
      animations.push({ row: rowCell, col: colCell })
      graph[row][col] = 1
      graph[rowCell][colCell] = 1
      addEdges(rowCell, colCell, graph, edges)
    }
  }

  return animations
}

const cellPosition = (
  row: number,
  col: number,
  direction: number
): { rowCell: number; colCell: number } => {
  const { N, E, W, S } = dir

  switch (direction) {
    case N:
      return { rowCell: row - 1, colCell: col }

    case E:
      return { rowCell: row, colCell: col + 1 }

    case W:
      return { rowCell: row, colCell: col - 1 }

    case S:
      return { rowCell: row + 1, colCell: col }

    default:
      return { rowCell: -1, colCell: -1 }
  }
}

const addEdges = (rowCell: number, colCell: number, graph: number[][], edges: Edge[]): void => {
  const { N, E, W, S } = dir

  if (rowCell > 1 && graph[rowCell - 2][colCell] === 0) {
    edges.push({ row: rowCell - 1, col: colCell, direction: N })
  }
  if (rowCell < graph.length - 2 && graph[rowCell + 2][colCell] === 0) {
    edges.push({ row: rowCell + 1, col: colCell, direction: S })
  }
  if (colCell > 1 && graph[rowCell][colCell - 2] === 0) {
    edges.push({ row: rowCell, col: colCell - 1, direction: W })
  }
  if (colCell < graph[0].length - 2 && graph[rowCell][colCell + 2] === 0) {
    edges.push({ row: rowCell, col: colCell + 1, direction: E })
  }
}

const randomIndex = (length: number): number => {
  return Math.floor(Math.random() * length)
}
