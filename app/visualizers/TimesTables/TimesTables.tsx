import { Box, useMantineTheme } from '@mantine/core'
import { useAnimationFrame } from '@mhmdjawhar/react-hooks'
import type Konva from 'konva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import type { LinePosition } from '~/algorithms/interfaces'
import { getGradientColor } from '~/helpers'
import { useStageDimensions } from '~/hooks'
import { useBoundStore } from '~/store'

export function TimesTables() {
  const pointsCount = useBoundStore((s) => s.points)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const shouldReset = useBoundStore((s) => s.shouldReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [points, setPoints] = useState<string[]>([])

  // HTML Element refs
  const lineRef = useRef<(Konva.Line | null)[]>([])

  // positions and colors refs
  const positions = useRef<LinePosition[]>([])
  const gradientColors = useRef<string[]>([])

  // animation related refs
  const factor = useRef<number>(0)
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

  const delta = useMemo(() => (2 * Math.PI) / pointsCount, [pointsCount])
  const animationSpeed = useMemo(() => (1 - speed / 100) * 490 + 8, [speed])

  const [animationRun, animationCancel] = useAnimationFrame(
    () => {
      const now = Date.now()
      const elapsed = now - previousTimeStamp.current

      // if enough time has elapsed, draw the next frame

      if (elapsed > animationSpeed) {
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        previousTimeStamp.current = now - (elapsed % animationSpeed)

        // draw stuff here

        factor.current += 0.01

        for (let i = 0; i < pointsCount; i++) {
          const currentLine = lineRef.current[i]
          // get new from position (in case stage width changes)
          const fromPosition = getPosition(i, delta, stageHeight, stageWidth)
          // get new to position
          const toPosition = getPosition(
            (factor.current * i) % pointsCount,
            delta,
            stageHeight,
            stageWidth
          )
          if (currentLine) {
            currentLine.points([fromPosition.x, fromPosition.y, toPosition.x, toPosition.y])
          }
        }
      }
    },
    false,
    [animationSpeed, visualizationComplete, pointsCount, delta, stageHeight, stageWidth]
  )

  const resetTimesTables = useCallback(() => {
    animationCancel()

    factor.current = 0

    lineRef.current = Array(pointsCount)
    positions.current = []
    gradientColors.current = []

    const newPoints: string[] = []

    for (let i = 0; i < pointsCount; i++) {
      // initialize
      newPoints.push(uuidv4())

      // set initial position
      const initialFromPosition = getPosition(i, delta, stageHeight, stageWidth)
      const initialToPosition = getPosition(
        (i * factor.current) % pointsCount,
        delta,
        stageHeight,
        stageWidth
      )
      positions.current.push([
        initialFromPosition.x,
        initialFromPosition.y,
        initialToPosition.x,
        initialToPosition.y
      ])

      // generate colors for each line
      const color = getGradientColor(colors.PINK, colors.BLUE, i / pointsCount)
      gradientColors.current.push(color)
    }

    setPoints(newPoints)
  }, [animationCancel, pointsCount, delta, stageHeight, stageWidth, colors.PINK, colors.BLUE])

  useEffect(() => {
    if (isRunning) {
      previousTimeStamp.current = Date.now()
      animationRun()
    } else if (isPaused) {
      animationCancel()
    }
  }, [isRunning, animationRun, animationCancel, isPaused])

  useEffect(() => {
    if (shouldReset) resetTimesTables()
  }, [resetTimesTables, shouldReset])

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

const getPosition = (index: number, delta: number, height: number, width: number) => {
  const angle = index * delta
  const radius = (0.9 * Math.min(height, width)) / 2
  const xpos = radius * Math.cos(angle)
  const ypos = radius * Math.sin(angle)
  return { x: xpos, y: ypos }
}
