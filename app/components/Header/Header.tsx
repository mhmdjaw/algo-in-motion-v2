import { Button, Group, Kbd, px, Space, useMantineTheme } from '@mantine/core'
import styles from './Header.module.css'
import { Logo } from '~/assets/svg'
import { FaCaretDown, FaPlay, FaUndoAlt, FaPause } from 'react-icons/fa'
import { useMediaQuery, useWindowEvent } from '@mhmdjawhar/react-hooks'
import { useBoundStore } from '~/store'
import { useCallback } from 'react'

export function Header() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  return (
    <>
      <header className={styles.header}>
        <AlgorithmsMenu isMobile={isMobile} />
        <Actions isMobile={isMobile} />
      </header>
      <Space h="75px" />
    </>
  )
}

function AlgorithmsMenu({ isMobile }: { isMobile?: boolean }) {
  return (
    <Button
      variant="retro-secondary"
      size="sm"
      color="blue"
      leftSection={!isMobile ? <Logo width={px('1.2rem')} height={px('1.2rem')} /> : undefined}
      rightSection={<FaCaretDown fontSize={px('1.2rem')} />}
    >
      Traveling Salesman
    </Button>
  )
}

function Actions({ isMobile }: { isMobile?: boolean }) {
  const isComplete = useBoundStore((state) => state.isComplete)
  const isRunning = useBoundStore((state) => state.isRunning)
  const isGenerating = useBoundStore((state) => state.isGenerating)
  const isReset = useBoundStore((state) => state.isReset())

  const resetVisualizer = useBoundStore((state) => state.resetVisualizer)
  const runVisualizer = useBoundStore((state) => state.runVisualizer)
  const pauseVisualizer = useBoundStore((state) => state.pauseVisualizer)
  const generateVisualizer = useBoundStore((state) => state.generateVisualizer)

  const isPlaying = isRunning || isGenerating
  const ActionIcon = isPlaying ? FaPause : FaPlay

  const handleAction = useCallback(() => {
    if (isPlaying || isGenerating) {
      pauseVisualizer()
    } else {
      if (isGenerating) {
        generateVisualizer()
      } else {
        runVisualizer()
      }
    }
  }, [generateVisualizer, isGenerating, isPlaying, pauseVisualizer, runVisualizer])

  const windowListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'KeyR') {
        resetVisualizer()
      }
      if (event.code === 'Enter') {
        handleAction()
      }
    },
    [handleAction, resetVisualizer]
  )

  useWindowEvent('keydown', windowListener)

  return (
    <Group gap={isMobile ? 'xs' : 'xl'}>
      <Button
        variant="retro-secondary"
        leftSection={!isMobile ? <FaUndoAlt /> : undefined}
        rightSection={!isMobile ? <Kbd>R</Kbd> : undefined}
        onClick={resetVisualizer}
      >
        {isMobile ? <FaUndoAlt /> : 'Reset'}
      </Button>
      <Button
        variant="retro-secondary"
        leftSection={!isMobile ? <ActionIcon /> : undefined}
        rightSection={!isMobile ? <Kbd>Enter</Kbd> : undefined}
        disabled={isComplete}
        onClick={handleAction}
      >
        {isMobile ? <ActionIcon /> : 'Play'}
      </Button>
    </Group>
  )
}
