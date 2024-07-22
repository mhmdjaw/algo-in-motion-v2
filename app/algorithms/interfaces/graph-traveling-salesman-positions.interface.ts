import type { LinePosition } from './line-position.interface'
import type { NodePosition } from './node-position-interface'

export interface GraphTSPositions {
  nodesPositions: NodePosition[]
  edgesPossPositions: LinePosition[]
  edgesSolPositions: LinePosition[]
}
