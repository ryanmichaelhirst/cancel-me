import pick from 'lodash.pick'
import querystring from 'querystring'
import { APIEvent, json } from 'solid-start'
import url from 'url'
import { twitterLite } from '~/lib/twitter-lite'
import { Tweet } from '~/types'

export const getLowestId = (tweets: Tweet[]) => {
  const ids = tweets.map((t) => t.id)

  return Math.min.apply(Math, ids)
}

export const getUserTweets = async ({ userId, maxId }: { userId: string; maxId?: number }) => {
  const tweets: Tweet[] = await twitterLite.client.get('statuses/user_timeline', {
    include_rts: 'true',
    exclude_replies: 'false',
    trim_user: 'true',
    user_id: userId,
    count: 200,
    // conditionally paginate
    ...(maxId && { max_id: maxId }),
  })

  // determine which tweets contains a profanity
  return tweets.map((tweet) => {
    const profanity = twitterLite.profanity(tweet.text)

    return {
      ...pick(tweet, ['text', 'created_at', 'id', 'id_str']),
      profanity,
    }
  })
}

export const getUserTweetsPaginated = async ({
  userId,
  maxId,
  paginate,
  data = [],
}: {
  userId: string
  maxId?: number
  paginate?: boolean
  data?: any[]
}): Promise<any[]> => {
  let tweets = await getUserTweets({ userId, maxId })
  if (!paginate) return tweets

  const newMaxId: number | null = getLowestId(tweets)

  tweets = data.concat(tweets)

  // fixes this vercel function error
  // [ERROR] [1676162159910] LAMBDA_RUNTIME Failed to post handler success response. Http response code: 413.
  // get most recent 3200 tweets
  if (tweets.length >= 2000 || newMaxId.toString() === 'Infinity' || newMaxId === maxId) {
    return tweets
  }

  return await getUserTweetsPaginated({
    userId,
    maxId: newMaxId,
    paginate: true,
    data: tweets,
  })
}

// statuses/user_timeline docs
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
export async function GET({ params, request }: APIEvent) {
  try {
    const parsedUrl = url.parse(request.url)
    const query = parsedUrl.query
    const { paginate, username } = query
      ? querystring.parse(query)
      : { paginate: false, username: '' }
    const userId = params.id
    const paginateParam = !paginate || paginate === 'false' ? false : true

    // if we aren't paginating, return the first 200 tweets
    let fetchFunc =
      !query || !paginate || paginate === 'false' || process.env.NODE_ENV === 'development'
        ? getUserTweets
        : getUserTweetsPaginated

    const tweets = await fetchFunc({ userId, paginate: paginateParam })

    return json({ tweets })
  } catch (err) {
    return new Response('Unable to get tweets', { status: 401 })
  }
}
