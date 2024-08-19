import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { AlgorithmKey } from '~/static'
import { Sorting } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'Quick Sort',
    description: 'Quick Sort algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function QuickSort() {
  return <Sorting algorithm={AlgorithmKey.QuickSort} />
}
