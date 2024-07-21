import { px, rem, useMantineTheme } from '@mantine/core'
import { useViewportSize } from '@mhmdjawhar/react-hooks'
import { useMemo } from 'react'

export const useStageDimensions = () => {
  const theme = useMantineTheme()

  const { width } = useViewportSize()
  const dimensions = useMemo(
    () => ({
      stageWidth: 0.95 * width,
      stageHeight:
        0.9 * window.innerHeight -
        ((px(theme.other.headerHeight) as number) + (px(rem(100)) as number))
    }),
    [theme.other.headerHeight, width]
  )

  return dimensions
}
