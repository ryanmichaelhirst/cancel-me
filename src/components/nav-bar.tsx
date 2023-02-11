import { useLocation, useRouteData } from '@solidjs/router'
import classNames from 'classnames'
import { createEffect, createSignal, JSX } from 'solid-js'
import { A, refetchRouteData, useNavigate } from 'solid-start'
import { useLayoutRouteData } from '~/routes/[...index]'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [path, setPath] = createSignal<string>()
  const data = useRouteData<useLayoutRouteData>()

  createEffect(async () => {
    setPath(location.pathname)
  })

  const onLogout: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/logout`)).json()

    refetchRouteData()
    navigate('/')
  }

  const onLogin: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <nav class='flex min-h-[10vh] items-center justify-end space-x-4'>
      <A href='/' class={classNames('hover:text-blue-700', path() === '/' && 'text-blue-500')}>
        Home
      </A>
      <A
        href='/donate'
        class={classNames('hover:text-blue-700', path() === '/donate' && 'text-blue-500')}
      >
        Donate
      </A>
      {data()?.credentials && (
        <A
          href={`/user/${data()?.credentials?.id_str}`}
          class={classNames(
            'hover:text-blue-700',
            path() === `/user/${data()?.credentials?.id_str}` && 'text-blue-500',
          )}
        >
          Dashboard
        </A>
      )}
      {data()?.credentials?.id_str ? (
        <button
          onClick={onLogout}
          class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
        >
          Logout
        </button>
      ) : (
        <button
          onClick={onLogin}
          class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
        >
          Login
        </button>
      )}
    </nav>
  )
}
