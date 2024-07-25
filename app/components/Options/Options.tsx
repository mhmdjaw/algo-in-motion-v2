import { Slider, Stack, Text } from '@mantine/core'
import styles from './Options.module.css'
import { useLocation } from '@remix-run/react'
import { resetAllSlices, useBoundStore } from '~/store'
import { useCallback, useEffect } from 'react'
import { ALGORITHM_HANDLE } from '~/static'
import { useDebounce, useResetChild } from '@mhmdjawhar/react-hooks'

const sizeAlgorithms = [ALGORITHM_HANDLE.QUICK_SORT, ALGORITHM_HANDLE.MERGE_SORT]
const nodesAlgorithms = [ALGORITHM_HANDLE.BFS, ALGORITHM_HANDLE.DFS]
const edgesAlgorithms = [ALGORITHM_HANDLE.BFS, ALGORITHM_HANDLE.DFS]
const pointsAlgorithms = [ALGORITHM_HANDLE.TIMES_TABLES]
const citiesAlgorithms = [ALGORITHM_HANDLE.TRAVELING_SALESMAN]

export function Options() {
  const location = useLocation()
  const algorithm = location.pathname.split('/').at(-1)

  const checkOption = (optionAlgorithms: string[]) => {
    return optionAlgorithms.some((algo) => algo === algorithm)
  }

  const sizeAvailable = checkOption(sizeAlgorithms)
  const nodesAvailable = checkOption(nodesAlgorithms)
  const edgesAvailable = checkOption(edgesAlgorithms)
  const pointsAvailable = checkOption(pointsAlgorithms)
  const citiesAvailable = checkOption(citiesAlgorithms)

  const changeOption = useBoundStore((s) => s.changeOption)
  const resetVisualizer = useBoundStore((s) => s.resetVisualizer)
  const isRunning = useBoundStore((s) => s.isRunning)

  const size = useBoundStore((s) => s.size)
  const nodes = useBoundStore((s) => s.nodes)
  const edges = useBoundStore((s) => s.edges)
  const points = useBoundStore((s) => s.points)
  const cities = useBoundStore((s) => s.cities)

  // debounce speed to avoid too many rerenders
  // (other options reset the visualizer, depending on that debounce may be used on reset)
  const debounceSpeed = useDebounce((value: number) => changeOption('speed')(value), 50, [
    changeOption
  ])

  const onChangeSpeed = useCallback(
    (value: number) => {
      debounceSpeed(value)
    },
    [debounceSpeed]
  )

  const [key, resetKey] = useResetChild()

  useEffect(() => {
    resetKey()
    resetAllSlices()
  }, [location, resetKey])

  return (
    <div className={styles.container}>
      {sizeAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Size</Text>
          <Slider
            w="100%"
            max={310}
            min={5}
            value={size}
            onChange={changeOption('size', resetVisualizer)}
          />
        </Stack>
      )}
      {nodesAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Nodes</Text>
          <Slider
            w="100%"
            value={nodes}
            onChange={changeOption('nodes', resetVisualizer)}
            step={1}
            min={3}
            max={20}
            marks={[{ value: 7 }, { value: 12 }, { value: 16 }]}
          />
        </Stack>
      )}
      {edgesAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Edges</Text>
          <Slider
            w="100%"
            value={edges}
            onChange={changeOption('edges', resetVisualizer)}
            label={null}
          />
        </Stack>
      )}
      {pointsAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Points</Text>
          <Slider
            w="100%"
            value={points}
            onChange={changeOption('points', resetVisualizer)}
            min={10}
            max={600}
          />
        </Stack>
      )}
      {citiesAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Cities</Text>
          <Slider
            w="100%"
            value={cities}
            onChange={changeOption('cities', resetVisualizer)}
            step={1}
            min={3}
            max={8}
            marks={[{ value: 4.5 }, { value: 6.5 }]}
          />
        </Stack>
      )}
      <Stack className={styles.optionContainer}>
        <Text className={styles.label}>Speed</Text>
        <Slider
          key={key}
          w="100%"
          defaultValue={100}
          onChange={onChangeSpeed}
          disabled={isRunning}
        />
      </Stack>
    </div>
  )
}
