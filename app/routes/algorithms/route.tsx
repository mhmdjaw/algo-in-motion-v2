import { Container, TypographyStylesProvider } from '@mantine/core'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Header, Options } from '~/components'
import styles from './algorithms.module.css'
import { Fragment, type PropsWithChildren } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/node'

const modules = import.meta.glob('../../mdx/*.mdx')

export const clientLoader = ({ request }: LoaderFunctionArgs) => {
  const algorithm = request.url.split('/').at(-1)
  return modules[`../../mdx/${algorithm}.mdx`]()
}

export default function AlgorithmsLayout() {
  const module = useLoaderData() as { default: React.FC }

  const MDX = module ? module.default : Fragment

  return (
    <>
      <Header />
      <main>
        <Options />
        <Outlet />
        <Info>
          <MDX />
        </Info>
      </main>
    </>
  )
}

function Info({ children }: PropsWithChildren) {
  return (
    <Container className={styles.infoContainer}>
      <TypographyStylesProvider>{children}</TypographyStylesProvider>
    </Container>
  )
}
