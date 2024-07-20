import type { Edge } from './edge.interface'
import type { GraphNode } from './graph-node.interface'

export interface Graph {
  graph: GraphNode[]
  edges: Edge[]
}
