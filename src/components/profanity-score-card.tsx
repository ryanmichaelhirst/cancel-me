import { createElementSize } from '@solid-primitives/resize-observer'
import { A } from '@solidjs/router'
import classNames from 'classnames'
import { Icon } from 'solid-heroicons'
import {
  check,
  checkBadge,
  exclamationTriangle,
  faceFrown,
  faceSmile,
  fire,
  xCircle,
  xMark,
} from 'solid-heroicons/outline'
import { createMemo } from 'solid-js'
import { useRouteData } from 'solid-start'
import { useDashboardRouteData } from '~/routes/[...index]/dashboard'
import { ProfanityMetrics } from '~/types'

const ColorBar = (props: { width: string; title: string; bgColor: string }) => (
  <div
    title={props.title}
    class={classNames('h-4 rounded hover:cursor-pointer', props.bgColor)}
    style={{
      width: props.width,
    }}
  />
)

const MetricCount = (props: any) => (
  <div>
    <p class={classNames('text-center text-sm', props.bgColor)}>{props.title}</p>
    <div class='flex justify-center'>
      {props.icon && (
        <Icon path={props.icon} class={classNames('h-6 w-6 text-inherit', props.bgColor)} />
      )}
      <p class='ml-2 text-sm'>{props.metric}</p>
    </div>
  </div>
)

const MembershipStatus = (props: { isInteractive?: boolean; isPremiumUser?: boolean }) => {
  if (props.isInteractive) return null

  return props.isPremiumUser ? (
    <div class='flex items-center text-sm text-blue-500' title='Donated - premium member'>
      <Icon path={checkBadge} class='mr-2 h-6 w-6 text-inherit hover:cursor-pointer' />
    </div>
  ) : (
    <div class='flex text-red-500' title='Not donated - free member'>
      <Icon path={xCircle} class='mr-2 h-6 w-6 text-inherit hover:cursor-pointer' />
      <p>
        To unlock the search and upload feature, make a one time donation{' '}
        <A href='/donate' class='text-blue-400 hover:text-blue-500'>
          here
        </A>
        !
      </p>
    </div>
  )
}

export const ProfanityScoreCard = (props: {
  metrics: ProfanityMetrics
  username?: string
  isInteractive?: boolean
}) => {
  const data = useRouteData<useDashboardRouteData>()
  const isPremiumUser = () => {
    if (!data()?.donations || typeof data()?.donations === 'undefined') return

    // @ts-expect-error data().donations marked as possibly undefined?
    return data()?.donations.length > 0
  }

  const numProfanities = createMemo(() => {
    return (
      props.metrics.mild + props.metrics.medium + props.metrics.strong + props.metrics.strongest
    )
  })

  const cancelMeTitle = () => {
    if (numProfanities() === 0) return 'Devout Mormon'
    if (numProfanities() <= 25) return 'Is trying to get closer to God'
    if (numProfanities() <= 50) return 'Only swears when mom is not around'
    if (numProfanities() <= 75) return 'Is still in college'
    if (numProfanities() <= 100) return "You wouldn't want your parents to meet them"
    if (numProfanities() <= 125) return "Enjoys taking the Lord's name in vain"
    if (numProfanities() <= 150) return 'Has poor vocabulary'
    if (numProfanities() <= 175) return 'A linguistic machine gun'
    if (numProfanities() <= 200) return 'Is a verbal hand grenade'
    if (numProfanities() <= 225) return 'A walking censor beep'
    if (numProfanities() <= 250) return 'Profanity virtuoso'
    if (numProfanities() <= 275) return 'Cussing champion'
    if (numProfanities() <= 300) return 'Swearing savant'
    if (numProfanities() <= 325) return 'Slang sorcerer'
    if (numProfanities() <= 350) return 'F-bomb fanatic'
    if (numProfanities() <= 375) return 'Curse connoisseur'

    return 'Obscenity oracle'
  }

  let ref: HTMLDivElement | null
  const es = createElementSize(() => ref)

  return (
    <A href={`/scores/${props.username}`}>
      <div
        class='mb-10 rounded border bg-white px-6 pt-2 pb-[40px] shadow-lg'
        id='profanity-score-card'
      >
        <div class='flex items-center space-x-3'>
          <p class='text-sm text-slate-500'>{props.username}</p>
          <MembershipStatus isInteractive={props.isInteractive} isPremiumUser={isPremiumUser()} />
        </div>

        <section class='my-2 flex'>
          <p class='mr-4 text-2xl text-slate-900'>{cancelMeTitle()}</p>
          <div class='mr-4 flex items-center text-green-600'>
            <Icon path={check} class='h-5 w-5 text-inherit hover:cursor-pointer' />
            <p class='ml-2 text-xs'>{props.metrics.safe} safe tweets</p>
          </div>
          <div class='flex items-center text-red-600'>
            <Icon path={xMark} class='h-5 w-5 text-inherit hover:cursor-pointer' />
            <p class='ml-2 text-xs'>{numProfanities()} nsfw tweets</p>
          </div>
        </section>

        <section class='mb-2 flex flex-col items-center overflow-auto md:flex-row'>
          <div class='flex w-full flex-wrap items-center justify-between md:flex-nowrap'>
            <MetricCount
              title='Mild'
              icon={faceSmile}
              metric={props.metrics.mild}
              bgColor='text-yellow-300'
            />
            <MetricCount
              title='Medium'
              icon={faceFrown}
              metric={props.metrics.medium}
              bgColor='text-orange-500'
            />
            <MetricCount
              title='Strong'
              icon={exclamationTriangle}
              metric={props.metrics.strong}
              bgColor='text-red-400'
            />
            <MetricCount
              title='Strongest'
              icon={fire}
              metric={props.metrics.strongest}
              bgColor='text-slate-900'
            />
          </div>
        </section>
        <div class='flex space-x-1' ref={(e) => (ref = e)}>
          <ColorBar
            title={`${props.metrics.mild} Mild tweets`}
            width={`${Math.round((props.metrics.mild / numProfanities()) * (es.width ?? 0))}px`}
            bgColor='bg-yellow-300'
          />
          <ColorBar
            title={`${props.metrics.medium} Medium tweets`}
            width={`${Math.round((props.metrics.medium / numProfanities()) * (es.width ?? 0))}px`}
            bgColor='bg-orange-500'
          />
          <ColorBar
            title={`${props.metrics.strong} Strong tweets`}
            width={`${Math.round((props.metrics.strong / numProfanities()) * (es.width ?? 0))}px`}
            bgColor='bg-red-500'
          />
          <ColorBar
            title={`${props.metrics.strongest} Strongest tweets`}
            width={`${Math.round(
              (props.metrics.strongest / numProfanities()) * (es.width ?? 0),
            )}px`}
            bgColor='bg-slate-900'
          />
        </div>
      </div>
    </A>
  )
}
