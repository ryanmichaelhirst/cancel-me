import { children } from 'solid-js'
import { Navbar } from './nav-bar'

export const Page = (props: { children: any; credentials?: any }) => {
  const c = children(() => props.children)

  return (
    <>
      <Navbar credentials={props.credentials} />
      <main class='flex min-h-[90vh] flex-col'>{c()}</main>
    </>
  )
}
