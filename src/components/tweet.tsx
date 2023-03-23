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
  <tr id={props.tweet.id_str} class='mb-4 border-b border-gray-200 pb-2 text-slate-800'>
    <td class='w-10'>
      <input
        type='checkbox'
        id='selected'
        name='selected'
        checked={props.checked}
        value={props.tweet.id_str}
        onChange={props.onCheckbox}
      />
      <label for='selected' hidden>
        Selected
      </label>
    </td>
    <td class='w-10'>{props.idx}</td>
    <td class='min-w-52 max-w-[75%] truncate'>{props.tweet.text}</td>
    <td class='w-32 break-words'>
      {props.tweet.created_at
        ? format(new Date(props.tweet.created_at), 'MMM dd, yyyy, HH:mm aa')
        : ''}
    </td>
    <td>
      <div class='flex'>
        <button
          id={props.tweet.id_str}
          title='Delete tweet'
          onClick={props.onDelete}
          class='mr-2 text-blue-500 hover:text-blue-800'
        >
          <Icon path={trash} class='h-6 w-6 text-inherit' />
        </button>
        <button
          title='View tweet'
          // https://developer.twitter.com/en/blog/community/2020/getting-to-the-canonical-url-for-a-tweet
          onClick={() => window.open(`https://twitter.com/twitter/status/${props.tweet.id_str}`)}
          class='text-blue-500 hover:text-blue-800'
        >
          <Icon path={link} class='h-6 w-6 text-inherit' />
        </button>
      </div>
    </td>
  </tr>
)
