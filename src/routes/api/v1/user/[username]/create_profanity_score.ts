import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'
import { Tweet } from '~/types'
import { createProfanityScore } from '~/util'

interface UserShowRequest {
  id: number
  id_str: string
  screen_name: string
  protected: boolean
  profile_image_url_https: string
}

// statuses/user_timeline docs
// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
export async function POST({ params, request }: APIEvent) {
  try {
    // get user info
    const userShowResp: UserShowRequest = await twitterLite.client.get('users/show', {
      screen_name: params.username,
    })
    const userId = userShowResp.id_str

    const { tweets }: { tweets: Tweet[] } = await new Response(request.body).json()
    const metrics = twitterLite.profanityMetrics(tweets)
    await createProfanityScore({
      userId,
      username: params.username,
      metrics,
    })

    return json({ metrics })
  } catch (error) {
    return new Response('Unable to search user', { status: 401 })
  }
}
