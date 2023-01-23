import classNames from 'classnames'
import { createEffect, createSignal, For, JSX, Show } from 'solid-js'
import { useParams } from 'solid-start'
import { LoadingSpinner } from '~/components/loading-spinner'
import { Tweet } from '~/components/tweet'
import type { DeleteTweetResponse, Tweet as TweetRecord, UserUsernameTweetsResponse } from '~/types'

export default function User() {
  const params = useParams()
  const [tweets, setTweets] = createSignal<TweetRecord[]>([])
  const [selectedTweetIds, setSelectedTweetIds] = createSignal<string[]>([])
  const [isSelectAll, setIsSelectAll] = createSignal<boolean>()
  const [selectedTab, setSelectedTab] = createSignal<string>('All')
  const [showDeleteModal, setShowDeleteModal] = createSignal<boolean>()
  const [loadingTweets, setLoadingTweets] = createSignal<boolean>()
  const [deleteTweetId, setDeleteTweetId] = createSignal<string>()
  const [embedTweet, setEmbedTweet] = createSignal<string>()

  const onCheckbox: JSX.EventHandler<HTMLInputElement, MouseEvent> = async (e) => {
    const checked = e.currentTarget.checked
    const value = e.currentTarget.value

    if (checked) setSelectedTweetIds((prev) => prev.concat([value]))
    else setSelectedTweetIds((prev) => prev.filter((tweetId) => tweetId !== value))
  }

  createEffect(async () => {
    setLoadingTweets(true)
    const data = await (await fetch('/api/current-user/tweets')).json()

    setTweets(data)
    setLoadingTweets(false)
  })

  const onSelectAll = () => {
    const currentTweets = tweets()
    if (!currentTweets) return

    if (isSelectAll()) {
      setSelectedTweetIds([])
      setIsSelectAll(false)
    } else {
      setSelectedTweetIds(currentTweets.map((tweet) => tweet.id))
      setIsSelectAll(true)
    }
  }

  const onDeleteSelectedTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    if (selectedTweetIds().length === 0) return

    const responses = []

    for (const id of selectedTweetIds()) {
      const resp: DeleteTweetResponse = await (
        await fetch(`/api/current-user/tweet/${id}`, {
          method: 'DELETE',
        })
      ).json()

      responses.push(resp)
    }

    setTweets((prev) => prev.filter((tweet) => !selectedTweetIds().includes(tweet.id)))
  }

  const onDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    const id = event.currentTarget.id

    // TODO: get css from this tool @ https://publish.twitter.com/#
    const twitterHtml = await (await fetch(`/api/oembed/${id}`)).json()
    setEmbedTweet(twitterHtml.html)

    setDeleteTweetId(id)
    setShowDeleteModal(true)
  }

  const onConfirmDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    const resp = await (
      await fetch(`/api/current-user/tweet/${deleteTweetId()}`, {
        method: 'DELETE',
      })
    ).json()

    setTweets((prev) => prev.filter((tweet) => tweet.id !== deleteTweetId()))
    setDeleteTweetId()
    setShowDeleteModal()
  }

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault()

    const form = document.getElementById('username-search-form') as HTMLFormElement | null
    if (!form) return

    const formData = Object.fromEntries(new FormData(form).entries())
    const username = formData['username'] as string
    if (!username) return

    const resp: UserUsernameTweetsResponse = await (
      await fetch(`/api/user/${username}/tweets`)
    ).json()
    setTweets(resp.data ?? [])
  }

  const onTabChange: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    const tab = e.currentTarget.innerText
    setSelectedTab(tab)
  }

  const filteredTweets = () => {
    if (selectedTab() === 'All') return tweets()

    return tweets()?.filter((t) => {
      return t.isProfanity
    })
  }

  return (
    <main>
      <div>User {params.id}</div>
      <section class='flex place-content-evenly items-center'>
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
      </section>
      <section class='mt-10 rounded border border-solid border-blue-200 p-4'>
        {loadingTweets() ? (
          <div class='flex flex-col items-center justify-center'>
            <p>Loading tweets...</p>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div class='mb-2 flex items-center text-2xl'>
              <h1 class='font-bold'>Tweets</h1>
              <span class='pl-2'>({filteredTweets().length})</span>
            </div>
            <div class='flex space-x-5' role='tablist'>
              <div
                role='tab'
                onClick={onTabChange}
                class={classNames(
                  'cursor-pointer text-lg',
                  selectedTab() === 'All' ? 'text-blue-500' : 'text-slate-800',
                )}
              >
                All
              </div>
              <div
                role='tab'
                onClick={onTabChange}
                class={classNames(
                  'cursor-pointer text-lg',
                  selectedTab() === 'Profanities' ? 'text-blue-500' : 'text-slate-800',
                )}
              >
                Profanities
              </div>
            </div>
            <div role='tabpanel'>
              <table>
                <thead>
                  <tr class='text-left text-slate-800'>
                    <th></th>
                    <th class='w-10'>#</th>
                    <th class=''>Tweet</th>
                    <th class=''>Date</th>
                    <th class='w-12'></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type='checkbox'
                        id='select-all'
                        name='select-all'
                        checked={isSelectAll()}
                        onChange={onSelectAll}
                        title='Select all'
                      />
                      <label for='selected' hidden>
                        Select all
                      </label>
                    </td>
                  </tr>
                  <For each={filteredTweets()}>
                    {(tweet, idx) => (
                      <Tweet
                        tweet={tweet}
                        idx={idx()}
                        onDelete={onDelete}
                        checked={selectedTweetIds().includes(tweet.id)}
                        onCheckbox={onCheckbox}
                      />
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <Show when={showDeleteModal()}>
        <div class='modal'>
          <div class='modal-content'>
            <p class='mb-4'>Are you sure you want to delete this tweet?</p>
            <div innerHTML={embedTweet()} />
            <div class='mt-10 flex space-x-5'>
              <button
                onClick={(e) => setShowDeleteModal()}
                class='rounded bg-gray-200 py-1 px-2 text-slate-800 hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDelete}
                class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Show>
    </main>
  )
}
