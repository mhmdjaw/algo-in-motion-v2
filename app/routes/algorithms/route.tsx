import { Outlet } from '@remix-run/react'
import { Header, Options } from '~/components'

export default function AlgorithmsLayout() {
  return (
    <>
      <Header />
      <main>
        <Options />
        <Outlet />
      </main>
    </>
  )
}
