import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'
import { getLowestId, getUserTweets } from '../[id]/tweets'

interface UserShowRequest {
  id: number
  id_str: string
  screen_name: string
  protected: boolean
  profile_image_url_https: string
}

// statuses/user_timeline docs
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
export async function GET({ params, request }: APIEvent) {
  try {
    // get user info
    const userShowResp: UserShowRequest = await twitterLite.client.get('users/show', {
      screen_name: params.username,
    })
    const userId = userShowResp.id_str

    // get most recent 3200 tweets
    let data = await getUserTweets({ userId })
    let maxId: number | null = getLowestId(data)
    console.log({ maxId })

    while (maxId) {
      let resp = await getUserTweets({ userId, maxId })
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
    return new Response('Unable to search user', { status: 401 })
  }
}
