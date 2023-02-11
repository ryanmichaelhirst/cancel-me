import { children } from 'solid-js'

export const Page = (props: { children: any }) => {
  const c = children(() => props.children)

  return <main class='flex min-h-[90vh] flex-col'>{c()}</main>
}
