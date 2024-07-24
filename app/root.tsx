/* imoprt styles */
import './styles/normalize.css'
import './styles/app.css'
import '@mantine/core/styles.css'

import type { LinksFunction } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from '@remix-run/react'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import theme, { resolver } from './theme'
import { ErrorLayout } from './components'

export const links: LinksFunction = () => {
  return [
    /* Font */
    /* font */
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Erica+One&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
    },
    /* favicon */
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} cssVariablesResolver={resolver} defaultColorScheme="dark">
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/**
 * No need to duplicate HTML document app shell for the following root elements since
 * remix will wraps them with the exported Layout above.
 */

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  let errorMessage = 'Unknown error'
  let errorStatus = 500

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  if (errorStatus === 404) {
    errorMessage = "Looks like you're lost. Here's a way back home!"
  } else {
    errorMessage = 'Something went Wrong... please refresh the page or try again later.'
  }

  return <ErrorLayout message={errorMessage} />
}

export function HydrateFallback() {
  return <></>
}
