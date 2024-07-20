import type { MetaFunction } from '@remix-run/node'
import { AlgorithmKey } from '~/static'
import { Sorting } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | Quick Sort' },
    { name: 'description', content: 'Quick Sort algorithm visualizer.' }
  ]
}

export default function QuickSort() {
  return <Sorting algorithm={AlgorithmKey.QuickSort} />
}
