import { useMantineTheme } from '@mantine/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { mazeGeneration, pathfinding } from '~/algorithms'
import { useStageDimensions } from '~/hooks'
import { useBoundStore } from '~/store'
import styles from './Pathfinding.module.css'
import { useDebounce } from '@mhmdjawhar/react-hooks'

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
  const timeouts = useRef<NodeJS.Timeout[]>([])
  const timeoutsChunks = useRef<NodeJS.Timeout[]>([])

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

  const generateMaze = useCallback(() => {
    const mazeColors: number[][] = new Array(mazeSize.current.rows)
    for (let i = 0; i < mazeSize.current.rows; i++) {
      mazeColors[i] = new Array(mazeSize.current.cols).fill(0)
    }
    const animations = mazeGeneration(mazeColors)
    generatedMaze.current = mazeColors

    timeouts.current = new Array(animations.length)
    const chunks = Math.floor(animations.length / 1000)
    timeoutsChunks.current = new Array(chunks + 3)

    for (let t = 0; t < chunks; t++) {
      timeoutsChunks.current[t] = setTimeout(
        () => {
          timeouts.current = new Array(1000)
          let count = 0
          for (let index = t * 1000; index < (t + 1) * 1000; index++) {
            const animation = animations[index]
            timeouts.current[count] = setTimeout(() => {
              const { row, col } = animation
              const cell = mazeRef.current[row][col]?.style
              if (cell) cell.background = '#fff'
            }, count * animationSpeed)
            count++
          }
        },
        t * 1000 * animationSpeed
      )
    }

    const lastChunk = animations.length % 1000
    timeouts.current = new Array(lastChunk)

    //repetitive code to repeat the entire process on the last chunk
    timeoutsChunks.current[chunks] = setTimeout(
      () => {
        let count = 0
        for (let index = animations.length - lastChunk; index < animations.length; index++) {
          const animation = animations[index]
          timeouts.current[count] = setTimeout(() => {
            const { row, col } = animation
            const cell = mazeRef.current[row][col]?.style
            if (cell) cell.background = '#fff'
          }, count * animationSpeed)
          count++
        }
      },
      chunks * 1000 * animationSpeed
    )

    timeoutsChunks.current[chunks + 1] = setTimeout(
      () => {
        //color end cell redd
        const endCell = mazeRef.current[0][mazeSize.current.cols - 1]?.style
        if (endCell) endCell.background = 'red'
        // color first cell green
        const startCell = mazeRef.current[mazeSize.current.rows - 1][0]?.style
        if (startCell) startCell.background = 'lime'
      },
      animations.length * animationSpeed + 5
    )

    timeoutsChunks.current[chunks + 2] = setTimeout(
      () => {
        generationComplete()
      },
      (animations.length + 1) * animationSpeed + 5
    )
  }, [animationSpeed, generationComplete])

  const pathfindingRun = useCallback(() => {
    const animations = pathfinding(generatedMaze.current)

    timeouts.current = new Array(animations.length)
    const chunks = Math.floor(animations.length / 1000)
    timeoutsChunks.current = new Array(chunks + 2)

    for (let t = 0; t < chunks; t++) {
      timeoutsChunks.current[t] = setTimeout(
        () => {
          timeouts.current = new Array(1000)
          let count = 0
          for (let index = t * 1000; index < (t + 1) * 1000; index++) {
            const animation = animations[index]
            timeouts.current[count] = setTimeout(() => {
              switch (animation.action) {
                case 'FIND_TARGET': {
                  const { row, col } = animation
                  const cell = mazeRef.current[row][col]?.style
                  if (cell) cell.background = colors.PINK
                  break
                }

                case 'TARGET_FOUND': {
                  const { row, col } = animation
                  const cell = mazeRef.current[row][col]?.style
                  if (cell) cell.background = colors.BLUE
                  break
                }

                default:
                  break
              }
            }, count * animationSpeed)
            count++
          }
        },
        t * 1000 * animationSpeed
      )
    }

    const lastChunk = animations.length % 1000
    timeouts.current = new Array(lastChunk)

    //repetitive code to repeat the entire process on the last chunk
    timeoutsChunks.current[chunks] = setTimeout(
      () => {
        let count = 0
        for (let index = animations.length - lastChunk; index < animations.length; index++) {
          const animation = animations[index]
          timeouts.current[count] = setTimeout(() => {
            switch (animation.action) {
              case 'FIND_TARGET': {
                const { row, col } = animation
                const cell = mazeRef.current[row][col]?.style
                if (cell) cell.background = colors.PINK
                break
              }

              case 'TARGET_FOUND': {
                const { row, col } = animation
                const cell = mazeRef.current[row][col]?.style
                if (cell) cell.background = colors.BLUE
                break
              }

              default:
                break
            }
          }, count * animationSpeed)
          count++
        }
      },
      chunks * 1000 * animationSpeed
    )

    timeoutsChunks.current[chunks + 1] = setTimeout(
      () => {
        visualizationComplete()
      },
      animations.length * animationSpeed + 5
    )
  }, [animationSpeed, colors.BLUE, colors.PINK, visualizationComplete])

  const resetMaze = useCallback(() => {
    timeoutsChunks.current.map((timeout) => clearTimeout(timeout))
    timeouts.current.map((timeout) => clearTimeout(timeout))

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

    for (let i = 0; i < rows; i++) {
      newMaze[i] = new Array(cols)
      for (let j = 0; j < cols; j++) {
        newMaze[i][j] = uuidv4()
      }
    }

    mazeRef.current = new Array(cols)
    for (let i = 0; i < rows; i++) {
      mazeRef.current[i] = new Array(cols)
    }

    setMaze(newMaze)
  }, [stageHeight, width])

  const debounce = useDebounce(resetMaze, 100, [resetMaze])

  useEffect(() => {
    if (isRunning && !isGenerationcomplete) {
      generateMaze()
    } else if (isRunning) {
      pathfindingRun()
    }
  }, [pathfindingRun, isRunning, isGenerationcomplete, generateMaze])

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
