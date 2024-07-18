import { Container, Loader, TypographyStylesProvider } from '@mantine/core'
import {
  Await,
  defer,
  Outlet,
  useLoaderData,
  type ShouldRevalidateFunctionArgs
} from '@remix-run/react'
import { Footer, Header, Options } from '~/components'
import styles from './algorithms.module.css'
import { Fragment, Suspense, type PropsWithChildren } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/node'

const modules = import.meta.glob('../../mdx/*.mdx')

export const clientLoader = ({ request }: LoaderFunctionArgs) => {
  const algorithm = request.url.split('/').at(-1)
  const module = modules[`../../mdx/${algorithm}.mdx`]()
  return defer({ module })
}

export default function AlgorithmsLayout() {
  const { module } = useLoaderData<typeof clientLoader>()

  return (
    <>
      <Header />
      <main>
        <Options />
        <Outlet />
        <Info>
          <Suspense fallback={<Loader size="xl" type="bars" m="0 auto" />}>
            <Await resolve={module}>
              {(module) => {
                const MDX = module ? (module as { default: React.FC }).default : Fragment
                return <MDX />
              }}
            </Await>
          </Suspense>
        </Info>
      </main>
      <Footer />
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

export const shouldRevalidate = ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => {
  return currentUrl !== nextUrl
}
