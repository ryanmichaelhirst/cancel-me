import type { JSX } from 'solid-js'
import { createSignal } from 'solid-js'
import { useParams } from 'solid-start'
import { TweetList } from '~/components/TweetList'
import { solidClient } from '~/lib/solid-client'
import type { Tweet } from '~/types'

export default function User() {
  const params = useParams()
  const [tweets, setTweets] = createSignal<Tweet[]>()
  const [selectedTweetIds, setSelectedTweetIds] = createSignal<string[]>([])

  const onCheckbox: JSX.EventHandler<HTMLInputElement, MouseEvent> = async (e) => {
    const checked = e.currentTarget.checked
    const value = e.currentTarget.value

    if (checked) setSelectedTweetIds((prev) => prev.concat([value]))
    else setSelectedTweetIds((prev) => prev.filter((tweetId) => tweetId !== value))
  }

  const onGetMyTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await solidClient.getMyTweets()

    setTweets(resp.data)
  }

  const onDeleteSelectedTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    if (selectedTweetIds().length === 0) return

    await solidClient.deleteTweets(selectedTweetIds())
  }

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault()

    const form = document.getElementById('username-search-form') as HTMLFormElement | null
    if (!form) return

    const formData = Object.fromEntries(new FormData(form).entries())
    const username = formData['username'] as string
    if (!username) return

    const result = await solidClient.searchTweetsByUsername(username)
    setTweets(result.data ?? [])
  }

  return (
    <div>
      <div>User {params.id}</div>
      <div class='flex place-content-evenly items-center'>
        <button
          onClick={onGetMyTweets}
          class='rounded border border-blue-500 py-1 px-2 text-slate-800 hover:bg-blue-500 hover:text-white'
          title='Get my tweets'
        >
          Get my tweets
        </button>
        <button
          onClick={onDeleteSelectedTweets}
          class='rounded border py-1 px-2 text-slate-800 enabled:border-blue-500 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:border-gray-500 disabled:opacity-50'
          disabled={selectedTweetIds().length === 0}
          title='Delete tweets'
        >
          Delete tweets
        </button>
        <form onSubmit={onSubmit} id='username-search-form'>
          <div class='inline-flex rounded'>
            <input
              // make this a paid feature ($5)
              disabled={true}
              type='text'
              id='username-field'
              name='username'
              class='rounded-l border-l border-t border-b py-1 px-3 enabled:border-blue-500 disabled:border-gray-500 disabled:opacity-50'
              placeholder='Search a username'
              title='Search a username'
            />
            <button
              disabled={true}
              type='submit'
              title='Search'
              class='w-20 rounded-r py-1 px-2 text-white enabled:bg-blue-500 enabled:hover:bg-blue-600 disabled:bg-gray-500 disabled:opacity-50'
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div>
        {tweets() ? (
          <TweetList
            tweets={tweets()}
            selectedTweetIds={selectedTweetIds()}
            onCheckbox={onCheckbox}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
