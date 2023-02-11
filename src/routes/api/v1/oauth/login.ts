import { APIEvent, json } from 'solid-start/api'
import { twitterLite } from '~/lib/twitter-lite'

// step 1: login with twitter
export async function GET(event: APIEvent) {
  try {
    const resp = await twitterLite.client?.getRequestToken(process.env.CALLBACK_URL as string)
    if (!resp) return new Response('Error authorizing request', { status: 401 })

    const authUrl =
      'oauth_token' in resp
        ? `https://api.twitter.com/oauth/authenticate?oauth_token=${resp?.oauth_token}`
        : ''

    return json({ authUrl })
  } catch (error) {
    return json({ error })
  }
}
