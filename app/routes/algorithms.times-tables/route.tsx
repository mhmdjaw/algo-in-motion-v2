import type { MetaFunction } from '@remix-run/node'
import { TimesTables as TimesTablesVisualizer } from '~/visualizers'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion | Times Tables' },
    { name: 'description', content: 'Times Tables algorithm visualizer.' }
  ]
}

export default function TravelingTableVisualizer() {
  return <TimesTablesVisualizer />
}
