import { APIEvent, json } from 'solid-start'
import Twitter from 'twitter-lite'
import { getUser } from '~/lib/session'
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

    // get tweets
    const paginate = process.env.NODE_ENV === 'development' ? false : true
    const tweets = await getUserTweetsPaginated({ userId, paginate, client })

    return json({ tweets, username: userShowResp.screen_name })
  } catch (error) {
    return new Response('Unable to search user', { status: 401 })
  }
}
