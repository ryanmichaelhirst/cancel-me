import type { JSX } from 'solid-js'
import { createSignal } from 'solid-js'
import { useParams } from 'solid-start'
import { TweetList } from '~/components/TweetList'
import type { Tweet, UserUsernameTweetsResponse } from '~/types'

export default function User() {
  const params = useParams()
  const [tweets, setTweets] = createSignal<Tweet[]>()

  const onGetMyTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch('/api/current-user/tweets')).json()
    console.log(resp)

    setTweets(resp.data)
  }

  const searchUserTweets = async (username: string) => {
    const resp = await (await fetch(`/api/user/${username}/tweets`)).json()

    return resp as UserUsernameTweetsResponse
  }

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault()

    const form = document.getElementById('username-search-form') as HTMLFormElement | null
    if (!form) return

    const formData = Object.fromEntries(new FormData(form).entries())
    const username = formData['username'] as string
    if (!username) return

    const result = await searchUserTweets(username)
    setTweets(result.data ?? [])
  }

  return (
    <div>
      <div>User {params.id}</div>
      <div class='flex place-content-evenly items-center'>
        <button
          onClick={onGetMyTweets}
          class='rounded border border-blue-500 py-1 px-2 text-slate-800 hover:bg-blue-500 hover:text-white'
        >
          Get my tweets
        </button>
        <form onSubmit={onSubmit} id='username-search-form'>
          <div class='inline-flex rounded border border-solid border-blue-500'>
            <input
              // make this a paid feature ($5)
              disabled={true}
              type='text'
              id='username-field'
              name='username'
              class='rounded py-1 px-3'
              placeholder='Search a username'
            />
            <button
              disabled={true}
              type='submit'
              class='w-20 bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div>{tweets() ? <TweetList tweets={tweets()} /> : <div></div>}</div>
    </div>
  )
}
