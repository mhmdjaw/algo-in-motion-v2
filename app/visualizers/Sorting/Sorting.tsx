import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Algorithm } from '~/static'
import { quickSort, type ArrayNumber, type QuickSortAnimation } from '~/algorithms'
import { cloneArray, randomNumberInterval } from '~/helpers'
import { useMantineTheme } from '@mantine/core'
import { useBoundStore } from '~/store'
import styles from './Sorting.module.css'
import { useAnimationFrame } from '@mhmdjawhar/react-hooks'

export function Sorting({ algorithm }: { algorithm: Algorithm }) {
  const size = useBoundStore((state) => state.size)
  const speed = useBoundStore((state) => state.speed)
  const isRunning = useBoundStore((state) => state.isRunning)
  const isPaused = useBoundStore((state) => state.isPaused)
  const isReset = useBoundStore((state) => state.isReset())
  const visualizationComplete = useBoundStore((state) => state.visualizationComplete)

  const [array, setArray] = useState<ArrayNumber[]>([])
  const barRef = useRef<(HTMLDivElement | null)[]>([])
  const animations = useRef<QuickSortAnimation[]>([])
  const animationIndex = useRef<number>(0)
  const previousTimeStamp = useRef(Date.now())

  const theme = useMantineTheme()
  const [PINK, BLUE, YELLOW, GREEN, RED] = [
    theme.colors.pink[7],
    theme.colors.blue[6],
    'yellow',
    'lime',
    'red'
  ]

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

    barRef.current = new Array(newArray.length)
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

        const animation = animations.current[index]

        switch (animation.action) {
          case 'PIVOT': {
            const pivot = animation.index[0]
            const i = animation.index[1]
            const j = animation.index[2]
            const pivotBar = barRef.current[pivot]?.style
            const iBar = barRef.current[i]?.style
            const jBar = barRef.current[j]?.style

            if (pivotBar) pivotBar.background = YELLOW
            if (iBar) iBar.background = GREEN
            if (jBar) jBar.background = GREEN

            break
          }

          case 'ITERATE_LOW': {
            const i = animation.index[0]
            const iBar = barRef.current[i]?.style
            const nextBar = barRef.current[i + 1]?.style

            if (iBar) iBar.background = BLUE
            if (nextBar) nextBar.background = GREEN

            break
          }

          case 'ITERATE_HIGH': {
            const j = animation.index[0]
            const jBar = barRef.current[j]?.style
            const nextBar = barRef.current[j - 1]?.style

            if (jBar) jBar.background = BLUE
            if (nextBar) nextBar.background = GREEN

            break
          }

          case 'SWAP_COLOR': {
            const i = animation.index[0]
            const j = animation.index[1]
            const iBar = barRef.current[i]?.style
            const jBar = barRef.current[j]?.style

            if (iBar) iBar.background = RED
            if (jBar) jBar.background = RED

            break
          }

          case 'SWAP_VALUES': {
            const i = animation.index[0]
            const iHeight = animation.index[1]
            const j = animation.index[2]
            const jHeight = animation.index[3]
            const iBar = barRef.current[i]?.style
            const jBar = barRef.current[j]?.style

            if (iBar) iBar.height = `${iHeight}%`
            if (jBar) jBar.height = `${jHeight}%`

            break
          }

          case 'SWAP_DONE': {
            const i = animation.index[0]
            const j = animation.index[1]
            const iBar = barRef.current[i]?.style
            const jBar = barRef.current[j]?.style
            const nextiBar = barRef.current[i + 1]?.style
            const nextjBar = barRef.current[j - 1]?.style

            if (iBar) iBar.background = BLUE
            if (jBar) jBar.background = BLUE
            if (nextiBar) nextiBar.background = GREEN
            if (nextjBar) nextjBar.background = GREEN

            break
          }

          case 'SWAP_PIVOT': {
            const pivot = animation.index[0]
            const j = animation.index[1]
            const i = animation.index[2]
            const pivotBar = barRef.current[pivot]?.style
            const jBar = barRef.current[j]?.style
            const iBar = barRef.current[i]?.style

            if (pivotBar) pivotBar.background = RED
            if (jBar) jBar.background = RED
            if (iBar) iBar.background = BLUE

            break
          }

          case 'SWAP_PIVOT_DONE': {
            const pivot = animation.index[0]
            const j = animation.index[1]
            const pivotBar = barRef.current[pivot]?.style
            const jBar = barRef.current[j]?.style

            if (pivotBar) pivotBar.background = BLUE
            if (jBar) jBar.background = BLUE

            break
          }

          default:
            break
        }

        ++animationIndex.current

        if (animationIndex.current >= animations.current.length) {
          complete(visualizationComplete)
        }
      }
    },
    false,
    [array, animationSpeed, YELLOW, GREEN, BLUE, RED, visualizationComplete]
  )

  // const mergeSortRun = useCallback(() => {
  //   const animations = mergeSort(array)
  //   timeouts.current = new Array(animations.length + 1)

  //   animations.forEach((animation, index) => {
  //     switch (animation.action) {
  //       case 'SAVE_VALUE': {
  //         const i = animation.index[0]
  //         const iBar = barRef.current[i]?.style

  //         timeouts.current[index] = setTimeout(() => {
  //           if (iBar) iBar.background = PRIMARY_COLOR
  //         }, index * animationSpeed)

  //         break
  //       }

  //       case 'UPDATE_PARTITION': {
  //         const i = animation.index[0]
  //         const iHeight = animation.index[1]
  //         const iBar = barRef.current[i]?.style

  //         timeouts.current[index] = setTimeout(() => {
  //           if (iBar) {
  //             iBar.background = SECONDARY_COLOR
  //             iBar.height = `${iHeight}%`
  //           }
  //         }, index * animationSpeed)

  //         break
  //       }

  //       default:
  //         break
  //     }
  //   })

  //   timeouts.current[animations.length + 1] = setTimeout(() => {
  //     dispatch(visualizationComplete())
  //   }, animations.length * animationSpeed)
  // }, [array, animationSpeed, PRIMARY_COLOR, SECONDARY_COLOR, dispatch])

  useEffect(() => {
    if (isRunning) {
      previousTimeStamp.current = Date.now()
      if (algorithm === Algorithm.QuickSort) {
        if (animationIndex.current === 0) {
          animations.current = quickSort(cloneArray(array))
        }
        quickSortRun()
      } else if (algorithm === Algorithm.MergeSort) {
        // mergeSortRun()
      }
    } else if (isPaused) {
      quickSortCancel()
    }
  }, [isRunning, quickSortRun, algorithm, array, isPaused, quickSortCancel])

  useLayoutEffect(() => {
    if (isReset) resetArray()
  }, [isReset, resetArray])

  return (
    <div className={styles.container}>
      {array.map((nb, i) => (
        <div
          ref={(el) => (barRef.current[i] = el)}
          className={styles.bar}
          key={nb.id}
          style={{ height: `${nb.value}%`, width: `${width}%` }}
        ></div>
      ))}
    </div>
  )
}
