import { redirect } from '@remix-run/react'

export async function clientLoader() {
  return redirect('/algorithms/quick-sort')
}
