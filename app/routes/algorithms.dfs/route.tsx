import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { AlgorithmKey } from '~/static'
import { GraphTraversal } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'DFS',
    description: 'DFS algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function DFS() {
  return <GraphTraversal algorithm={AlgorithmKey.DFS} />
}
