import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'

export async function GET({ params, request }: APIEvent) {
  try {
    const resp = await twitterLite.client.get('application/rate_limit_status')

    return json(resp)
  } catch (error) {
    return new Response('Unable to get rate limit status', { status: 401 })
  }
}
