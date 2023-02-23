import { format } from 'date-fns'
import { For } from 'solid-js'
import { Title, useRouteData } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { Page } from '~/components/page'
import { ProfanityScoreCard } from '~/components/profanity-score-card'
import { prisma } from '~/lib/prisma'
import { ProfanityMetrics } from '~/types'

export function routeData() {
  return createServerData$(async () => {
    return await prisma.profanityScore.findMany({
      distinct: ['username'],
      orderBy: [{ username: 'asc' }, { createdAt: 'desc' }],
    })
  })
}

export default function Scores() {
  const data = useRouteData<typeof routeData>()

  return (
    <Page>
      <Title>CancelMe - Scores</Title>
      <p class='mb-4 text-2xl'>Scoreboard</p>
      <For each={data()} fallback={<p>Loading scores...</p>}>
        {(score, idx) => {
          return (
            <>
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
            </>
          )
        }}
      </For>
    </Page>
  )
}
