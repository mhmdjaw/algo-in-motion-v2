import type { MetaFunction } from '@remix-run/node'
import { AlgorithmKey } from '~/static'
import { GraphTraversal } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | BFS' },
    { name: 'description', content: 'BFS algorithm visualizer.' }
  ]
}

export default function BFS() {
  return <GraphTraversal algorithm={AlgorithmKey.BFS} />
}
