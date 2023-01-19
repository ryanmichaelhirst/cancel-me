import { format } from 'date-fns'
import { Icon } from 'solid-heroicons'
import { link, trash } from 'solid-heroicons/outline'
import type { JSX } from 'solid-js'
import { For } from 'solid-js'

export interface Tweet {
  edit_history_tweet_ids: string[]
  id: string
  text: string
  created_at: string
}

const Tweet = (props: { tweet: Tweet; idx: number; onDelete: any }) => (
  <tr id={props.tweet.id} class='mb-4 border-b-2 border-blue-200 pb-2 text-slate-800'>
    <td class='w-10'>{props.idx}</td>
    <td class=''>{props.tweet.text}</td>
    <td class=''>{format(new Date(props.tweet.created_at), 'MMM dd, yyyy, HH:mm aa')}</td>
    <td class='flex space-x-3'>
      <button
        id={props.tweet.id}
        title='Delete'
        onClick={props.onDelete}
        class='text-blue-500 hover:text-blue-800'
      >
        <Icon path={trash} class='h-6 w-6 text-inherit' />
      </button>
      <button
        title='Go to tweet'
        // https://developer.twitter.com/en/blog/community/2020/getting-to-the-canonical-url-for-a-tweet
        onClick={() => window.open(`https://twitter.com/twitter/status/${props.tweet.id}`)}
        class='text-blue-500 hover:text-blue-800'
      >
        <Icon path={link} class='h-6 w-6 text-inherit' />
      </button>
    </td>
  </tr>
)

export const TweetList = (props: { tweets?: Tweet[] }) => {
  const onDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    const id = event.currentTarget.id

    // TODO: implement delete message modal, success / fail
    const resp = await (
      await fetch(`/api/current-user/tweet/${id}`, {
        method: 'DELETE',
      })
    ).json()
  }

  return (
    <section class='mt-10 rounded border border-solid border-blue-200 p-4'>
      <table>
        <thead>
          <tr class='text-left text-slate-800'>
            <th class='w-10'>#</th>
            <th class=''>Tweet</th>
            <th class=''>Date</th>
            <th class='w-12'></th>
          </tr>
        </thead>
        <tbody>
          <For each={props.tweets}>
            {(tweet, idx) => <Tweet tweet={tweet} idx={idx()} onDelete={onDelete} />}
          </For>
        </tbody>
      </table>
    </section>
  )
}
