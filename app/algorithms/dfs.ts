import type { GraphNode } from './interfaces'

export interface DFSAnimation {
  action: 'VISIT_NODE' | 'VISIT_EDGE' | 'BACKTRACK_NODE' | 'BACKTRACK_EDGE'
  index: number[]
}

export const dfs = (graph: GraphNode[]): DFSAnimation[] => {
  const animations: DFSAnimation[] = []
  const col = new Array(graph.length).fill(0)
  const v = 0
  dfsVisit(graph, col, v, animations)

  return animations
}

const dfsVisit = (graph: GraphNode[], col: number[], v: number, animations: DFSAnimation[]) => {
  // visit node
  animations.push({ action: 'VISIT_NODE', index: [v] })
  col[v] = 1

  for (let i = 0; i < graph[v].neighbors.length; i++) {
    if (col[graph[v].neighbors[i]] === 0) {
      // visit edge
      animations.push({
        action: 'VISIT_EDGE',
        index: [v, graph[v].neighbors[i]]
      })
      dfsVisit(graph, col, graph[v].neighbors[i], animations)
      // backtrack from neighbor
      animations.push({
        action: 'BACKTRACK_EDGE',
        index: [v, graph[v].neighbors[i]]
      })
    }
  }

  // current node is done... now backtrack
  animations.push({ action: 'BACKTRACK_NODE', index: [v] })
}
