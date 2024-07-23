import type { MetaFunction } from '@remix-run/node'
import { Pathfinding as PathfindingVisualizer } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | A* Pathfinding' },
    { name: 'description', content: 'A* Pathfinding algorithm visualizer.' }
  ]
}

export default function Pathfinding() {
  return <PathfindingVisualizer />
}
