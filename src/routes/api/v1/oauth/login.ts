import { APIEvent, json } from 'solid-start/api'
import Twitter from 'twitter-lite'

// Implementation for oauth can be found here:
// https://github.com/draftbit/twitter-lite/blob/00052e6b920e642a401f37b66972fd7b8553fa00/twitter.js#L152

// Library to support V1 of twitter api
// https://github.com/draftbit/twitter-lite

// step 1: login with twitter
export async function GET(event: APIEvent) {
  try {
    const client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
    })

    const resp = await client.getRequestToken(process.env.CALLBACK_URL as string)
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
