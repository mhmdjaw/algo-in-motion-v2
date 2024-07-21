import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'
import { Circle, Layer, Line, Stage } from 'react-konva'
import { Box, useMantineTheme } from '@mantine/core'
import type { Cities, GraphTSPositions } from '~/algorithms/interfaces'
import { useBoundStore } from '~/store'
import { useDebounce } from '@mhmdjawhar/react-hooks'
import { getDragMoveDetails, randomNumberInterval } from '~/helpers'
import { travelingSalesman } from '~/algorithms'
import type { KonvaEventObject } from 'konva/lib/Node'
import styles from './TravelingSalesman.module.css'
import { NODE_RADIUS } from '~/static'
import { useGraphNodeEvents, useStageDimensions } from '~/hooks'

export function TravelingSalesman() {
  const cities = useBoundStore((s) => s.cities)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const isComplete = useBoundStore((s) => s.isComplete)
  const isReset = useBoundStore((s) => s.isReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [citiesState, setCitiesState] = useState<Cities>({
    cities: [],
    edgesPossibility: [],
    edgesSolution: []
  })

  const edgeSolRef = useRef<(Konva.Line | null)[]>([])
  const edgePossRef = useRef<(Konva.Line | null)[]>([])
  const cityRef = useRef<(Konva.Circle | null)[]>([])
  const positions = useRef<GraphTSPositions>({
    nodesPositions: [],
    edgesPossPositions: [],
    edgesSolPositions: []
  })
  const distances = useRef<number[][]>([])
  const timeoutsChunks = useRef<Array<NodeJS.Timeout>>([])
  const timeouts = useRef<Array<NodeJS.Timeout>>([])

  const theme = useMantineTheme()
  const colors = useMemo(
    () => ({
      PINK: theme.colors.pink[7],
      BLUE: theme.colors.blue[6]
    }),
    [theme.colors.blue, theme.colors.pink]
  )

  const { stageWidth, stageHeight } = useStageDimensions()

  const animationSpeed = useMemo(() => (1 - speed / 100) * 481 + 10, [speed])

  const resetCities = useCallback(() => {
    timeoutsChunks.current.map((timeout) => clearTimeout(timeout))
    timeouts.current.map((timeout) => clearTimeout(timeout))
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

    for (let i = 0; i < cities; i++) {
      newCities.cities.push(uuidv4())
      nodesPositions.push({
        x: randomNumberInterval(NODE_RADIUS, stageWidth - NODE_RADIUS),
        y: randomNumberInterval(NODE_RADIUS, stageHeight - NODE_RADIUS)
      })
    }

    for (let i = 0; i < cities; i++) {
      for (let j = 0; j < cities; j++) {
        const a = nodesPositions[i].x - nodesPositions[j].x
        const b = nodesPositions[i].y - nodesPositions[j].y
        distances.current[i][j] = Math.sqrt(a * a + b * b)
      }
    }

    for (let i = 0; i < cities - 1; i++) {
      newCities.edgesPossibility.push(uuidv4())
      newCities.edgesSolution.push(uuidv4())
    }

    cityRef.current = new Array(cities)
    edgePossRef.current = new Array(cities - 1)
    edgeSolRef.current = new Array(cities - 1)

    setCitiesState(newCities)
  }, [cities, stageHeight, stageWidth])

  const debounce = useDebounce(resetCities, 100, [resetCities])

  const travelingSalesmanRun = useCallback(() => {
    const animations = travelingSalesman(distances.current)
    timeouts.current = new Array(animations.length)

    const chunks = Math.floor(animations.length / 1500)

    timeoutsChunks.current = new Array(chunks + 2)

    for (let t = 0; t < chunks; t++) {
      timeoutsChunks.current[t] = setTimeout(
        () => {
          timeouts.current = new Array(1500)
          let count = 0
          for (let index = t * 1500; index < (t + 1) * 1500; index++) {
            const animation = animations[index]
            const { BLUE, PINK } = colors
            switch (animation.action) {
              case 'CURRENT_POSSIBILITY': {
                timeouts.current[count] = setTimeout(() => {
                  for (let i = 0; i < animation.index.length - 1; i++) {
                    const city = animation.index[i]
                    const nextCity = animation.index[i + 1]
                    const x1 = cityRef.current[city]?.x() as number
                    const y1 = cityRef.current[city]?.y() as number
                    const x2 = cityRef.current[nextCity]?.x() as number
                    const y2 = cityRef.current[nextCity]?.y() as number
                    edgePossRef.current[i]?.points([x1, y1, x2, y2])
                    edgePossRef.current[i]?.stroke(BLUE)
                  }
                }, count * animationSpeed)

                break
              }

              case 'CURRENT_SOLUTION': {
                timeouts.current[index] = setTimeout(() => {
                  for (let i = 0; i < animation.index.length; i++) {
                    if (i === animation.index.length - 1) {
                      const lastCity = animation.index[i]
                      cityRef.current[lastCity]?.fill(PINK)
                      break
                    }
                    const city = animation.index[i]
                    const nextCity = animation.index[i + 1]
                    const x1 = cityRef.current[city]?.x() as number
                    const y1 = cityRef.current[city]?.y() as number
                    const x2 = cityRef.current[nextCity]?.x() as number
                    const y2 = cityRef.current[nextCity]?.y() as number
                    edgeSolRef.current[i]?.points([x1, y1, x2, y2])
                    cityRef.current[city]?.fill(PINK)
                    edgeSolRef.current[i]?.stroke(PINK)
                  }
                }, count * animationSpeed)

                break
              }

              default:
                break
            }
            count++
          }
        },
        t * 1500 * animationSpeed
      )
    }

    const lastChunk = animations.length % 1500
    timeouts.current = new Array(lastChunk)

    //repetitive code to repeat the entire process on the last chunk
    timeoutsChunks.current[chunks] = setTimeout(
      () => {
        let count = 0
        for (let index = animations.length - lastChunk; index < animations.length; index++) {
          const animation = animations[index]
          const { BLUE, PINK } = colors
          switch (animation.action) {
            case 'CURRENT_POSSIBILITY': {
              timeouts.current[count] = setTimeout(() => {
                for (let i = 0; i < animation.index.length - 1; i++) {
                  const city = animation.index[i]
                  const nextCity = animation.index[i + 1]
                  const x1 = cityRef.current[city]?.x() as number
                  const y1 = cityRef.current[city]?.y() as number
                  const x2 = cityRef.current[nextCity]?.x() as number
                  const y2 = cityRef.current[nextCity]?.y() as number
                  edgePossRef.current[i]?.points([x1, y1, x2, y2])
                  edgePossRef.current[i]?.stroke(BLUE)
                }
              }, count * animationSpeed)

              break
            }

            case 'CURRENT_SOLUTION': {
              timeouts.current[index] = setTimeout(() => {
                for (let i = 0; i < animation.index.length; i++) {
                  if (i === animation.index.length - 1) {
                    const lastCity = animation.index[i]
                    cityRef.current[lastCity]?.fill(PINK)
                    break
                  }
                  const city = animation.index[i]
                  const nextCity = animation.index[i + 1]
                  const x1 = cityRef.current[city]?.x() as number
                  const y1 = cityRef.current[city]?.y() as number
                  const x2 = cityRef.current[nextCity]?.x() as number
                  const y2 = cityRef.current[nextCity]?.y() as number
                  edgeSolRef.current[i]?.points([x1, y1, x2, y2])
                  cityRef.current[city]?.fill(PINK)
                  edgeSolRef.current[i]?.stroke(PINK)
                }
              }, count * animationSpeed)

              break
            }

            default:
              break
          }
          count++
        }
      },
      chunks * 1500 * animationSpeed
    )

    timeoutsChunks.current[chunks + 1] = setTimeout(() => {
      visualizationComplete()
    }, animations.length * animationSpeed)
  }, [animationSpeed, colors, visualizationComplete])

  useEffect(() => {
    if (isRunning) {
      travelingSalesmanRun()
    }
  }, [isRunning, travelingSalesmanRun])

  useEffect(() => {
    if (isReset) debounce()
  }, [debounce, isReset])

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
