import { format } from 'date-fns'
import { Icon } from 'solid-heroicons'
import { link, trash } from 'solid-heroicons/outline'
import type { Tweet as TweetRecord } from '~/types'

export const Tweet = (props: {
  tweet: TweetRecord
  idx: number
  onDelete: any
  onCheckbox: any
  checked: boolean
}) => (
  <tr id={props.tweet.id} class='mb-4 border-b-2 border-blue-200 pb-2 text-slate-800'>
    <td>
      <input
        type='checkbox'
        id='selected'
        name='selected'
        checked={props.checked}
        value={props.tweet.id}
        onChange={props.onCheckbox}
      />
      <label for='selected' hidden>
        Selected
      </label>
    </td>
    <td class='w-10'>{props.idx}</td>
    <td class=''>{props.tweet.text}</td>
    <td class=''>
      {props.tweet.created_at
        ? format(new Date(props.tweet.created_at), 'MMM dd, yyyy, HH:mm aa')
        : ''}
    </td>
    <td class='flex space-x-3'>
      <button
        id={props.tweet.id}
        title='Delete tweet'
        onClick={props.onDelete}
        class='text-blue-500 hover:text-blue-800'
      >
        <Icon path={trash} class='h-6 w-6 text-inherit' />
      </button>
      <button
        title='View tweet'
        // https://developer.twitter.com/en/blog/community/2020/getting-to-the-canonical-url-for-a-tweet
        onClick={() => window.open(`https://twitter.com/twitter/status/${props.tweet.id}`)}
        class='text-blue-500 hover:text-blue-800'
      >
        <Icon path={link} class='h-6 w-6 text-inherit' />
      </button>
    </td>
  </tr>
)
