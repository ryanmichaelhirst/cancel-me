import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'

export async function GET({ params, request }: APIEvent) {
  try {
    const credentials = twitterLite.credentials

    return json(credentials)
  } catch (error) {
    return new Response('Unable to get credentials', { status: 401 })
  }
}
