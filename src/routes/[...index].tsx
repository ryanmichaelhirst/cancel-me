import { Outlet, RouteDataArgs, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Navbar } from '~/components/nav-bar'
import { twitterLite } from '~/lib/twitter-lite'
import { getProducts } from '~/util/products'

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(async () => {
    const credentials = twitterLite.credentials
    const products = await getProducts()

    return { credentials, products }
  })
}

export type useLayoutRouteData = typeof routeData

export default function Layout() {
  const data = useRouteData<useLayoutRouteData>()

  return (
    <>
      <Navbar credentials={data()?.credentials} />
      <Outlet />
    </>
  )
}
