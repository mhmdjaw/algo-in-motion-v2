import { Slider, Stack, Text } from '@mantine/core'
import styles from './Options.module.css'
import { useLocation } from '@remix-run/react'
import { useBoundStore } from '~/store'

const sizeAlgorithms = ['quick-sort', 'merge-sort']
const nodesAlgorithms = ['bfs', 'dfs']
const edgesAlgorithms = ['bfs', 'dfs']
const pointsAlgorithms = ['times-table']
const citiesAlgorithms = ['traveling-salesman']

export function Options() {
  const location = useLocation()
  const algorithm = location.pathname.split('/')[2]

  const checkOption = (optionAlgorithms: string[]) => {
    return optionAlgorithms.some((algo) => algo === algorithm)
  }

  const sizeAvailable = checkOption(sizeAlgorithms)
  const nodesAvailable = checkOption(nodesAlgorithms)
  const edgesAvailable = checkOption(edgesAlgorithms)
  const pointsAvailable = checkOption(pointsAlgorithms)
  const citiesAvailable = checkOption(citiesAlgorithms)

  const changeOption = useBoundStore((state) => state.changeOption)
  const isRunning = useBoundStore((state) => state.isRunning)
  const isGenerating = useBoundStore((state) => state.isGenerating)

  const speed = useBoundStore((state) => state.speed)
  const size = useBoundStore((state) => state.size)

  return (
    <div className={styles.container}>
      {sizeAvailable && (
        <Stack className={styles.optionContainer}>
          <Text className={styles.label}>Size</Text>
          <Slider w="100%" max={310} min={5} value={size} onChange={changeOption('size')} />
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
