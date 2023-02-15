import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'
import { getUserTweetsPaginated } from '../[id]/tweets'

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
    const paginate = process.env.NODE_ENV === 'development' ? false : true
    const tweets = await getUserTweetsPaginated({ userId, paginate })
    const metrics = twitterLite.profanityMetrics(tweets)

    return json({ tweets, metrics, username: userShowResp.screen_name })
  } catch (error) {
    return new Response('Unable to search user', { status: 401 })
  }
}
