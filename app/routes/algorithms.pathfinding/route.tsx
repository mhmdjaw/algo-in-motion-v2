import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { Pathfinding as PathfindingVisualizer } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'A* Pathfinding',
    description: 'A* Pathfinding algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function Pathfinding() {
  return <PathfindingVisualizer />
}
