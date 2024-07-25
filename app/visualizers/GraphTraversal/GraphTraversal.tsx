import { Box, useMantineTheme } from '@mantine/core'
import type Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Circle, Line } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import { bfs, dfs, type BFSAnimation, type DFSAnimation } from '~/algorithms'
import type { Graph, GraphTraversalPositions } from '~/algorithms/interfaces'
import { generateEdges, getDragMoveDetails, randomNumberInterval } from '~/helpers'
import { AlgorithmKey, NODE_RADIUS } from '~/static'
import { useBoundStore } from '~/store'
import styles from './GraphTraversal.module.css'
import { useAnimationFrame, useDebounce } from '@mhmdjawhar/react-hooks'
import { drawBFSAnimation, drawDFSAnimation } from './GraphTraversal.drawer'
import { useGraphNodeEvents, useStageDimensions } from '~/hooks'

export function GraphTraversal({ algorithm }: { algorithm: AlgorithmKey }) {
  const nodes = useBoundStore((s) => s.nodes)
  const edges = useBoundStore((s) => s.edges)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const shouldReset = useBoundStore((s) => s.shouldReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })

  // HTML Element refs
  const edgeRef = useRef<(Konva.Line | null)[][]>([]) //double array
  const nodeRef = useRef<(Konva.Circle | null)[]>([])

  // positions refs
  const initialPositions = useRef<GraphTraversalPositions>({
    nodesPositions: [],
    edgesPositions: []
  })

  // animation related refs
  const animations = useRef<BFSAnimation[] | DFSAnimation[]>([])
  const animationIndex = useRef<number>(0)
  const previousTimeStamp = useRef(Date.now())

  const theme = useMantineTheme()
  const colors = useMemo(
    () => ({
      PINK: theme.colors.pink[7],
      BLUE: theme.colors.blue[6]
    }),
    [theme.colors.blue, theme.colors.pink]
  )

  const { stageWidth, stageHeight } = useStageDimensions()

  const numberOfEdges = useMemo(() => {
    const maxNumberOfEdges = (nodes * (nodes - 1)) / 2
    const minNumberOfEdges = nodes - 1
    return Math.floor((edges / 100) * (maxNumberOfEdges - minNumberOfEdges)) + minNumberOfEdges
  }, [edges, nodes])
  const animationSpeed = useMemo(() => (1 - speed / 100) * 900 + 100, [speed])

  const [animationRun, animationCancel] = useAnimationFrame(
    ({ complete }) => {
      const index = animationIndex.current

      const now = Date.now()
      const elapsed = now - previousTimeStamp.current

      // if enough time has elapsed, draw the next frame

      if (elapsed > animationSpeed) {
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        previousTimeStamp.current = now - (elapsed % animationSpeed)

        // draw stuff here

        const animation = animations.current[index]

        if (algorithm === AlgorithmKey.BFS) {
          drawBFSAnimation(animation as BFSAnimation, nodeRef.current, edgeRef.current, colors)
        } else if (algorithm === AlgorithmKey.DFS) {
          drawDFSAnimation(animation as DFSAnimation, nodeRef.current, edgeRef.current, colors)
        }

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [animationSpeed, visualizationComplete, colors]
  )

  const resetGraph = useCallback(() => {
    animationCancel()

    animationIndex.current = 0

    initialPositions.current = { nodesPositions: [], edgesPositions: [] }
    const { nodesPositions, edgesPositions } = initialPositions.current

    const newGraph: Graph = { nodes: [], edges: [] }

    // initialize nodes
    for (let i = 0; i < nodes; i++) {
      newGraph.nodes.push({ id: uuidv4(), neighbors: [] })
      // set initial position for nodes
      nodesPositions.push({
        x: randomNumberInterval(NODE_RADIUS, stageWidth - NODE_RADIUS),
        y: randomNumberInterval(NODE_RADIUS, stageHeight - NODE_RADIUS)
      })
    }

    // initialize edges
    newGraph.edges = generateEdges(nodes, numberOfEdges)

    // specifiy neighbors for each node
    newGraph.edges.forEach((edge) => {
      newGraph.nodes[edge.from].neighbors.push(edge.to)
      newGraph.nodes[edge.to].neighbors.push(edge.from)
    })

    // set initial positions for edges
    newGraph.edges.forEach((edge) => {
      edgesPositions.push([
        nodesPositions[edge.from].x,
        nodesPositions[edge.from].y,
        nodesPositions[edge.to].x,
        nodesPositions[edge.to].y
      ])
    })

    // initialize refs arrays
    const MAX_NODES = 20

    edgeRef.current = new Array(MAX_NODES)
    for (let i = 0; i < MAX_NODES; i++) {
      edgeRef.current[i] = new Array(MAX_NODES)
    }
    nodeRef.current = new Array(newGraph.nodes.length)

    // set new graph
    setGraph(newGraph)
  }, [animationCancel, nodes, numberOfEdges, stageWidth, stageHeight])

  const debounce = useDebounce(resetGraph, 100, [resetGraph])

  const getAnimations = useCallback(() => {
    if (algorithm === AlgorithmKey.BFS) {
      animations.current = bfs(graph.nodes)
    } else if (algorithm === AlgorithmKey.DFS) {
      animations.current = dfs(graph.nodes)
    }
  }, [algorithm, graph.nodes])

  useEffect(() => {
    if (isRunning && graph.nodes.length) {
      if (animationIndex.current === 0) {
        getAnimations()
      }
      previousTimeStamp.current = Date.now()
      animationRun()
    } else if (isPaused) {
      animationCancel()
    }
  }, [isRunning, animationRun, animationCancel, isPaused, getAnimations, graph.nodes.length])

  useEffect(() => {
    if (shouldReset) {
      debounce()
    }
  }, [shouldReset, debounce])

  const onDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const { node, newPos } = getDragMoveDetails(e, { width: stageWidth, height: stageHeight })

      // update all edges positions linked to this node
      graph.nodes[node].neighbors.forEach((neighbor) => {
        const edge = edgeRef.current[node][neighbor]
        if (edge) {
          const points = edge.points()
          // check which end of the edge the current node is connected to
          if (Number(edge.name()) === node) {
            edge.points([newPos.x, newPos.y, points[2], points[3]])
          } else if (Number(edge.name()) === neighbor) {
            edge.points([points[0], points[1], newPos.x, newPos.y])
          }
        }
      })
    },
    [stageHeight, stageWidth, graph]
  )

  const graphNodeEvents = useGraphNodeEvents()

  return (
    <Box className={styles.container} h={stageHeight} w={stageWidth}>
      <Stage height={stageHeight} width={stageWidth}>
        <Layer>
          {graph.edges.map((edge, i) => (
            <Line
              key={edge.id}
              ref={(el) =>
                (edgeRef.current[edge.from][edge.to] = edgeRef.current[edge.to][edge.from] = el)
              }
              id={`${edge.id}`}
              name={`${edge.from}`}
              points={initialPositions.current.edgesPositions[i]}
              stroke="white"
            />
          ))}
          {graph.nodes.map((node, i) => (
            <Circle
              key={node.id}
              id={`${i}`}
              ref={(el) => (nodeRef.current[i] = el)}
              x={initialPositions.current.nodesPositions[i].x}
              y={initialPositions.current.nodesPositions[i].y}
              radius={NODE_RADIUS}
              fill="white"
              draggable
              onDragMove={onDragMove}
              {...graphNodeEvents}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  )
}
