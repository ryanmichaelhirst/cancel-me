import { useLocation } from '@solidjs/router'
import type { JSX } from 'solid-js'
import { createEffect } from 'solid-js'
import { A } from 'solid-start'

export const Navbar = (props: any) => {
  const location = useLocation()

  createEffect(() => {
    console.log(location.pathname)
  })

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <nav class='mt-6 flex items-center justify-end space-x-4'>
      <A href='/'>Home</A>
      <button onClick={onClick} class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'>
        Login
      </button>
    </nav>
  )
}
