import type { LoaderFunctionArgs } from '@remix-run/node'

export async function clientLoader({ request }: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404
  })
}

export default function CatchAllPage() {
  return null
}
