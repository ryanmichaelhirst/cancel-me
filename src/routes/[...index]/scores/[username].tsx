import { format } from 'date-fns'
import { For } from 'solid-js'
import { Meta, RouteDataArgs, Title, useParams, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Page } from '~/components/page'
import { ProfanityScoreCard } from '~/components/profanity-score-card'
import { prisma } from '~/lib/prisma'
import { ProfanityMetrics } from '~/types'
import { TWITTER_CARD_NAME } from '~/util/twitter-card-name'

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

  return (
    <>
      <Meta
        name='description'
        content={`View ${params.username} score card for their cancel worthy tweets`}
      />
      <Meta name='robots' content='index,follow,max-image-preview:large,noarchive' />

      {/* validated with Twitter Card Validator: https://cards-dev.twitter.com/validator */}
      {/* testable @ https://dev.cancelme.io/scores/__rmbh */}
      <Meta name='twitter:card' content='summary_large_image' />
      <Meta name='twitter:site' content='@CancelMe' />
      <Meta name='twitter:title' content={`CancelMe - ${params.username} Score`} />
      <Meta
        name='twitter:description'
        content={`View ${params.username} score card for their cancel worthy tweets`}
      />
      <Meta name='twitter:creator' content={params.username} />
      <Meta
        name='twitter:image'
        content={`https://cancel-me.s3.amazonaws.com/${params.username}/${TWITTER_CARD_NAME}`}
      />

      <Meta name='og:url' content={`https://www.cancelme.io/scores/${params.username}`} />
      <Meta name='og:type' content='website' />
      <Meta name='og:title' content={`CancelMe - ${params.username} Score`} />
      <Meta
        name='og:description'
        content={`View ${params.username} score card for their cancel worthy tweets`}
      />
      <Meta
        name='og:image'
        content={`https://cancel-me.s3.amazonaws.com/${params.username}/${TWITTER_CARD_NAME}`}
      />

      <Page>
        <Title>CancelMe - {params.username} Score</Title>
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
