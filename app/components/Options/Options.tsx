import { Slider, Stack, Text } from '@mantine/core'
import styles from './Options.module.css'
import { useLocation } from '@remix-run/react'
import { resetAllSlices, useBoundStore } from '~/store'
import { useEffect } from 'react'
import { ALGORITHM_HANDLE } from '~/static'

const sizeAlgorithms = [ALGORITHM_HANDLE.QUICK_SORT, ALGORITHM_HANDLE.MERGE_SORT]
const nodesAlgorithms = [ALGORITHM_HANDLE.BFS, ALGORITHM_HANDLE.DFS]
const edgesAlgorithms = [ALGORITHM_HANDLE.BFS, ALGORITHM_HANDLE.DFS]
const pointsAlgorithms = [ALGORITHM_HANDLE.TIMES_TABLE]
const citiesAlgorithms = [ALGORITHM_HANDLE.PATHFINDING]

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
  const isGenerating = useBoundStore((s) => s.isGenerating)

  const speed = useBoundStore((s) => s.speed)
  const size = useBoundStore((s) => s.size)
  const nodes = useBoundStore((s) => s.nodes)
  const edges = useBoundStore((s) => s.edges)

  useEffect(() => {
    resetAllSlices()
  }, [location])

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
          <Slider w="100%" value={edges} onChange={changeOption('edges', resetVisualizer)} />
        </Stack>
      )}
      <Stack className={styles.optionContainer}>
        <Text className={styles.label}>Speed</Text>
        <Slider
          w="100%"
          value={speed}
          onChange={changeOption('speed')}
          disabled={isRunning || isGenerating}
        />
      </Stack>
    </div>
  )
}
