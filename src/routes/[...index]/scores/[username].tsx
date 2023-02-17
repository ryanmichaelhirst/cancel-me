import { For } from 'solid-js'
import { RouteDataArgs, Title, useParams, useRouteData } from 'solid-start'
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

  return (
    <Page>
      <Title>{params.username} Score - Cancel Me</Title>
      <p class='mb-4 text-2xl'>
        Scores for <span class='text-blue-500'>{params.username}</span>
      </p>
      <For each={data()}>
        {(score, idx) => (
          <>
            {score.createdAt instanceof Date && (
              <p class='mb-2 text-lg text-slate-500'>
                Created at: {score.createdAt.toDateString()}
              </p>
            )}
            {typeof score.createdAt === 'string' && (
              <p class='mb-2 text-lg text-slate-500'>
                Created at: {new Date(score.createdAt).toDateString()}
              </p>
            )}
            <ProfanityScoreCard
              metrics={score.payload as unknown as ProfanityMetrics}
              username={score.username}
              isInteractive={true}
            />
          </>
        )}
      </For>
    </Page>
  )
}
