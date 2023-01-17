import { APIEvent, json } from 'solid-start/api'
import { profanitiesClient } from '~/lib/profanities-client'
import { authClient, twitterUserClient } from '~/lib/twitter-user-client'

export async function GET(event: APIEvent) {
  try {
    const currentUser = await twitterUserClient.client.users.findMyUser(
      { 'user.fields': ['name', 'username', 'id'] },
      { auth: authClient },
    )
    const currentUserId = currentUser.data?.id
    if (!currentUserId) return json({ error: 'No user id for current user' })

    const tweets = await twitterUserClient.client.tweets.usersIdTweets(currentUserId)
    const vulgarTweets = tweets.data?.filter((d) => {
      return profanitiesClient.isContainProfanity(d.text)
    })

    return json(vulgarTweets)
  } catch (error) {
    return json({ currentErrorTweetsError: error })
  }
}
