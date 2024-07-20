import type { GraphNode } from './interfaces'

export interface BFSAnimation {
  action: 'VISIT_NODE' | 'VISIT_EDGE' | 'DEQUEUE_NODE'
  index: number[]
}

export const bfs = (graph: GraphNode[]): BFSAnimation[] => {
  const animations: BFSAnimation[] = []

  const queue: number[] = []

  const col = new Array(graph.length).fill(0)

  // visit the first node
  animations.push({ action: 'VISIT_NODE', index: [0] })
  queue.push(0)
  col[0] = 1

  while (queue.length !== 0) {
    // dequeue node
    const node = queue.shift() as number
    animations.push({ action: 'DEQUEUE_NODE', index: [node] })
    col[node] = 2

    for (let i = 0; i < graph[node].neighbors.length; i++) {
      if (col[graph[node].neighbors[i]] === 0) {
        // visit edge and neighbor
        animations.push({
          action: 'VISIT_EDGE',
          index: [node, graph[node].neighbors[i]]
        })
        animations.push({
          action: 'VISIT_NODE',
          index: [graph[node].neighbors[i]]
        })
        queue.push(graph[node].neighbors[i])
        col[graph[node].neighbors[i]] = 1
      }
    }
  }

  return animations
}
