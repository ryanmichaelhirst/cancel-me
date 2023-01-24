import classNames from 'classnames'
import { createEffect, createSignal, For, JSX, Show } from 'solid-js'
import { useParams } from 'solid-start'
import { LoadingSpinner } from '~/components/loading-spinner'
import { ProgressBar } from '~/components/progress-bar'
import { Tweet } from '~/components/tweet'
import type { Tweet as TweetRecord, UserUsernameTweetsResponse } from '~/types'

export default function User() {
  const params = useParams()
  const [tweets, setTweets] = createSignal<TweetRecord[]>([])
  const [selectedTweetIds, setSelectedTweetIds] = createSignal<string[]>([])
  const [isSelectAll, setIsSelectAll] = createSignal<boolean>()
  const [selectedTab, setSelectedTab] = createSignal<string>('All')
  const [showDeleteModal, setShowDeleteModal] = createSignal<boolean>()
  const [loadingTweets, setLoadingTweets] = createSignal<boolean>()
  const [embedHtml, setEmbedHtml] = createSignal<string[]>([])

  const [progress, setProgress] = createSignal<number>(0)
  const [showProgressModal, setShowProgressModal] = createSignal<boolean>()

  const [error, setError] = createSignal<string>()

  const onCheckbox: JSX.EventHandler<HTMLInputElement, MouseEvent> = async (e) => {
    const checked = e.currentTarget.checked
    const value = e.currentTarget.value

    if (checked) setSelectedTweetIds((prev) => prev.concat([value]))
    else setSelectedTweetIds((prev) => prev.filter((tweetId) => tweetId !== value))
  }

  createEffect(async () => {
    setLoadingTweets(true)
    const data = await (await fetch('/api/current-user/tweets?paginate=false')).json()

    setTweets(data)
    setLoadingTweets(false)
  })

  const onShowAllTweets = async () => {
    setLoadingTweets(true)
    const data = await (await fetch('/api/current-user/tweets?paginate=true')).json()

    setTweets(data)
    setLoadingTweets(false)
  }

  const onSelectAll = () => {
    const currentTweets = filteredTweets()
    if (!currentTweets) return

    if (isSelectAll()) {
      setSelectedTweetIds([])
      setIsSelectAll(false)
    } else {
      setSelectedTweetIds(currentTweets.map((tweet) => tweet.id))
      setIsSelectAll(true)
    }
  }

  // TODO: API limit is 50 requests per 15 mins - implement cloudflare queues to account for this
  const onDeleteSelectedTweets: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    if (selectedTweetIds().length === 0) return

    const previewForFirstTenTweets = selectedTweetIds().slice(0, 10)
    for (const id of previewForFirstTenTweets) {
      const resp = await (await fetch(`/api/oembed/${id}`)).json()
      setEmbedHtml((prev) => prev.concat([resp.html]))
    }

    setShowDeleteModal(true)
  }

  const onDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    const id = event.currentTarget.id

    // TODO: get css from this tool @ https://publish.twitter.com/#
    const resp = await (await fetch(`/api/oembed/${id}`)).json()
    setEmbedHtml([resp.html])

    setSelectedTweetIds([id])
    setShowDeleteModal(true)
  }

  const onConfirmDelete: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async (event) => {
    setShowDeleteModal()
    setShowProgressModal(true)

    const responses = []
    // create an array where each element is an array of 40 tweet ids to delete
    const batches: string[][] = []
    const batchSize = 40

    for (let ii = 0; ii < selectedTweetIds().length; ii += batchSize) {
      const batch = selectedTweetIds().slice(ii, ii + batchSize)
      batches.push(batch)
    }

    // delete 40 tweets every 15 minutes to avoid being rate limited
    for (const ids of batches) {
      if (error()) break

      for (const id of ids) {
        if (error()) break

        const resp = await (
          await fetch(`/api/current-user/tweet/${id}`, {
            method: 'DELETE',
          })
        ).json()

        if (resp.error) {
          setError(
            `There was an error deleting tweet @ https://twitter.com/twitter/status/${id} because of API rate limits. You will not be able to delete tweets for another 15 minutes.`,
          )
        }

        setProgress((prev) => {
          return prev + 1
        })
        responses.push(resp)
      }

      await new Promise((resolve) => setTimeout(() => resolve(null), 1500000))
    }

    if (error()) return

    setTweets((prev) => prev.filter((tweet) => !selectedTweetIds().includes(tweet.id)))
    setSelectedTweetIds([])
  }

  const onCloseProgressModal = () => {
    setShowProgressModal(false)
    setProgress(0)
    setError()
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
          onClick={onShowAllTweets}
          class='rounded border py-1 px-2 text-slate-800 enabled:border-blue-500 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:border-gray-500 disabled:opacity-50'
          title='Show all tweets'
        >
          Show all tweets
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
            <hr class='my-2' />
            <div role='tabpanel'>
              <table>
                <thead>
                  <tr class='text-left text-slate-800'>
                    <th class='w-10'>
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
                    </th>
                    <th class='w-10'>#</th>
                    <th class='min-w-52'>TWEET</th>
                    <th class='w-32'>DATE</th>
                    <th class='w-32'></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
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
            <p class='mb-4'>
              {selectedTweetIds().length === 1
                ? 'Are you sure you want to delete this tweet?'
                : 'Are you sure you want to delete these tweets?'}
            </p>
            <p class='mb-4'>
              If you selected more than 10 tweets only the first 10 ten will show in the list below.
            </p>
            <For each={embedHtml()}>
              {(html) => (
                <div innerHTML={html} class='mb-2 rounded border border-gray-200 p-3 shadow' />
              )}
            </For>
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
      <Show when={showProgressModal()}>
        <div class='modal'>
          <div class='modal-content'>
            <h1 class='mb-6 text-lg font-bold'>Deleting tweets</h1>
            <p class='mb-4'>
              Adding your delete requests to the queue. Due to API restrictions it may take up to 24
              hours to delete each tweet you selected. Please keep this page open until the
              operation is finished.
            </p>
            <ProgressBar
              id='delete-tweet-progress'
              label={`${progress()} / ${selectedTweetIds().length} queued`}
              value={progress()}
              max={selectedTweetIds().length}
            />
            <Show when={error()}>
              <p class='my-4 rounded border p-2 text-red-500 shadow'>{error()}</p>
            </Show>
            <div class='mt-4 flex items-center justify-end'>
              <button
                onClick={onCloseProgressModal}
                class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Show>
    </main>
  )
}
