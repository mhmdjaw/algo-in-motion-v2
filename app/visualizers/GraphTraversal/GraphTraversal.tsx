import { Box, px, rem, useMantineTheme } from '@mantine/core'
import type Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Circle, Line } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import { bfs, dfs, type BFSAnimation, type DFSAnimation } from '~/algorithms'
import type { Graph, NodePosition } from '~/algorithms/interfaces'
import { generateEdges, randomNumberInterval } from '~/helpers'
import { ALGORITHM_HANDLE } from '~/static'
import { useBoundStore } from '~/store'
import styles from './GraphTraversal.module.css'
import { useAnimationFrame, useDebounce, useViewportSize } from '@mhmdjawhar/react-hooks'
import { drawBFSAnimation, drawDFSAnimation } from './GraphTraversal.drawer'

export function GraphTraversal({ algorithm }: { algorithm: string }) {
  const nodes = useBoundStore((s) => s.nodes)
  const edges = useBoundStore((s) => s.edges)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const isReset = useBoundStore((s) => s.isReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })

  const edgeRef = useRef<(Konva.Line | null)[][]>([]) //double array
  const nodeRef = useRef<(Konva.Circle | null)[]>([])
  const initialNodesPos = useRef<NodePosition[]>([])
  const initialEdgesPos = useRef<number[][]>([])
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

  const resetGraph = useCallback(() => {
    animationIndex.current = 0

    initialNodesPos.current = []
    initialEdgesPos.current = []

    const newGraph: Graph = { nodes: [], edges: [] }

    for (let i = 0; i < nodes; i++) {
      newGraph.nodes.push({ id: uuidv4(), neighbors: [] })
      // set initial position for nodes
      initialNodesPos.current.push({
        x: randomNumberInterval(NODE_RADIUS, stageWidth - NODE_RADIUS),
        y: randomNumberInterval(NODE_RADIUS, stageHeight - NODE_RADIUS)
      })
    }

    newGraph.edges = generateEdges(nodes, numberOfEdges)

    // specifiy neighbors for each node
    newGraph.edges.forEach((edge) => {
      newGraph.nodes[edge.from].neighbors.push(edge.to)
      newGraph.nodes[edge.to].neighbors.push(edge.from)
    })

    // set initial positions for edges
    newGraph.edges.forEach((edge) => {
      initialEdgesPos.current.push([
        initialNodesPos.current[edge.from].x,
        initialNodesPos.current[edge.from].y,
        initialNodesPos.current[edge.to].x,
        initialNodesPos.current[edge.to].y
      ])
    })

    // initialize refs arrays

    const maxNumberOfNodes = 20

    edgeRef.current = new Array(maxNumberOfNodes)
    for (let i = 0; i < maxNumberOfNodes; i++) {
      edgeRef.current[i] = new Array(maxNumberOfNodes)
    }
    nodeRef.current = new Array(newGraph.nodes.length)

    // set new graph
    setGraph(newGraph)
  }, [stageHeight, stageWidth, nodes, numberOfEdges])

  const debounce = useDebounce(resetGraph, 100, [resetGraph])

  const [BFSRun, BFSCancel] = useAnimationFrame(
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

        const animation = animations.current[index] as BFSAnimation

        drawBFSAnimation(animation, nodeRef.current, edgeRef.current, colors)

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [graph, animationSpeed, visualizationComplete, colors]
  )

  const [DFSRun, DFSCancel] = useAnimationFrame(
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

        const animation = animations.current[index] as DFSAnimation

        drawDFSAnimation(animation, nodeRef.current, edgeRef.current, colors)

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [graph, animationSpeed, visualizationComplete, colors]
  )

  useEffect(() => {
    if (isRunning) {
      if (algorithm === ALGORITHM_HANDLE.BFS) {
        if (animationIndex.current === 0) {
          animations.current = bfs(graph.nodes)
        }
        previousTimeStamp.current = Date.now()
        BFSRun()
      } else if (algorithm === ALGORITHM_HANDLE.DFS) {
        if (animationIndex.current === 0) {
          animations.current = dfs(graph.nodes)
        }
        previousTimeStamp.current = Date.now()
        DFSRun()
      }
    } else if (isPaused) {
      BFSCancel()
      DFSCancel()
    }
  }, [isRunning, BFSRun, algorithm, graph.nodes, BFSCancel, isPaused, DFSCancel, DFSRun])

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
      graph.nodes[node].neighbors.forEach((neighbor) => {
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
    [stageHeight, stageWidth, graph]
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
          {graph.edges.map((edge, i) => (
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
          {graph.nodes.map((node, i) => (
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

const NODE_RADIUS = 20
