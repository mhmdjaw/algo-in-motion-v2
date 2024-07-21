import type { MetaFunction } from '@remix-run/node'
import { TravelingSalesman as TravelingSalesmanVisualizer } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | Traveling Salesman' },
    { name: 'description', content: 'Traveling Salesman algorithm visualizer.' }
  ]
}

export default function TravelingSalesman() {
  return <TravelingSalesmanVisualizer />
}
