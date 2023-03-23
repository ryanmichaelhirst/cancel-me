import { APIEvent, json } from 'solid-start'
import Twitter from 'twitter-lite'
import { profanityParser } from '~/lib/profanity-parser'
import { getUser } from '~/lib/session'
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
    const user = await getUser(request)
    const client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
      access_token_key: user?.oauth_token,
      access_token_secret: user?.oauth_token_secret,
    })
    const userShowResp: UserShowRequest = await client.get('users/show', {
      screen_name: params.username,
    })
    const userId = userShowResp.id_str

    const { tweets }: { tweets: Tweet[] } = await new Response(request.body).json()
    const metrics = profanityParser.profanityMetrics(tweets)
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
