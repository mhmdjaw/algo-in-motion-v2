import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  mergeSort,
  quickSort,
  type MergeSortAnimation,
  type QuickSortAnimation
} from '~/algorithms'
import { cloneArray, randomNumberInterval } from '~/helpers'
import { useMantineTheme } from '@mantine/core'
import { useBoundStore } from '~/store'
import styles from './Sorting.module.css'
import { useAnimationFrame } from '@mhmdjawhar/react-hooks'
import { drawMergeSortAnimation, drawQuickSortAnimation } from './Sorting.drawer'
import { ALGORITHM_HANDLE } from '~/static'

export interface ArrayNumber {
  id: string
  value: number
}

export function Sorting({ algorithm }: { algorithm: string }) {
  const size = useBoundStore((s) => s.size)
  const speed = useBoundStore((s) => s.speed)
  const isRunning = useBoundStore((s) => s.isRunning)
  const isPaused = useBoundStore((s) => s.isPaused)
  const isReset = useBoundStore((s) => s.isReset())
  const visualizationComplete = useBoundStore((s) => s.visualizationComplete)

  const [array, setArray] = useState<ArrayNumber[]>([])
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const animations = useRef<QuickSortAnimation[] | MergeSortAnimation[]>([])
  const animationIndex = useRef<number>(0)
  const previousTimeStamp = useRef(Date.now())

  const theme = useMantineTheme()
  const colors = useMemo(
    () => ({
      PINK: theme.colors.pink[7],
      BLUE: theme.colors.blue[6],
      YELLOW: 'yellow',
      GREEN: 'lime',
      RED: 'red'
    }),
    [theme.colors.blue, theme.colors.pink]
  )

  // FPS interval (converted to ms)
  const animationSpeed = (1 - speed / 100) * (16 + (310 - size)) + 5

  // total widths of all bars combined (so we can adjust the space between them depending on the size)
  const totalBarWidths = 90 - ((90 - 50) / 306) * (size - 4)
  // width per bar
  const width = totalBarWidths / size

  const resetArray = useCallback(() => {
    animationIndex.current = 0

    const newArray: ArrayNumber[] = []

    for (let i = 0; i < size; i++) {
      newArray.push({
        id: uuidv4(),
        value: (randomNumberInterval(4, 200) / 200) * 100
      })
    }

    barsRef.current = new Array(newArray.length)
    setArray(newArray)
  }, [size])

  const [quickSortRun, quickSortCancel] = useAnimationFrame(
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

        const animation = animations.current[index] as QuickSortAnimation

        drawQuickSortAnimation(animation, barsRef.current, colors)

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [array, animationSpeed, visualizationComplete, colors]
  )

  const [mergeSortRun, mergeSortCancel] = useAnimationFrame(
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

        const animation = animations.current[index] as MergeSortAnimation

        drawMergeSortAnimation(animation, barsRef.current, colors)

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [array, animationSpeed, visualizationComplete]
  )

  useEffect(() => {
    if (isRunning) {
      if (algorithm === ALGORITHM_HANDLE.QUICK_SORT) {
        if (animationIndex.current === 0) {
          animations.current = quickSort(cloneArray(array))
        }
        previousTimeStamp.current = Date.now()
        quickSortRun()
      } else if (algorithm === ALGORITHM_HANDLE.MERGE_SORT) {
        if (animationIndex.current === 0) {
          animations.current = mergeSort(cloneArray(array))
        }
        previousTimeStamp.current = Date.now()
        mergeSortRun()
      }
    } else if (isPaused) {
      quickSortCancel()
      mergeSortCancel()
    }
  }, [
    isRunning,
    algorithm,
    array,
    isPaused,
    quickSortRun,
    quickSortCancel,
    mergeSortRun,
    mergeSortCancel
  ])

  useLayoutEffect(() => {
    if (isReset) resetArray()
  }, [isReset, resetArray])

  return (
    <div className={styles.container}>
      {array.map((nb, i) => (
        <div
          ref={(el) => (barsRef.current[i] = el)}
          className={styles.bar}
          key={nb.id}
          style={{ height: `${nb.value}%`, width: `${width}%` }}
        />
      ))}
    </div>
  )
}
