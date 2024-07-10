import type { MetaFunction } from '@remix-run/node'
import styles from './_index.module.css'
import * as variants from './_index.variants'
import { Logo } from '~/assets/svg'
import { motion } from 'framer-motion'
import { Button, Stack, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '~/hooks'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo In Motion' },
    { name: 'description', content: 'Welcome to Algo In Motion, have fun!' }
  ]
}

export default function Landing() {
  return (
    <main className={styles.main}>
      <LogoSection />
      <ContentSection />
    </main>
  )
}

function LogoSection() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  return (
    <motion.div
      className={styles.logoContainer}
      variants={isMobile ? variants.svgContainerMobile : variants.svgContainer}
      initial="hidden"
      animate="visible"
    >
      <Logo width="100%" variants={variants.logoPath} />
    </motion.div>
  )
}

const MotionTitle = motion(Title)

function ContentSection() {
  return (
    <motion.div initial="hidden" animate="visible" className={styles.contentContainer}>
      <Stack mb="xl" gap={0}>
        <div className={styles.titleContainer}>
          <MotionTitle order={1} variants={variants.title} custom={0}>
            Al<span className="pink">g</span>o
          </MotionTitle>
        </div>
        <div className={styles.titleContainer}>
          <MotionTitle order={1} variants={variants.title} custom={1}>
            I<span className="red">n</span>
          </MotionTitle>
        </div>
        <div className={styles.titleContainer}>
          <MotionTitle order={1} variants={variants.title} custom={2}>
            <span className="yellow">M</span>o<span className="green">t</span>io
            <span className="blue">n</span>
          </MotionTitle>
        </div>
      </Stack>
      <motion.div variants={variants.button}>
        <Button className={styles.button} size="xl" variant="retro">
          Start
        </Button>
      </motion.div>
    </motion.div>
  )
}
