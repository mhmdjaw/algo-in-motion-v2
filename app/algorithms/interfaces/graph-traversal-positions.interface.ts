import type { EdgePosition } from './edge-position.interface'
import type { NodePosition } from './node-position-interface'

export interface GraphTraversalPositions {
  nodesPositions: NodePosition[]
  edgesPositions: EdgePosition[]
}
