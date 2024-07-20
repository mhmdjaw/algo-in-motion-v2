import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  mergeSort,
  quickSort,
  type MergeSortAnimation,
  type QuickSortAnimation
} from '~/algorithms'
import { randomNumberInterval } from '~/helpers'
import cloneDeep from 'lodash/cloneDeep'
import { useMantineTheme } from '@mantine/core'
import { useBoundStore } from '~/store'
import styles from './Sorting.module.css'
import { useAnimationFrame } from '@mhmdjawhar/react-hooks'
import { drawMergeSortAnimation, drawQuickSortAnimation } from './Sorting.drawer'
import { AlgorithmKey } from '~/static'
import type { ArrayNumber } from '~/algorithms/interfaces'

export function Sorting({ algorithm }: { algorithm: AlgorithmKey }) {
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
  const animationSpeed = useMemo(() => (1 - speed / 100) * (16 + (310 - size)) + 5, [size, speed])

  // total widths of all bars combined (so we can adjust the space between them depending on the size)
  const totalBarWidths = 90 - ((90 - 50) / 306) * (size - 4)
  // width per bar
  const width = totalBarWidths / size

  const resetArray = useCallback(() => {
    animationIndex.current = 0

    const newArray: ArrayNumber[] = []

    // generate values
    for (let i = 0; i < size; i++) {
      newArray.push({
        id: uuidv4(),
        value: (randomNumberInterval(4, 200) / 200) * 100
      })
    }

    // initialize refs array
    barsRef.current = new Array(newArray.length)

    setArray(newArray)
  }, [size])

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

        if (algorithm === AlgorithmKey.QuickSort) {
          drawQuickSortAnimation(animation as QuickSortAnimation, barsRef.current, colors)
        } else if (algorithm === AlgorithmKey.MergeSort) {
          drawMergeSortAnimation(animation as MergeSortAnimation, barsRef.current, colors)
        }

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [array, animationSpeed, visualizationComplete, colors]
  )

  const getAnimations = useCallback(() => {
    if (algorithm === AlgorithmKey.QuickSort) {
      animations.current = quickSort(cloneDeep(array))
    } else if (algorithm === AlgorithmKey.MergeSort) {
      animations.current = mergeSort(cloneDeep(array))
    }
  }, [algorithm, array])

  useEffect(() => {
    if (isRunning) {
      if (animationIndex.current === 0) {
        getAnimations()
      }
      previousTimeStamp.current = Date.now()
      animationRun()
    } else if (isPaused) {
      animationCancel()
    }
  }, [isRunning, isPaused, animationRun, animationCancel, getAnimations])

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
