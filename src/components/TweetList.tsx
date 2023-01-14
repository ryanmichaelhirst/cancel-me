import { For } from 'solid-js'

export interface Tweet {
  edit_history_tweet_ids: string[]
  id: string
  text: string
}

const Tweet = (props: { tweet: Tweet; idx: number }) => (
  <div id={props.tweet.id} class='mb-4 border-b-2 border-blue-200 pb-2'>
    <div class='flex items-center'>
      <p class='mr-4 font-bold text-slate-800'>{props.idx}</p>
      <p class='text-lg text-slate-800'>{props.tweet.text}</p>
    </div>
  </div>
)

export const TweetList = (props: { tweets?: Tweet[] }) => {
  return (
    <div class='mt-10 rounded border border-solid border-blue-200 p-4'>
      <For each={props.tweets}>{(tweet, idx) => <Tweet tweet={tweet} idx={idx()} />}</For>
    </div>
  )
}
