import { Button, Center, Text, Title } from '@mantine/core'
import { Footer } from '../Footer'
import styles from './ErrorLayout.module.css'
import { Logo } from '~/assets/svg'

interface ErrorLayoutProps {
  message: string
}

export function ErrorLayout({ message }: ErrorLayoutProps) {
  return (
    <>
      <main className={styles.main}>
        <Center className={styles.center}>
          <Logo width={150} />
          <Title fz={60}>OOPS!</Title>
          <Text fw="var(--mantine-fw-md)" fz={24}>
            {message}
          </Text>
          <Button component="a" href="/" variant="retro-primary" size="xl">
            Home
          </Button>
        </Center>
      </main>
      <Footer />
    </>
  )
}
