import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { TravelingSalesman as TravelingSalesmanVisualizer } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'Traveling Salesman',
    description: 'Traveling Salesman algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function TravelingSalesman() {
  return <TravelingSalesmanVisualizer />
}
