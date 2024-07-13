import { Button, Group, Kbd, px, Space, useMantineTheme } from '@mantine/core'
import styles from './Header.module.css'
import { Logo } from '~/assets/svg'
import { FaCaretDown, FaPlay, FaUndoAlt, FaPause } from 'react-icons/fa'
import { useMediaQuery } from '@mhmdjawhar/react-hooks'

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
  return (
    <Group gap={isMobile ? 'xs' : 'xl'}>
      <Button
        variant="retro-secondary"
        leftSection={!isMobile ? <FaUndoAlt /> : undefined}
        rightSection={!isMobile ? <Kbd>R</Kbd> : undefined}
      >
        {isMobile ? <FaUndoAlt /> : 'Reset'}
      </Button>
      <Button
        variant="retro-secondary"
        leftSection={
          !isMobile ? (
            <FaPlay />
          ) : // <FaPause />
          undefined
        }
        rightSection={!isMobile ? <Kbd>Enter</Kbd> : undefined}
      >
        {isMobile ? (
          <FaPlay />
        ) : (
          // <FaPause />
          'Play'
        )}
      </Button>
    </Group>
  )
}
