import { APIEvent, json } from 'solid-start/api'
import { twitterLite } from '~/lib/twitter-lite'

// step 1: login with twitter
export async function GET(event: APIEvent) {
  try {
    twitterLite.setCredentials()

    return json({ success: true })
  } catch (error) {
    return json({ error })
  }
}
