import { Box, px, rem, useMantineTheme } from '@mantine/core'
import type Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Circle, Line } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import { bfs } from '~/algorithms'
import type { Edge, Graph, NodePosition } from '~/algorithms/interfaces'
import { randomNumberInterval } from '~/helpers'
import { ALGORITHM_HANDLE } from '~/static'
import { useBoundStore } from '~/store'
import styles from './GraphTraversal.module.css'
import { useDebounce, useViewportSize } from '@mhmdjawhar/react-hooks'

const NODE_RADIUS = 20

export function GraphTraversal({ algorithm }: { algorithm: string }) {
  const nodes = useBoundStore((s) => s.nodes)
  const edges = useBoundStore((s) => s.edges)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isReset = useBoundStore((s) => s.isReset())

  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const theme = useMantineTheme()
  const colors = useMemo(
    () => ({
      PINK: theme.colors.pink[7],
      BLUE: theme.colors.blue[6]
    }),
    [theme.colors.blue, theme.colors.pink]
  )

  const { width } = useViewportSize()
  const stageHeight = useMemo(
    () =>
      0.9 * window.innerHeight -
      ((px(theme.other.headerHeight) as number) + (px(rem(100)) as number)),
    [theme.other.headerHeight]
  )
  const stageWidth = useMemo(() => 0.95 * width, [width])

  const numberOfEdges = useMemo(() => {
    const maxNumberOfEdges = (nodes * (nodes - 1)) / 2
    const minNumberOfEdges = nodes - 1
    return Math.floor((edges / 100) * (maxNumberOfEdges - minNumberOfEdges)) + minNumberOfEdges
  }, [edges, nodes])
  const animationSpeed = useMemo(() => (1 - speed / 100) * 900 + 100, [speed])

  const [graphState, setGraphState] = useState<Graph>({ graph: [], edges: [] })

  const edgeRef = useRef<(Konva.Line | null)[][]>([]) //double array
  const nodeRef = useRef<(Konva.Circle | null)[]>([])
  const initialNodesPos = useRef<NodePosition[]>([])
  const initialEdgesPos = useRef<number[][]>([])

  const timeouts = useRef<NodeJS.Timeout[]>([])

  const resetGraph = useCallback(() => {
    timeouts.current.map((timeout) => clearTimeout(timeout))
    initialNodesPos.current = []
    initialEdgesPos.current = []

    const newGraph: Graph = { graph: [], edges: [] }

    for (let i = 0; i < nodes; i++) {
      newGraph.graph.push({ id: uuidv4(), neighbors: [] })
      initialNodesPos.current.push({
        x: randomNumberInterval(NODE_RADIUS, stageWidth - NODE_RADIUS),
        y: randomNumberInterval(NODE_RADIUS, stageHeight - NODE_RADIUS)
      })
    }

    newGraph.edges = generateEdges(nodes, numberOfEdges)

    newGraph.edges.forEach((edge) => {
      newGraph.graph[edge.from].neighbors.push(edge.to)
      newGraph.graph[edge.to].neighbors.push(edge.from)
    })

    newGraph.edges.forEach((edge) => {
      initialEdgesPos.current.push([
        initialNodesPos.current[edge.from].x,
        initialNodesPos.current[edge.from].y,
        initialNodesPos.current[edge.to].x,
        initialNodesPos.current[edge.to].y
      ])
    })

    const maxNumberOfNodes = 20

    edgeRef.current = new Array(maxNumberOfNodes)
    for (let i = 0; i < maxNumberOfNodes; i++) {
      edgeRef.current[i] = new Array(maxNumberOfNodes)
    }
    nodeRef.current = new Array(newGraph.graph.length)

    setGraphState(newGraph)
  }, [stageHeight, stageWidth, nodes, numberOfEdges])

  const debounce = useDebounce(resetGraph, 100, [resetGraph])

  const BFSRun = useCallback(() => {
    // no need to clone since the algorithm doesn't mess with the indexes
    const animations = bfs(graphState.graph)
    timeouts.current = new Array(animations.length + 1)

    animations.forEach((animation, index) => {
      switch (animation.action) {
        case 'VISIT_NODE': {
          const i = animation.index[0]

          timeouts.current[index] = setTimeout(() => {
            nodeRef.current[i]?.fill(colors.PINK)
          }, index * animationSpeed)

          break
        }

        case 'VISIT_EDGE': {
          const from = animation.index[0]
          const to = animation.index[1]

          timeouts.current[index] = setTimeout(() => {
            edgeRef.current[from][to]?.stroke(colors.PINK)
          }, index * animationSpeed)

          break
        }

        case 'DEQUEUE_NODE': {
          const i = animation.index[0]

          timeouts.current[index] = setTimeout(() => {
            nodeRef.current[i]?.fill(colors.BLUE)
          }, index * animationSpeed)

          break
        }

        default:
          break
      }
    })

    timeouts.current[animations.length + 1] = setTimeout(() => {
      visualizationComplete()
    }, animations.length * animationSpeed)
  }, [graphState, animationSpeed, colors.PINK, colors.BLUE, visualizationComplete])

  // const DFSRun = useCallback(() => {
  //   // no need to clone since the algorithm doesn't mess with the indexes
  //   const animations = dfs(graphState.graph)
  //   timeouts.current = new Array(animations.length + 1)

  //   animations.forEach((animation, index) => {
  //     switch (animation.action) {
  //       case 'VISIT_NODE': {
  //         const i = animation.index[0]

  //         timeouts.current[index] = setTimeout(() => {
  //           nodeRef.current[i]?.fill(PRIMARY_COLOR)
  //           layer.current?.draw()
  //         }, index * animationSpeed)

  //         break
  //       }

  //       case 'VISIT_EDGE': {
  //         const from = animation.index[0]
  //         const to = animation.index[1]
  //         const edge = edgeRef.current[from][to]

  //         timeouts.current[index] = setTimeout(() => {
  //           if (edge) edge.stroke(PRIMARY_COLOR)
  //           layer.current?.draw()
  //         }, index * animationSpeed)

  //         break
  //       }

  //       case 'BACKTRACK_EDGE': {
  //         const from = animation.index[0]
  //         const to = animation.index[1]

  //         timeouts.current[index] = setTimeout(() => {
  //           edgeRef.current[from][to]?.stroke(SECONDARY_COLOR)
  //           layer.current?.draw()
  //         }, index * animationSpeed)

  //         break
  //       }

  //       case 'BACKTRACK_NODE': {
  //         const i = animation.index[0]

  //         timeouts.current[index] = setTimeout(() => {
  //           nodeRef.current[i]?.fill(SECONDARY_COLOR)
  //           layer.current?.draw()
  //         }, index * animationSpeed)

  //         break
  //       }

  //       default:
  //         break
  //     }
  //   })

  //   timeouts.current[animations.length + 1] = setTimeout(() => {
  //     dispatch(visualizationComplete())
  //   }, animations.length * animationSpeed)
  // }, [graphState.graph, PRIMARY_COLOR, SECONDARY_COLOR, animationSpeed, dispatch])

  useEffect(() => {
    if (isRunning) {
      if (algorithm === ALGORITHM_HANDLE.BFS) {
        BFSRun()
      } else if (algorithm === ALGORITHM_HANDLE.DFS) {
        // DFSRun()
      }
    }
  }, [isRunning, BFSRun, algorithm])

  useEffect(() => {
    if (isReset) {
      debounce()
    }
  }, [isReset, resetGraph, debounce])

  const onDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      let newX = e.target.x()
      let newY = e.target.y()
      const node = Number(e.target.id())
      const currentNode = nodeRef.current[node]

      // make sure it doesn't drag beyond stage boundaries
      if (newX < NODE_RADIUS) {
        currentNode?.x(NODE_RADIUS)
        newX = NODE_RADIUS
      }
      if (newX > stageWidth - NODE_RADIUS) {
        currentNode?.x(stageWidth - NODE_RADIUS)
        newX = stageWidth - NODE_RADIUS
      }
      if (newY < NODE_RADIUS) {
        currentNode?.y(NODE_RADIUS)
        newY = NODE_RADIUS
      }
      if (newY > stageHeight - NODE_RADIUS) {
        currentNode?.y(stageHeight - NODE_RADIUS)
        newY = stageHeight - NODE_RADIUS
      }

      // update all edges positions linked to this node
      graphState.graph[node].neighbors.forEach((neighbor) => {
        const edge = edgeRef.current[node][neighbor]
        if (edge) {
          const points = edge.points()
          // check which end of the edge the current node is connected to
          if (Number(edge.name()) === node) {
            points[0] = newX
            points[1] = newY
          } else if (Number(edge.name()) === neighbor) {
            points[2] = newX
            points[3] = newY
          }
        }
      })
    },
    [stageHeight, stageWidth, graphState]
  )

  const onMouseEnter = useCallback(() => {
    document.body.style.cursor = 'grab'
  }, [])

  const onMouseLeave = useCallback(() => {
    document.body.style.cursor = 'default'
  }, [])

  const onDragStart = useCallback((e: KonvaEventObject<DragEvent>) => {
    document.body.style.cursor = 'grabbing'
    const node = Number(e.target.id())
    const currentNode = nodeRef.current[node]
    currentNode?.to({ scaleX: 1.2, scaleY: 1.2, duration: 0.05 })
  }, [])

  const onDragEnd = useCallback((e: KonvaEventObject<DragEvent>) => {
    document.body.style.cursor = 'grab'
    const node = Number(e.target.id())
    const currentNode = nodeRef.current[node]
    currentNode?.to({ scaleX: 1, scaleY: 1, duration: 0.05 })
  }, [])

  return (
    <Box className={styles.container} h={stageHeight} w={stageWidth}>
      <Stage height={stageHeight} width={stageWidth}>
        <Layer>
          {graphState.edges.map((edge, i) => (
            <Line
              key={edge.id}
              ref={(el) =>
                (edgeRef.current[edge.from][edge.to] = edgeRef.current[edge.to][edge.from] = el)
              }
              id={`${edge.id}`}
              name={`${edge.from}`}
              points={initialEdgesPos.current[i]}
              stroke="white"
            />
          ))}
          {graphState.graph.map((node, i) => (
            <Circle
              key={node.id}
              id={`${i}`}
              ref={(el) => (nodeRef.current[i] = el)}
              x={initialNodesPos.current[i].x}
              y={initialNodesPos.current[i].y}
              radius={NODE_RADIUS}
              fill="white"
              draggable
              onDragMove={onDragMove}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  )
}

const generateEdges = (nodes: number, numberOfEdges: number) => {
  const newEdges: Edge[] = []
  const allPossibleEdges: Edge[] = []
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
