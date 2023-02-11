import { A } from '@solidjs/router'
import classNames from 'classnames'
import { Icon } from 'solid-heroicons'
import { checkBadge, exclamationCircle, userCircle, xCircle, xMark } from 'solid-heroicons/outline'
import { createSignal, For, JSX, JSXElement, onMount, Show } from 'solid-js'
import { RouteDataArgs, useParams, useRouteData, useSearchParams } from 'solid-start'
import { createServerData$ } from 'solid-start/server'
import { FileUpload } from '~/components/file-upload'
import { LoadingSpinner } from '~/components/loading-spinner'
import { Page } from '~/components/page'
import { ProfanityScoreCard } from '~/components/profanity-score-card'
import { ProgressBar } from '~/components/progress-bar'
import { Tweet } from '~/components/tweet'
import type { ProfanityMetrics, Tweet as TweetRecord } from '~/types'
import { credentials, donations } from '~/util'

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(
    async ([, userId], { request }) => {
      return { credentials: credentials(), donations: await donations({ userId }) }
    },
    { key: () => ['donations', params.id] },
  )
}

const DonationAlert = (props: {
  title: string
  description: JSXElement
  onClick: JSX.EventHandler<HTMLOrSVGElement, MouseEvent>
  class: string
}) => (
  <div class={classNames('w-fit rounded py-2 px-4 text-white shadow ', props.class)}>
    <div class='mb-2 flex items-center justify-between border-b border-b-white'>
      <span class='text-lg'>{props.title}</span>
      <Icon
        path={xMark}
        class='ml-2 h-4 w-4 cursor-pointer text-inherit hover:text-slate-200'
        onClick={props.onClick}
      />
    </div>
    <span class='text-sm'>{props.description}</span>
  </div>
)

