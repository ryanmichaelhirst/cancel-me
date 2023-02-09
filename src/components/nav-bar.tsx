import { useLocation } from '@solidjs/router'
import classNames from 'classnames'
import { createEffect, createSignal, JSX } from 'solid-js'
import { A } from 'solid-start'

export const Navbar = (props: any) => {
  const location = useLocation()
  const [path, setPath] = createSignal<string>()
  const [credentials, setCredentials] = createSignal<any>()

  createEffect(async () => {
    setPath(location.pathname)

    try {
      // TODO: replace this with solidjs session
      // https://start.solidjs.com/advanced/session
      const creds = await (await fetch('/api/v1/user/credentials')).json()
      console.log(creds)
      setCredentials(creds)
    } catch (err) {
      if (credentials()) setCredentials()
    }
  })

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <nav class='mt-6 flex items-center justify-end space-x-4'>
      <A href='/' class={classNames(path() === '/' && 'text-blue-500')}>
        Home
      </A>
      <A href='/donate' class={classNames(path() === '/donate' && 'text-blue-500')}>
        Donate
      </A>
      {credentials() && (
        <A
          href={`/user/${credentials().id_str}`}
          class={classNames(path() === '/donate' && 'text-blue-500')}
        >
          Profile
        </A>
      )}
      {credentials() ? (
        <button
          onClick={onClick}
          class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
        >
          Logout
        </button>
      ) : (
        <button
          onClick={onClick}
          class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
        >
          Login
        </button>
      )}
    </nav>
  )
}
