// @refresh reload
// import { MetaProvider } from '@solidjs/meta'
import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'
import './tailwind.css'

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script> */}
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
