import type { MetaFunction } from '@remix-run/node'
import styles from './_index.module.css'
import * as variants from './_index.variants'
import { Logo } from '~/assets/svg'
import { LazyMotion, m, domAnimation } from 'framer-motion'
import { Button, Stack, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mhmdjawhar/react-hooks'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Algo in Motion' },
    {
      name: 'description',
      content:
        'Experience the mesmerizing world of some of the most popular algorithms brought to life through captivating and dynamic visualizations.'
    },
    {
      name: 'og:title',
      property: 'og:title',
      content: 'Algo in Motion'
    }
  ]
}

export default function Landing() {
  return (
    <main className={styles.main}>
      <LazyMotion strict features={domAnimation}>
        <LogoSection />
        <ContentSection />
      </LazyMotion>
    </main>
  )
}

function LogoSection() {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  return (
    <m.div
      className={styles.logoContainer}
      variants={isMobile ? variants.svgContainerMobile : variants.svgContainer}
      initial="hidden"
      animate="visible"
    >
      <Logo width="100%" variants={variants.logoPath} />
    </m.div>
  )
}

const MotionTitle = m(Title)

function ContentSection() {
  return (
    <m.div initial="hidden" animate="visible" className={styles.contentContainer}>
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
      <m.div className={styles.buttonContainer} variants={variants.button}>
        <Button
          component={Link}
          to="/algorithms/quick-sort"
          className={styles.button}
          size="xl"
          variant="retro-primary"
        >
          Start
        </Button>
      </m.div>
    </m.div>
  )
}
