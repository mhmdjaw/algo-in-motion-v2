import { Container, TypographyStylesProvider } from '@mantine/core'
import { Outlet, useLocation } from '@remix-run/react'
import { Header, Options } from '~/components'
import styles from './algorithms.module.css'
import { Fragment, useCallback, useEffect, useState } from 'react'

const modules = import.meta.glob('../../mdx/*.mdx')

export default function AlgorithmsLayout() {
  return (
    <>
      <Header />
      <main>
        <Options />
        <Outlet />
        <Info />
      </main>
    </>
  )
}

function Info() {
  const location = useLocation()
  const algorithm = location.pathname.split('/').at(-1)
  const [MDX, setMDX] = useState<unknown | null>(null)

  const ContentMDX = MDX ? (MDX as { default: React.FC }).default : Fragment

  const getModule = useCallback(async () => {
    const fckingmodule = await modules[`../../mdx/${algorithm}.mdx`]().then((mod) => mod)
    setMDX(fckingmodule)
  }, [algorithm])

  useEffect(() => {
    getModule()
  }, [getModule])

  return (
    <Container className={styles.infoContainer}>
      <TypographyStylesProvider>
        <ContentMDX />
      </TypographyStylesProvider>
    </Container>
  )
}
