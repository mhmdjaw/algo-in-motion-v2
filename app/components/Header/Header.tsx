import { Button, Group, Kbd, Menu, px, Space, useMantineTheme } from '@mantine/core'
import styles from './Header.module.css'
import { Logo } from '~/assets/svg'
import { FaCaretDown, FaPlay, FaUndoAlt, FaPause } from 'react-icons/fa'
import { useMediaQuery, useWindowEvent } from '@mhmdjawhar/react-hooks'
import { useBoundStore } from '~/store'
import { useCallback } from 'react'
import { Link, useLocation } from '@remix-run/react'
import { ALGORITHM_HANDLE, ALGORITHM_NAME, AlgorithmKey, getAlgorithmKeyByHandle } from '~/static'

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
  const location = useLocation()
  const algorithm = location.pathname.split('/').at(-1) as string
  const algorithmKey = getAlgorithmKeyByHandle(algorithm)

  return (
    <Menu offset={30} position="bottom-start">
      <Menu.Target>
        <Button
          variant="retro-secondary"
          size="sm"
          color="blue"
          leftSection={!isMobile ? <Logo width={px('1.2rem')} height={px('1.2rem')} /> : undefined}
          rightSection={<FaCaretDown fontSize={px('1.2rem')} />}
        >
          {ALGORITHM_NAME[algorithmKey]}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {Object.values(AlgorithmKey).map((key) => (
          <Menu.Item component={Link} to={`/algorithms/${ALGORITHM_HANDLE[key]}`} key={key}>
            {ALGORITHM_NAME[key]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

function Actions({ isMobile }: { isMobile?: boolean }) {
  const isComplete = useBoundStore((s) => s.isComplete)
  const isRunning = useBoundStore((s) => s.isRunning)
  const shouldReset = useBoundStore((s) => s.shouldReset())

  const resetVisualizer = useBoundStore((s) => s.resetVisualizer)
  const runVisualizer = useBoundStore((s) => s.runVisualizer)
  const pauseVisualizer = useBoundStore((s) => s.pauseVisualizer)

  const ActionIcon = isRunning ? FaPause : FaPlay
  const actionText = isRunning ? 'Pause' : 'Play'

  const handleAction = useCallback(() => {
    if (isRunning) {
      pauseVisualizer()
    } else {
      runVisualizer()
    }
  }, [isRunning, pauseVisualizer, runVisualizer])

  const windowListener = useCallback(
    (event: KeyboardEvent) => {
      if (!shouldReset && event.code === 'KeyR') {
        resetVisualizer()
      }
      if (!isComplete && event.code === 'KeyP') {
        handleAction()
      }
    },
    [handleAction, isComplete, shouldReset, resetVisualizer]
  )

  useWindowEvent('keydown', windowListener)

  return (
    <Group gap={isMobile ? 'xs' : 'xl'}>
      <Button
        variant="retro-secondary"
        leftSection={!isMobile ? <FaUndoAlt /> : undefined}
        rightSection={!isMobile ? <Kbd>R key</Kbd> : undefined}
        onClick={resetVisualizer}
        disabled={shouldReset}
      >
        {isMobile ? <FaUndoAlt /> : 'Reset'}
      </Button>
      <Button
        variant="retro-secondary"
        leftSection={!isMobile ? <ActionIcon /> : undefined}
        rightSection={!isMobile ? <Kbd>P key</Kbd> : undefined}
        disabled={isComplete}
        onClick={handleAction}
        classNames={{ label: styles.playButtonLabel }}
      >
        {isMobile ? <ActionIcon /> : actionText}
      </Button>
    </Group>
  )
}
