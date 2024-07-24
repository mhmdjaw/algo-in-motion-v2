import { Anchor, Button, Container, Group, Space, Stack, Text, Title } from '@mantine/core'
import styles from './Footer.module.css'
import { VscGithubInverted } from 'react-icons/vsc'
import { FaClockRotateLeft } from 'react-icons/fa6'
import { Logo } from '~/assets/svg'

export function Footer() {
  return (
    <footer className={styles.root}>
      <Space h={'var(--footer-height)'} />
      <div className={styles.footerContainer}>
        <Container className={styles.container}>
          <Stack className={styles.content}>
            <Group className={styles.header}>
              <Logo width={60} />
              <Title ta="center">Algo in Motion</Title>
            </Group>
            <Group className={styles.bottomSection}>
              <Text size="lg" ta="center">
                Made with ❤️ by <Anchor href="https://github.com/mhmdjaw">Mohamad Jawhar</Anchor>
              </Text>
              <Group className={styles.buttons}>
                <Button
                  component="a"
                  href="https://github.com/mhmdjaw/algo-in-motion-v2"
                  variant="retro-primary"
                  size="lg"
                  leftSection={<VscGithubInverted />}
                >
                  GitHub
                </Button>
                <Button
                  component="a"
                  href="https://mhmdjaw.github.io/algo-in-motion"
                  variant="retro-primary"
                  size="lg"
                  color="blue"
                  leftSection={<FaClockRotateLeft />}
                >
                  Old Version
                </Button>
              </Group>
            </Group>
          </Stack>
        </Container>
      </div>
    </footer>
  )
}
