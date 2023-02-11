import { Title, useRouteData } from 'solid-start'
import { HttpStatusCode } from 'solid-start/server'
import { Page } from '~/components/page'
import { useLayoutRouteData } from '~/routes'

export default function NotFound() {
  const data = useRouteData<useLayoutRouteData>()

  return (
    <Page credentials={data()?.credentials}>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
    </Page>
  )
}
