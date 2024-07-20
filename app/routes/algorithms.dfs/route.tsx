import type { MetaFunction } from '@remix-run/node'
import { ALGORITHM_HANDLE } from '~/static'
import { GraphTraversal } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | DFS' },
    { name: 'description', content: 'DFS algorithm visualizer.' }
  ]
}

export default function DFS() {
  return <GraphTraversal algorithm={ALGORITHM_HANDLE.DFS} />
}
