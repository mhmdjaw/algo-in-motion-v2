import type { GraphEdge } from '~/algorithms/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { randomNumberInterval } from './random-number-interval'

export const generateEdges = (nodes: number, numberOfEdges: number) => {
  const newEdges: GraphEdge[] = []
  const allPossibleEdges: GraphEdge[] = []
  const availableEdges = new Array((nodes * (nodes - 1)) / 2).fill(true)

  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      allPossibleEdges.push({ id: uuidv4(), from: i, to: j })
    }
  }

  for (let i = 1; i < nodes; i++) {
    const j = randomNumberInterval(0, i - 1)

    newEdges.push({ id: uuidv4(), from: j, to: i })

    const index = mapEdgesToIndices(j, i, nodes)

    availableEdges[index] = false
  }

  for (let i = 0; i < numberOfEdges - (nodes - 1); i++) {
    const availableEdgesIndices: number[] = []
    availableEdges.forEach((available, index) => available && availableEdgesIndices.push(index))

    const randomIndex = randomNumberInterval(0, availableEdgesIndices.length - 1)

    const chosenAvailableEdgeIndex = availableEdgesIndices[randomIndex]

    availableEdges[chosenAvailableEdgeIndex] = false

    newEdges.push(allPossibleEdges[chosenAvailableEdgeIndex])
  }

  return newEdges
}

const mapEdgesToIndices = (from: number, to: number, numberOfNodes: number) => {
  const index = from * numberOfNodes - ((from * (from + 1)) / 2 + 1) + (to - from)
  return index
}
