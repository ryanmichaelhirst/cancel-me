import { APIEvent, json } from 'solid-start/api'
import { authClient, twitterClient } from '~/lib/twitter-client'

export async function GET(event: APIEvent) {
  try {
    const currentUser = await twitterClient.users.findMyUser(
      { 'user.fields': ['name', 'username', 'id'] },
      { auth: authClient },
    )
    const currentUserId = currentUser.data?.id
    if (!currentUserId) return json({ error: 'No user id for current user' })

    const response = await twitterClient.tweets.usersIdTweets(currentUserId)

    return json(response)
  } catch (error) {
    return json({ currentErrorTweetsError: error })
  }
}
