import type { MetaFunction } from '@remix-run/node'
import { AlgorithmKey } from '~/static'
import { GraphTraversal } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | DFS' },
    { name: 'description', content: 'DFS algorithm visualizer.' }
  ]
}

export default function DFS() {
  return <GraphTraversal algorithm={AlgorithmKey.DFS} />
}
