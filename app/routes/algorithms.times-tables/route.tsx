import type { MetaFunction } from '@remix-run/node'
import { getMetaProperties } from '~/helpers'
import { TimesTables as TimesTablesVisualizer } from '~/visualizers'

export const meta: MetaFunction = ({ location }) => {
  return getMetaProperties({
    title: 'Times Tables',
    description: 'Times Tables algorithm visualizer.',
    pathname: location.pathname
  })
}

export default function TravelingTableVisualizer() {
  return <TimesTablesVisualizer />
}
