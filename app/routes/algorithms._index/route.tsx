import { redirect } from '@remix-run/react'

export const clientLoader = () => {
  return redirect('/algorithms/quick-sort')
}

export default function Algorithms() {
  return null
}
