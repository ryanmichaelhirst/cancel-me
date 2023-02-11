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
    const isProfanity = twitterLite.isContainProfanity(tweet.text)

    return {
      ...tweet,
      isProfanity,
    }
  })
}

// statuses/user_timeline docs
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
export async function GET({ params, request }: APIEvent) {
  try {
    let data = await getUserTweets({ userId: params.userId })

    const parsedUrl = url.parse(request.url)
    const query = parsedUrl.query
    if (!query) return json(data)

    const { paginate } = querystring.parse(query)
    if (!paginate) return json(data)

    let maxId: number | null = getLowestId(data)
    console.log({ paginate, maxId })

    while (maxId) {
      let resp = await getUserTweets({ userId: params.userId, maxId })
      console.log(`getting data for ${maxId}`)
      data = data.concat(resp)
      const newMaxId = getLowestId(resp)
      console.log(`newMaxId: ${newMaxId} - maxId: ${maxId}`)

      if (newMaxId.toString() === 'Infinity') {
        console.log('newMaxId is Infinity')
        maxId = null
      } else if (newMaxId === maxId) {
        maxId = null
      } else {
        maxId = newMaxId
      }
    }

    const metrics = twitterLite.profanityMetrics(data)

    return json({ tweets: data, metrics })
  } catch (error) {
    return new Response('Unable to get tweets', { status: 401 })
  }
}
