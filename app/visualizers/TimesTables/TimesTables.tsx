import { Box, useMantineTheme } from '@mantine/core'
import { useDebounce } from '@mhmdjawhar/react-hooks'
import type Konva from 'konva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import type { LinePosition } from '~/algorithms/interfaces'
import { getGradientColor } from '~/helpers'
import { useStageDimensions } from '~/hooks'
import { useBoundStore } from '~/store'

const getPosition = (index: number, delta: number, height: number, width: number) => {
  const angle = index * delta
  const radius = (0.9 * Math.min(height, width)) / 2
  const xpos = radius * Math.cos(angle)
  const ypos = radius * Math.sin(angle)
  return { x: xpos, y: ypos }
}

export function TimesTables() {
  const pointsCount = useBoundStore((s) => s.points)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isReset = useBoundStore((s) => s.isReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [points, setPoints] = useState<string[]>([])

  // HTML Element refs
  const lineRef = useRef<(Konva.Line | null)[]>([])

  // positions and colors refs
  const positions = useRef<LinePosition[]>([])
  const gradientColors = useRef<string[]>([])

  // animation related refs
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

  const delta = useMemo(() => (2 * Math.PI) / pointsCount, [pointsCount])
  const animationSpeed = useMemo(() => (1 - speed / 100) * 490 + 10, [speed])

  const resetTimesTables = useCallback(() => {
    timeoutsChunks.current.map((timeout) => clearTimeout(timeout))
    timeouts.current.map((timeout) => clearTimeout(timeout))
    lineRef.current = Array(pointsCount)

    const newPoints: string[] = []
    positions.current = []
    gradientColors.current = []
    const initialFactor = 0
    for (let i = 0; i < pointsCount; i++) {
      // initialize
      newPoints.push(uuidv4())

      // set initial position
      const initialFromPosition = getPosition(i, delta, stageHeight, stageWidth)
      const initialToPosision = getPosition(
        (i * initialFactor) % pointsCount,
        delta,
        stageHeight,
        stageWidth
      )
      positions.current.push([
        initialFromPosition.x,
        initialFromPosition.y,
        initialToPosision.x,
        initialToPosision.y
      ])

      // generate colors for each line
      const color = getGradientColor(colors.PINK, colors.BLUE, i / pointsCount)
      gradientColors.current.push(color)
    }

    setPoints(newPoints)
  }, [pointsCount, delta, stageHeight, stageWidth, colors.PINK, colors.BLUE])

  const debounce = useDebounce(resetTimesTables, 100, [resetTimesTables])

  const timesTablesRun = useCallback(() => {
    timeoutsChunks.current = new Array(120)
    timeouts.current = new Array(1000)
    for (let t = 0; t < 1; t++) {
      timeoutsChunks.current[t] = setTimeout(
        () => {
          let i = 0
          timeouts.current = new Array(1000)
          for (let factor = t * 10; factor < (t + 1) * 10; factor += 0.01) {
            timeouts.current[i++] = setTimeout(
              () => {
                for (let j = 0; j < pointsCount; j++) {
                  const currentLine = lineRef.current[j]
                  const currentLinePoints = currentLine?.points()
                  const position = getPosition(
                    (factor * j) % pointsCount,
                    delta,
                    stageHeight,
                    stageWidth
                  )
                  if (currentLine && currentLinePoints) {
                    currentLine.points([
                      currentLinePoints[0],
                      currentLinePoints[1],
                      position.x,
                      position.y
                    ])
                  }
                }
              },
              (factor - t * 10) * 100 * animationSpeed
            )
          }
        },
        t * 10 * 100 * animationSpeed
      )
    }

    timeoutsChunks.current[121] = setTimeout(
      () => {
        visualizationComplete()
      },
      1 * 10 * 100 * animationSpeed
    )
  }, [animationSpeed, pointsCount, delta, stageHeight, stageWidth, points, visualizationComplete])

  useEffect(() => {
    if (isRunning) {
      timesTablesRun()
    }
  }, [isRunning, timesTablesRun])

  useEffect(() => {
    if (isReset) debounce()
  }, [debounce, isReset])

  return (
    <Box h={stageHeight} w={stageWidth} mx="auto">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {points.map((id, i) => (
            <Line
              key={id}
              ref={(el) => (lineRef.current[i] = el)}
              strokeWidth={1}
              scaleX={-1}
              scaleY={-1}
              x={stageWidth / 2}
              y={stageHeight / 2}
              points={positions.current[i]}
              stroke={gradientColors.current[i]}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  )
}
