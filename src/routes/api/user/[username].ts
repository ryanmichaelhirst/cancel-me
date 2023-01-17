import { APIEvent, json } from 'solid-start/api'
import { twitterClient } from '~/lib/twitter-client'

export async function GET({ params }: APIEvent) {
  const { username } = params

  try {
    const user = await twitterClient.users.findUserByUsername(username)

    return json({ user })
  } catch (error) {
    return json({ user: undefined, error })
  }
}