export default function User() {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

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

  const [profanityMetrics, setProfanityMetrics] = createSignal<ProfanityMetrics>()

  const [showUploadModal, setShowUploadModal] = createSignal<boolean>()

  const data = useRouteData<typeof routeData>()
  const isPremiumUser = () => {
    if (!data()?.donations) return

    return data()?.donations.length > 0
  }

  const onCheckbox: JSX.EventHandler<HTMLInputElement, MouseEvent> = async (e) => {
    const checked = e.currentTarget.checked
    const value = e.currentTarget.value

    if (checked) setSelectedTweetIds((prev) => prev.concat([value]))
    else setSelectedTweetIds((prev) => prev.filter((tweetId) => tweetId !== value))
  }

  onMount(async () => {
    setLoadingTweets(true)
    // control loading all tweets with ?paginate=(true|false)
    const { tweets, metrics } = await (
      await fetch(`/api/v1/user/${params.id}/tweets?paginate=true`)
    ).json()
    // const resp = await (await fetch(`/api/v1/user/${params.id}/rate_limit_status`)).json()
    console.log(metrics)

    setTweets(tweets)
    setProfanityMetrics(metrics)
    setLoadingTweets(false)
  })

  const onSelectAll = () => {
    const currentTweets = filteredTweets()
    if (!currentTweets) return

    if (isSelectAll()) {
      setSelectedTweetIds([])
      setIsSelectAll(false)
    } else {
      setSelectedTweetIds(currentTweets.map((tweet) => tweet.id_str))
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
    // create an array where each element is an array of 2000 tweet ids to delete
    const batches: string[][] = []
    const batchSize = 2000
    const uniqueSelectedTweetIds = [...new Set(selectedTweetIds())]

    for (let ii = 0; ii < uniqueSelectedTweetIds.length; ii += batchSize) {
      const batch = uniqueSelectedTweetIds.slice(ii, ii + batchSize)
      batches.push(batch)
    }

    // delete tweets in batches
    let counter = 0
    for (const ids of batches) {
      if (error()) break

      for (const id of ids) {
        counter++
        if (error()) break

        const resp = await (
          await fetch(`/api/v1/tweet/${id}`, {
            method: 'DELETE',
          })
        ).json()
        // console.log(resp, counter)

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

      // delay for 15 mins if we are deleting more than 2000 tweets
      if (selectedTweetIds().length >= 2000) {
        await new Promise((resolve) => setTimeout(() => resolve(null), 1500000))
      }

      // old rate limiting implementation
      // delay for 15 mins if we are deleting more than 150 tweets
      // if (selectedTweetIds().length >= 150) {
      //   await new Promise((resolve) => setTimeout(() => resolve(null), 1500000))
      // }
    }

    if (error()) return

    setTweets((prev) => prev.filter((tweet) => !selectedTweetIds().includes(tweet.id_str)))
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

    const formData = new FormData(form)
    const username = formData.get('username')?.toString()
    if (!username) return

    const resp = await (await fetch(`/api/v1/user/${username}/search`)).json()

    setTweets(resp.tweets)
    setProfanityMetrics(resp.metrics)
  }

  const onTabChange: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
    const tab = e.currentTarget.innerText
    setSelectedTab(tab)
  }

  const onUpload = (resp: { tweets: TweetRecord[]; metrics: ProfanityMetrics }) => {
    setTweets(resp.tweets)
    setProfanityMetrics(resp.metrics)
    setShowUploadModal(false)
  }

  const onCloseAlert = () => setSearchParams({ transaction: null })

  const filteredTweets = () => {
    if (selectedTab() === 'All') return tweets()

    return tweets()?.filter((t) => {
      return t.isProfanity
    })
  }

  return (
    <Page>
      {searchParams.transaction && (
        <section>
          {searchParams.transaction === 'completed' && (
            <DonationAlert
              title='Donation completed'
              description='Thank you for donating! You can now use the search and upload features'
              onClick={onCloseAlert}
              class='bg-green-500'
            />
          )}
          {searchParams.transaction === 'canceled' && (
            <DonationAlert
              title='Donation canceled'
              description={
                <>
                  Your donation has been canceled. If this was a mistake you can try again on the{' '}
                  <A href='/donate' class='text-blue-400 hover:text-blue-500'>
                    donate
                  </A>{' '}
                  page
                </>
              }
              onClick={onCloseAlert}
              class='bg-red-500'
            />
          )}
        </section>
      )}
      <section class='mt-4 flex flex-col rounded-lg border p-4 shadow'>
        <div class='mb-2 flex'>
          <Icon path={userCircle} class='mr-2 h-6 w-6' />
          <span>
            {data()?.credentials?.screen_name} ({params.id})
          </span>
        </div>
        {isPremiumUser() ? (
          <div class='flex text-blue-500'>
            <Icon path={checkBadge} class='mr-2 h-6 w-6 text-inherit' />
            <span>Premium member</span>
          </div>
        ) : (
          <div class='flex text-red-500'>
            <Icon path={xCircle} class='mr-2 h-6 w-6 text-inherit' />
            <p>
              To unlock the search and upload feature, make a one time donation{' '}
              <A href='/donate' class='text-blue-400 hover:text-blue-500'>
                here
              </A>
              !
            </p>
          </div>
        )}
      </section>

      <div class='my-4 rounded-lg border border-red-400 p-4 text-red-500 shadow'>
        <div class='mb-4 flex items-center'>
          <Icon path={exclamationCircle} class='h-8 w-8 text-inherit' />
          <p class='ml-2 text-2xl'>README</p>
        </div>

        <p class='mb-2'>
          Due to the nature of Twitter's api, you are only able to delete your most recent 3200
          tweets.
        </p>
        <p class='mb-2'>
          If you would like to delete more tweets, please download a csv of all your tweets{' '}
          <a class='text-blue-500' href='https://twitter.com/settings/download_your_data'>
            here
          </a>{' '}
          and use the "Upload Csv" feature. You must make a one time donation before being able to
          use this feature.
        </p>
        <p>
          You can find more information on this api limitation{' '}
          <a
            class='text-blue-500'
            href='https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline'
          >
            here
          </a>
          .
        </p>
      </div>

      {profanityMetrics() && (
        <section>
          <ProfanityScoreCard
            metrics={profanityMetrics()}
            username={data()?.credentials?.screen_name}
          />
        </section>
      )}

      <section class='flex items-center justify-between rounded-t border border-b-0 border-blue-200 p-4'>
        <button
          onClick={onDeleteSelectedTweets}
          class='rounded border py-1 px-2 text-slate-800 enabled:border-blue-500 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:cursor-not-allowed disabled:border-gray-500 disabled:opacity-50'
          disabled={selectedTweetIds().length === 0}
          title='Delete tweets'
        >
          Delete tweets
        </button>
        {/* make this a paid feature */}
        <button
          onClick={() => setShowUploadModal(true)}
          class='rounded border py-1 px-2 text-slate-800 enabled:border-blue-500 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:border-gray-500 disabled:opacity-50'
          disabled={!isPremiumUser()}
          title='Delete tweets'
        >
          Upload Csv
        </button>

        <form onSubmit={onSubmit} id='username-search-form'>
          <div class='inline-flex rounded'>
            <input
              disabled={!isPremiumUser()}
              type='text'
              id='username-field'
              name='username'
              class='rounded-l border-l border-t border-b py-1 px-3 enabled:border-blue-500 disabled:border-gray-500 disabled:opacity-50'
              placeholder='Enter a username'
              title='Username search'
            />
            <button
              disabled={!isPremiumUser()}
              type='submit'
              title='Search'
              class='w-20 rounded-r py-1 px-2 text-white enabled:bg-blue-500 enabled:hover:bg-blue-600 disabled:bg-gray-500 disabled:opacity-50'
            >
              Search
            </button>
          </div>
        </form>
      </section>

      <section class='rounded-b border border-blue-200 p-4'>
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
                        class='hover:cursor-pointer'
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
                        checked={selectedTweetIds().includes(tweet.id_str)}
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
              operation is finished. We will delete 2000 tweets every 15 minutes.
            </p>
            <ProgressBar
              id='delete-tweet-progress'
              label={`${progress()} / ${
                selectedTweetIds().length === 0 ? progress() : selectedTweetIds().length
              } completed`}
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
      <Show when={showUploadModal()}>
        <div class='modal'>
          <div class='modal-content'>
            <FileUpload onUpload={onUpload} />
          </div>
        </div>
      </Show>
    </Page>
  )
}
