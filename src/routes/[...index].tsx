import { Outlet, RouteDataArgs } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Navbar } from '~/components/nav-bar'
import { credentials, getProducts } from '~/util'

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(async () => {
    return { credentials: credentials(), products: await getProducts() }
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
