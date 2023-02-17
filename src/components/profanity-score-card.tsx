import { A } from '@solidjs/router'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import { Icon } from 'solid-heroicons'
import {
  bars_2,
  checkBadge,
  exclamationTriangle,
  faceFrown,
  faceSmile,
  fire,
  handThumbUp,
  questionMarkCircle,
  xCircle,
} from 'solid-heroicons/outline'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { useRouteData } from 'solid-start'
import { useDashboardRouteData } from '~/routes/[...index]/dashboard'
import { ProfanityMetrics } from '~/types'

const ColorBar = (props: { metric: number; total: number; title: string; bgColor: string }) => {
  const [width, setWidth] = createSignal(100)

  const updateWidth = () => {
    setWidth(window.document.getElementById('color-bar-container')?.clientWidth ?? 100)
  }

  const debouncedUpdateWidth = debounce(updateWidth, 100)

  onMount(() => {
    window.addEventListener('resize', debouncedUpdateWidth)
  })

  onCleanup(() => {
    window.removeEventListener('resize', debouncedUpdateWidth)
  })

  createEffect(() => {
    setWidth(window.document.getElementById('color-bar-container')?.clientWidth ?? 100)
  })

  const dynamicWidth = () => `${Math.round((props.metric / props.total) * width())}px`

  return (
    <div
      title={props.title}
      class={classNames('h-4 rounded hover:cursor-pointer', props.bgColor)}
      style={{ width: dynamicWidth() }}
    />
  )
}

const MetricCount = (props: any) => {
  return (
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
}

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

  const numProfanities = () =>
    props.metrics.mild +
    props.metrics.medium +
    props.metrics.strong +
    props.metrics.strongest +
    props.metrics.unrated
  const totalTweets = () =>
    props.metrics.mild +
    props.metrics.medium +
    props.metrics.strong +
    props.metrics.strongest +
    props.metrics.unrated +
    props.metrics.safe

  const score = (() => {
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
  })()

  return (
    <A href={`/scores/${props.username}`}>
      <div class='mb-10 rounded border py-2 px-6 shadow-lg'>
        <div class='flex items-center space-x-3'>
          <p class='text-sm text-slate-500'>{props.username}</p>
          <MembershipStatus isInteractive={props.isInteractive} isPremiumUser={isPremiumUser()} />
        </div>

        <section class='flex flex-col items-center overflow-auto md:flex-row'>
          <p class='mb-2 flex items-center text-2xl text-slate-900 md:mr-4'>{score}</p>
          <div class='mb-2 flex flex-auto flex-col'>
            <div class='flex items-center justify-between'>
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
                bgColor='text-red-500'
              />
              <MetricCount
                title='Strongest'
                icon={fire}
                metric={props.metrics.strongest}
                bgColor='text-slate-900'
              />
              <MetricCount
                title='Safe'
                icon={handThumbUp}
                metric={props.metrics.safe}
                bgColor='text-green-600'
              />
              <MetricCount
                title='Uncategorized'
                icon={questionMarkCircle}
                metric={props.metrics.unrated}
                bgColor='text-slate-500'
              />
              <Icon path={bars_2} class={classNames('h-6 w-6 text-slate-900')} />
              <MetricCount title='Total' metric={totalTweets()} bgColor='text-slate-900' />
            </div>
          </div>
        </section>

        <div class='my-2 flex space-x-1' id='color-bar-container'>
          <ColorBar
            title='Mild tweets'
            metric={props.metrics.mild}
            total={totalTweets()}
            bgColor='bg-yellow-300'
          />
          <ColorBar
            title='Medium tweets'
            metric={props.metrics.medium}
            total={totalTweets()}
            bgColor='bg-orange-500'
          />
          <ColorBar
            title='Strong tweets'
            metric={props.metrics.strong}
            total={totalTweets()}
            bgColor='bg-red-500'
          />
          <ColorBar
            title='Strongest tweets'
            metric={props.metrics.strongest}
            total={totalTweets()}
            bgColor='bg-slate-900'
          />
          <ColorBar
            title='Safe tweets'
            metric={props.metrics.safe}
            total={totalTweets()}
            bgColor='bg-green-600'
          />
          <ColorBar
            title='Uncategorized tweets'
            metric={props.metrics.unrated}
            total={totalTweets()}
            bgColor='bg-slate-300'
          />
        </div>
      </div>
    </A>
  )
}
