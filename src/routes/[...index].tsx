import { A, Outlet, RouteDataArgs } from 'solid-start'
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
      <footer class='-mx-[40px] flex bg-slate-200 px-[40px] py-5 text-xs text-slate-900 lg:-mx-[120px] lg:px-[120px] xl:-mx-[200px] xl:px-[200px]'>
        <A href='/terms-of-service' class='mr-4'>
          Terms of Service
        </A>
        <A href='/privacy-policy'>Privacy Policy</A>
      </footer>
    </>
  )
}
