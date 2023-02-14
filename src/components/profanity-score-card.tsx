import { A } from '@solidjs/router'
import classNames from 'classnames'
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
import { useRouteData } from 'solid-start'
import { useDashboardRouteData } from '~/routes/[...index]/dashboard'

const ColorBar = (props: { metric: number; total: number; title: string; bgColor: string }) => {
  const width = window.document.getElementById('color-bar-container')?.clientWidth ?? 100

  return (
    <div
      title={props.title}
      class={classNames('h-4 rounded', props.bgColor)}
      style={{ width: `${Math.round((props.metric / props.total) * width)}px` }}
    />
  )
}

const MetricCount = (props: any) => {
  return (
    <div>
      <p class={classNames('text-center text-sm', props.bgColor)}>{props.title}</p>
      <div class='flex'>
        {props.icon && (
          <Icon path={props.icon} class={classNames('h-6 w-6 text-inherit', props.bgColor)} />
        )}
        <p class='ml-2 text-sm'>{props.metric}</p>
      </div>
    </div>
  )
}

export const ProfanityScoreCard = (props: any) => {
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
  const score = (() => {
    if (numProfanities() <= 10) return 'Devout Mormon'
    if (numProfanities() <= 50) return 'Knows a few bad words'
    if (numProfanities() <= 100) return 'Is still in college'
    if (numProfanities() <= 200) return "Enjoys taking the Lord's name in vain"
    if (numProfanities() <= 300) return 'Has poor vocabulary'

    return 'Potty Mouth'
  })()

  return (
    <div class='mb-10 rounded border py-2 px-6 shadow-lg'>
      <div class='flex items-center space-x-3'>
        <p class='text-sm text-slate-500'>{props.username}</p>
        {isPremiumUser() ? (
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
        )}
      </div>

      <section class='flex items-center space-x-5'>
        <p class='flex items-center text-2xl text-slate-900'>{score}</p>
        <div class='flex flex-auto flex-col'>
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
              title='Unrated'
              icon={questionMarkCircle}
              metric={props.metrics.unrated}
              bgColor='text-slate-500'
            />
            <Icon path={bars_2} class={classNames('h-6 w-6 text-slate-900')} />
            <MetricCount title='Total' metric={numProfanities()} bgColor='text-slate-900' />
          </div>
        </div>
      </section>

      <div class='my-2 flex space-x-1' id='color-bar-container'>
        <ColorBar
          title='Mild tweets'
          metric={props.metrics.mild}
          total={numProfanities()}
          bgColor='bg-yellow-300'
        />
        <ColorBar
          title='Medium tweets'
          metric={props.metrics.medium}
          total={numProfanities()}
          bgColor='bg-orange-500'
        />
        <ColorBar
          title='Strong tweets'
          metric={props.metrics.strong}
          total={numProfanities()}
          bgColor='bg-red-500'
        />
        <ColorBar
          title='Strongest tweets'
          metric={props.metrics.strongest}
          total={numProfanities()}
          bgColor='bg-slate-900'
        />
        <ColorBar
          title='Safe tweets'
          metric={props.metrics.safe}
          total={numProfanities()}
          bgColor='bg-green-600'
        />
        <ColorBar
          title='Unrated tweets'
          metric={props.metrics.unrated}
          total={numProfanities()}
          bgColor='bg-slate-300'
        />
      </div>
    </div>
  )
}
