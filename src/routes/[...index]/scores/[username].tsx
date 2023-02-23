import { format } from 'date-fns'
import { createSignal, For, onMount } from 'solid-js'
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
  const [imageUrl, setImageUrl] = createSignal<string | null>(null)

  const generateImage = async () => {
    const baseUrl = `https://cancel-me.s3.amazonaws.com/${params.username}`
    const [dashboardReq, searchReq, uploadReq] = await Promise.all([
      fetch(`${baseUrl}/dashboard.png`),
      fetch(`${baseUrl}/search.png`),
      fetch(`${baseUrl}/upload.png`),
    ])

    if (uploadReq.ok) setImageUrl(`${baseUrl}/upload.png`)
    else if (searchReq.ok) setImageUrl(`${baseUrl}/search.png`)
    else if (dashboardReq.ok) setImageUrl(`${baseUrl}/dashboard.png`)
  }

  onMount(generateImage)

  return (
    <>
      <Meta name='description' content={`${params.username} CancelMe Score`} />
      <Meta name='robots' content='index,follow,max-image-preview:large' />

      {/* validated with Twitter Card Validator: https://cards-dev.twitter.com/validator */}
      {/* testable @ https://dev.cancelme.io/scores/__rmbh */}
      <Meta name='twitter:card' content='summary_large_image' />
      <Meta name='twitter:site' content='@CancelMe' />
      <Meta name='twitter:title' content={`${params.username} Score - CancelMe`} />
      <Meta name='twitter:description' content={`${params.username} CancelMe Score`} />
      <Meta name='twitter:creator' content={params.username} />
      <Meta name='twitter:image' content={`https://cancel-me.s3.amazonaws.com/${params.username}/dashboard.png`} />

      <Meta name='og:url' content={`https://www.cancelme.io/scores/${params.username}`} />
      <Meta name='og:type' content='website' />
      <Meta name='og:title' content={`${params.username} Score - CancelMe`} />
      <Meta name='og:description' content={`${params.username} CancelMe Score`} />
      <Meta name='og:image' content={`https://cancel-me.s3.amazonaws.com/${params.username}/dashboard.png`} />

      <Page>
        <Title>{params.username} Score - Cancel Me</Title>
        <p class='mb-4 text-2xl'>
          Scores for <span class='text-blue-500'>{params.username}</span>
        </p>
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
