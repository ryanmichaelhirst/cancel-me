import classNames from 'classnames'
import { Icon } from 'solid-heroicons'
import {
  exclamationTriangle,
  faceFrown,
  faceSmile,
  fire,
  handThumbUp,
  questionMarkCircle,
} from 'solid-heroicons/outline'

const ColorBar = (props: { metric: number; title: string; bgColor: string }) => {
  return (
    <div
      title={props.title}
      class={classNames('mr-2 h-6 rounded', props.bgColor)}
      style={{ width: `${props.metric}px` }}
    />
  )
}

const MetricCount = (props: any) => {
  return (
    <div>
      <p class={classNames('text-lg', props.bgColor)}>{props.title}</p>
      <div class='flex'>
        <Icon path={props.icon} class={classNames('h-6 w-6 text-inherit', props.bgColor)} />
        <p class='ml-2'>{props.metric}</p>
      </div>
    </div>
  )
}

export const ProfanityScoreCard = (props: any) => {
  const numProfanities = () =>
    props.metrics.mild + props.metrics.medium + props.metrics.strong + props.metrics.strongest
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
      <p class='text-lg text-slate-500'>{props.username}</p>
      <p class='text-xl text-slate-800'>{numProfanities()} profane tweets</p>
      <p class='text-2xl text-slate-900'>{score}</p>
      <div class='mt-4 flex'>
        <ColorBar title='Mild tweets' metric={props.metrics.mild} bgColor='bg-yellow-300' />
        <ColorBar title='Medium tweets' metric={props.metrics.medium} bgColor='bg-orange-500' />
        <ColorBar title='Strong tweets' metric={props.metrics.strong} bgColor='bg-red-500' />
        <ColorBar
          title='Strongest tweets'
          metric={props.metrics.strongest}
          bgColor='bg-slate-900'
        />
      </div>
      <div class='mt-2 mb-4 flex'>
        <ColorBar title='Safe tweets' metric={props.metrics.safe} bgColor='bg-green-600' />
        <ColorBar title='Unrated tweets' metric={props.metrics.unrated} bgColor='bg-slate-300' />
      </div>
      <div class='flex items-center justify-evenly'>
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
      </div>
    </div>
  )
}
