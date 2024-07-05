import type { LinksFunction } from '@remix-run/node'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react'
import resetStyles from './styles/normalize.css?url'
import appStyles from './styles/app.css?url'

export const links: LinksFunction = () => {
  return [
    /* Global styles */
    { rel: 'stylesheet', href: resetStyles },
    { rel: 'stylesheet', href: appStyles },
    /* Font */
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap'
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
      </head>
      <body>
        {children}
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

export function HydrateFallback() {
  return <></>
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
    errorMessage = "Sorry, the page you're looking for does not exist."
  } else {
    errorMessage = 'Something went Wrong... please refresh the page or try again later.'
  }

  return (
    <>
      {/* <div className="route-error">
              <h1>Oops</h1>
              <h2>{errorStatus}</h2>
              {errorMessage && (
                <fieldset>
                  <pre>{errorMessage}</pre>
                </fieldset>
              )}
            </div> */}
      {/* <ErrorLayout message={errorMessage} /> */}
      <p>{errorMessage}</p>
    </>
  )
}
