import { useMantineTheme } from '@mantine/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  mazeGeneration,
  pathfinding,
  type MazeGenerationAnimation,
  type PahtfindingAnimation
} from '~/algorithms'
import { useStageDimensions } from '~/hooks'
import { useBoundStore } from '~/store'
import styles from './Pathfinding.module.css'
import { useAnimationFrame, useDebounce } from '@mhmdjawhar/react-hooks'
import { drawMazeGenerationAnimation, drawPathfindingAnimation } from './Pathfinder.drawer'

export function Pathfinding() {
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const isGenerationcomplete = useBoundStore((s) => s.isGenerationComplete)
  const generationComplete = useBoundStore((s) => s.generationComplete)
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)
  const shouldReset = useBoundStore((s) => s.shouldReset())

  const [maze, setMaze] = useState<string[][]>([])

  // HTML Element refs
  const mazeRef = useRef<(HTMLDivElement | null)[][]>([])

  // maze related refs
  const cellSize = useRef<number>(0)
  const mazeSize = useRef({ rows: 0, cols: 0 })
  const generatedMaze = useRef<number[][]>([])

  // animation related refs
  const animations = useRef<MazeGenerationAnimation[] | PahtfindingAnimation[]>([])
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

  // set a max width
  const width = useMemo(() => Math.min(stageWidth || 0.95 * window.innerWidth, 1200), [stageWidth])

  const animationSpeed = useMemo(() => (1 - speed / 100) * 195 + 5, [speed])

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

        if (!isGenerationcomplete) {
          drawMazeGenerationAnimation(animation as MazeGenerationAnimation, mazeRef.current)
          if (animationIndex.current === animations.current.length - 1) {
            //color target cell red
            const endCell = mazeRef.current[0][mazeSize.current.cols - 1]?.style
            if (endCell) endCell.background = 'red'
            // color starting cell green
            const startCell = mazeRef.current[mazeSize.current.rows - 1][0]?.style
            if (startCell) startCell.background = 'lime'
          }
        } else {
          drawPathfindingAnimation(animation as PahtfindingAnimation, mazeRef.current, colors)
        }

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          if (!isGenerationcomplete) {
            complete(() => {
              animationIndex.current = 0
              generationComplete()
            })
          } else {
            complete(visualizationComplete)
          }
        }
      }
    },
    false,
    [animationSpeed, visualizationComplete, colors, isGenerationcomplete]
  )

  const resetMaze = useCallback(() => {
    animationCancel()
    animationIndex.current = 0

    // calculate number of rows and columns
    let rows =
      stageHeight < width
        ? Math.floor((stageHeight / width) * 103)
        : Math.floor((width / stageHeight) * 103)
    rows = rows % 2 === 0 ? rows - 1 : rows
    cellSize.current = stageHeight / rows
    let cols = Math.floor(width / cellSize.current)
    cols = cols % 2 === 0 ? cols - 1 : cols
    rows -= 2
    cols -= 2
    mazeSize.current.rows = rows
    mazeSize.current.cols = cols

    const newMaze: string[][] = new Array(rows)

    // initialize maze
    for (let i = 0; i < rows; i++) {
      newMaze[i] = new Array(cols)
      for (let j = 0; j < cols; j++) {
        newMaze[i][j] = uuidv4()
      }
    }

    // reset refs
    mazeRef.current = new Array(cols)
    for (let i = 0; i < rows; i++) {
      mazeRef.current[i] = new Array(cols)
    }

    setMaze(newMaze)
  }, [animationCancel, stageHeight, width])

  const debounce = useDebounce(resetMaze, 100, [resetMaze])

  const getAnimations = useCallback(() => {
    if (!isGenerationcomplete) {
      const mazeColors: number[][] = new Array(mazeSize.current.rows)
      for (let i = 0; i < mazeSize.current.rows; i++) {
        mazeColors[i] = new Array(mazeSize.current.cols).fill(0)
      }
      animations.current = mazeGeneration(mazeColors)
      generatedMaze.current = mazeColors
    } else {
      animations.current = pathfinding(generatedMaze.current)
    }
  }, [isGenerationcomplete])

  useEffect(() => {
    if (isRunning && mazeSize.current.rows) {
      if (animationIndex.current === 0) {
        getAnimations()
      }
      previousTimeStamp.current = Date.now()
      animationRun()
    } else if (isPaused) {
      animationCancel()
    }
  }, [isRunning, isPaused, animationCancel, getAnimations, animationRun])

  useEffect(() => {
    if (shouldReset) debounce()
  }, [debounce, resetMaze, shouldReset])

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${mazeSize.current.cols}, 0fr)`,
        padding: `${cellSize.current}px`,
        width: `${cellSize.current * (mazeSize.current.cols + 2)}px`,
        height: `${cellSize.current * (mazeSize.current.rows + 2)}px`
      }}
    >
      {maze.map((row, i) => {
        return row.map((id, j) => {
          return (
            <div
              key={id}
              ref={(el) => (mazeRef.current[i] ? (mazeRef.current[i][j] = el) : undefined)}
              style={{
                height: `${cellSize.current}px`,
                width: `${cellSize.current}px`
              }}
              className={styles.cell}
            />
          )
        })
      })}
    </div>
  )
}
