import { APIEvent, json } from 'solid-start'
import Twitter from 'twitter-lite'
import { getUser } from '~/lib/session'

export async function GET({ params, request }: APIEvent) {
  try {
    const user = await getUser(request)
    const client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
      access_token_key: user?.oauth_token,
      access_token_secret: user?.oauth_token_secret,
    })
    const resp = await client.get('application/rate_limit_status')

    return json(resp)
  } catch (error) {
    return new Response('Unable to get rate limit status', { status: 401 })
  }
}
