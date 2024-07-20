import type { MetaFunction } from '@remix-run/node'
import { AlgorithmKey } from '~/static'
import { Sorting } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | Merge Sort' },
    { name: 'description', content: 'Merge Sort algorithm visualizer.' }
  ]
}

export default function MergeSort() {
  return <Sorting algorithm={AlgorithmKey.MergeSort} />
}
