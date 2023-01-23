import { APIEvent, json } from 'solid-start/api'
import { twitterUserClient } from '~/lib/twitter-user-client'

export async function GET(event: APIEvent) {
  try {
    const userId = twitterUserClient.getUserId()
    if (!userId) return json({ error: 'No user id for current user' })

    // enable or disable pagination
    const resp = await twitterUserClient.tweets(false)

    return json(resp.data)
  } catch (error) {
    console.log(error)

    return json({ currentErrorTweetsError: error })
  }
}
