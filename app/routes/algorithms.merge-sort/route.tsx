import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { AlgorithmKey } from '~/static'
import { Sorting } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'Merge Sort',
    description: 'Merge Sort algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function MergeSort() {
  return <Sorting algorithm={AlgorithmKey.MergeSort} />
}
