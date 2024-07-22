import type { LinePosition } from './line-position.interface'
import type { NodePosition } from './node-position-interface'

export interface GraphTraversalPositions {
  nodesPositions: NodePosition[]
  edgesPositions: LinePosition[]
}
