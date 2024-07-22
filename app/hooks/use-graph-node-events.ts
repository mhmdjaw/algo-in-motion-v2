import type { KonvaEventObject } from 'konva/lib/Node'
import { useCallback } from 'react'

export const useGraphNodeEvents = () => {
  const onMouseEnter = useCallback(() => {
    document.body.style.cursor = 'grab'
  }, [])

  const onMouseLeave = useCallback(() => {
    document.body.style.cursor = 'default'
  }, [])

  const onMouseDown = useCallback((e: KonvaEventObject<DragEvent>) => {
    document.body.style.cursor = 'grabbing'
    e.target.to({ scaleX: 1.2, scaleY: 1.2, duration: 0.05 })
  }, [])

  const onMouseUp = useCallback((e: KonvaEventObject<DragEvent>) => {
    document.body.style.cursor = 'grab'
    e.target.to({ scaleX: 1, scaleY: 1, duration: 0.05 })
  }, [])

  return { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp }
}
