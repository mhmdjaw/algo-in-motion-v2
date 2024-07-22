import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'
import { Circle, Layer, Line, Stage } from 'react-konva'
import { Box, useMantineTheme } from '@mantine/core'
import type { Cities, GraphTSPositions } from '~/algorithms/interfaces'
import { useBoundStore } from '~/store'
import { useAnimationFrame, useDebounce } from '@mhmdjawhar/react-hooks'
import { getDragMoveDetails, randomNumberInterval } from '~/helpers'
import { travelingSalesman, type TSAnimation } from '~/algorithms'
import type { KonvaEventObject } from 'konva/lib/Node'
import styles from './TravelingSalesman.module.css'
import { NODE_RADIUS } from '~/static'
import { useGraphNodeEvents, useStageDimensions } from '~/hooks'
import { drawTSAnimation } from './TravelingSalesman.drawer'

export function TravelingSalesman() {
  const cities = useBoundStore((s) => s.cities)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const isComplete = useBoundStore((s) => s.isComplete)
  const shouldReset = useBoundStore((s) => s.shouldReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [citiesState, setCitiesState] = useState<Cities>({
    cities: [],
    edgesPossibility: [],
    edgesSolution: []
  })

  // HTML Element refs
  const edgeSolRef = useRef<(Konva.Line | null)[]>([])
  const edgePossRef = useRef<(Konva.Line | null)[]>([])
  const cityRef = useRef<(Konva.Circle | null)[]>([])

  // Position refs
  const positions = useRef<GraphTSPositions>({
    nodesPositions: [],
    edgesPossPositions: [],
    edgesSolPositions: []
  })

  // distances between cities refs
  const distances = useRef<number[][]>([])

  // animation related refs
  const animations = useRef<TSAnimation[]>([])
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

  const animationSpeed = useMemo(() => (1 - speed / 100) * 481 + 8, [speed])

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

        drawTSAnimation(animation, cityRef.current, edgePossRef.current, edgeSolRef.current, colors)

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [animationSpeed, visualizationComplete, colors]
  )

  const resetCities = useCallback(() => {
    animationCancel()

    animationIndex.current = 0

    distances.current = new Array(cities)
    for (let i = 0; i < cities; i++) {
      distances.current[i] = new Array(cities)
    }
    positions.current = {
      nodesPositions: [],
      edgesPossPositions: new Array(cities - 1).fill([0, 0, 0, 0]), // initial edge positions can be anything since the animation will update them later
      edgesSolPositions: new Array(cities - 1).fill([0, 0, 0, 0])
    }
    const { nodesPositions } = positions.current

    const newCities: Cities = {
      cities: [],
      edgesPossibility: [],
      edgesSolution: []
    }

    // initialize cities
    for (let i = 0; i < cities; i++) {
      newCities.cities.push(uuidv4())
      // set initial position for cities (nodes)
      nodesPositions.push({
        x: randomNumberInterval(NODE_RADIUS, stageWidth - NODE_RADIUS),
        y: randomNumberInterval(NODE_RADIUS, stageHeight - NODE_RADIUS)
      })
    }

    // calculate distances between cities
    for (let i = 0; i < cities; i++) {
      for (let j = 0; j < cities; j++) {
        const a = nodesPositions[i].x - nodesPositions[j].x
        const b = nodesPositions[i].y - nodesPositions[j].y
        distances.current[i][j] = Math.sqrt(a * a + b * b)
      }
    }

    // initialize edges (possibilities and solutions)
    for (let i = 0; i < cities - 1; i++) {
      newCities.edgesPossibility.push(uuidv4())
      newCities.edgesSolution.push(uuidv4())
    }

    // initialize refs arrays
    cityRef.current = new Array(cities)
    edgePossRef.current = new Array(cities - 1)
    edgeSolRef.current = new Array(cities - 1)

    setCitiesState(newCities)
  }, [animationCancel, cities, stageHeight, stageWidth])

  const debounce = useDebounce(resetCities, 100, [resetCities])

  useEffect(() => {
    if (isRunning) {
      if (animationIndex.current === 0) {
        animations.current = travelingSalesman(distances.current)
      }
      previousTimeStamp.current = Date.now()
      animationRun()
    } else if (isPaused) {
      animationCancel()
    }
  }, [isRunning, animationRun, animationCancel, isPaused])

  useEffect(() => {
    if (shouldReset) debounce()
  }, [debounce, shouldReset])

  const handleDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const { node: city, newPos } = getDragMoveDetails(e, {
        width: stageWidth,
        height: stageHeight
      })

      const { nodesPositions } = positions.current

      // update node position in case more nodes get dragged later and distances need to be updated
      nodesPositions[city].x = newPos.x
      nodesPositions[city].y = newPos.y

      // update the distances to all other cities
      distances.current[city].forEach((_, i) => {
        if (city !== i) {
          const a = nodesPositions[city].x - nodesPositions[i].x
          const b = nodesPositions[city].y - nodesPositions[i].y
          const distance = Math.sqrt(a * a + b * b)
          distances.current[city][i] = distances.current[i][city] = distance
        }
      })
    },
    [stageHeight, stageWidth]
  )

  const graphNodeEvents = useGraphNodeEvents()

  const isDraggable = useMemo(() => !isRunning && !isComplete, [isComplete, isRunning])

  return (
    <Box className={styles.container} h={stageHeight} w={stageWidth}>
      <Stage height={stageHeight} width={stageWidth}>
        <Layer>
          {citiesState.edgesPossibility.map((id, i) => {
            return (
              <Line
                key={id}
                ref={(el) => (edgePossRef.current[i] = el)}
                x={0}
                y={0}
                points={positions.current.edgesPossPositions[i]}
                stroke="white"
              />
            )
          })}

          {citiesState.edgesSolution.map((id, i) => {
            return (
              <Line
                key={id}
                ref={(el) => (edgeSolRef.current[i] = el)}
                x={0}
                y={0}
                points={positions.current.edgesSolPositions[i]}
                stroke="white"
              />
            )
          })}

          {citiesState.cities.map((id, i) => (
            <Circle
              key={id}
              id={`${i}`}
              ref={(el) => (cityRef.current[i] = el)}
              x={positions.current.nodesPositions[i].x}
              y={positions.current.nodesPositions[i].y}
              radius={NODE_RADIUS}
              fill="white"
              draggable={isDraggable}
              onDragMove={handleDragMove}
              {...(isDraggable ? graphNodeEvents : {})}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  )
}
