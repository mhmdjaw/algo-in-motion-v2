import type { GraphEdge } from './edge.interface'
import type { GraphNode } from './graph-node.interface'

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}
