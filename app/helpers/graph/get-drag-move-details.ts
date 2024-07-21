import type { KonvaEventObject } from 'konva/lib/Node'
import { NODE_RADIUS } from '~/static'

export const getDragMoveDetails = (
  e: KonvaEventObject<DragEvent>,
  stageDimensions: { width: number; height: number }
) => {
  let newX = e.target.x()
  let newY = e.target.y()
  // this is the index and not the actual node ID
  const node = Number(e.target.id())

  const { width, height } = stageDimensions

  // make sure it doesn't drag beyond stage boundaries
  if (newX < NODE_RADIUS) {
    e.target.x(NODE_RADIUS)
    newX = NODE_RADIUS
  }
  if (newX > width - NODE_RADIUS) {
    e.target.x(width - NODE_RADIUS)
    newX = width - NODE_RADIUS
  }
  if (newY < NODE_RADIUS) {
    e.target.y(NODE_RADIUS)
    newY = NODE_RADIUS
  }
  if (newY > height - NODE_RADIUS) {
    e.target.y(height - NODE_RADIUS)
    newY = height - NODE_RADIUS
  }

  return { node, newPos: { x: newX, y: newY } }
}
