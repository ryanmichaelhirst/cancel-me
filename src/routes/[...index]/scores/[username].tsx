import { MetaContext } from '@solidjs/meta'
import { format } from 'date-fns'
import { toPng } from 'html-to-image'
import { createSignal, For, onMount, useContext } from 'solid-js'
import { Meta, RouteDataArgs, Title, useParams, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Page } from '~/components/page'
import { ProfanityScoreCard } from '~/components/profanity-score-card'
import { prisma } from '~/lib/prisma'
import { ProfanityMetrics } from '~/types'

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ([, username]) => {
      return await prisma.profanityScore.findMany({
        where: {
          username,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    },
    { key: () => ['username', params.username] },
  )
}

export default function Users() {
  const params = useParams()
  const data = useRouteData<typeof routeData>()
  const [imageDataUrl, setImageDataUrl] = createSignal<string | null>(null)
  const context = useContext(MetaContext)

  const generateImage = async () => {
    const element = document.getElementById(`${params.username}-0`)
    if (!element) return

    const dataUrl = await toPng(element)
    setImageDataUrl(dataUrl)

    if (context) {
      context.addClientTag({
        tag: 'meta',
        props: {
          name: 'twitter:image',
          content: dataUrl,
        },
        id: 'twitter:image',
      })

      context.addClientTag({
        tag: 'meta',
        props: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        id: 'twitter:card',
      })
      context.addClientTag({
        tag: 'meta',
        props: {
          name: 'twitter:description',
          content: `${params.username} Cancel Me Score`,
        },
        id: 'twitter:description',
      })
    }
  }

  onMount(generateImage)

  // // update the meta tag when the imageDataUrl signal is updated
  // setImageDataUrl.subscribe((dataUrl) => {
  //   if (dataUrl) {
  //     setTag('twitter:image', { content: dataUrl })
  //   }
  // })

  return (
    <>
      <Meta name='description' content={`${params.username} Cancel Me Score`} />

      {/* validated with Twitter Card Validator: https://cards-dev.twitter.com/validator */}
      {/* testable @ https://dev.cancelme.io/scores/__rmbh */}
      <Meta name='twitter:card' content='summary_large_image' />
      <Meta name='twitter:title' content={`${params.username} Score - Cancel Me`} />
      <Meta name='twitter:description' content={`${params.username} Cancel Me Score`} />
      <Meta name='twitter:image' content={imageDataUrl() ?? ''} />

      <Page>
        <Title>{params.username} Score - Cancel Me</Title>
        <p class='mb-4 text-2xl'>
          Scores for <span class='text-blue-500'>{params.username}</span>
        </p>
        {typeof imageDataUrl() === 'string' && (
          <img
            // src={window.URL.createObjectURL(new Blob([imageDataUrl()], { type: 'image/png' }))}
            hidden={true}
            // @ts-expect-error the type guard doesn't narrow the solidjs type here?
            src={imageDataUrl()}
          />
        )}
        <For each={data()}>
          {(score, idx) => (
            <div id={`${params.username}-${idx()}`}>
              {score.createdAt instanceof Date && (
                <p class='mb-2 text-lg text-slate-500'>
                  Created at: {format(score.createdAt, 'MMM dd, yyyy, hh:mm:ss aa')}
                </p>
              )}
              {typeof score.createdAt === 'string' && (
                <p class='mb-2 text-lg text-slate-500'>
                  Created at: {format(new Date(score.createdAt), 'MMM dd, yyyy, hh:mm:ss aa')}
                </p>
              )}
              <ProfanityScoreCard
                metrics={score.payload as unknown as ProfanityMetrics}
                username={score.username}
                isInteractive={true}
              />
            </div>
          )}
        </For>
      </Page>
    </>
  )
}
