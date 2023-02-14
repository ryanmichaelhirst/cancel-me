import { Outlet, RouteDataArgs } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Navbar } from '~/components/nav-bar'
import { useUser } from '~/lib/useUser'
import { getProducts } from '~/util'

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(async (_, { request }) => {
    const user = await useUser(request)

    return { user, products: await getProducts() }
  })
}

export type useLayoutRouteData = typeof routeData

export default function Index() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
