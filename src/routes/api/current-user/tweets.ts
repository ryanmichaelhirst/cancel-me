import { APIEvent, json } from 'solid-start/api'
import { authClient, twitterUserClient } from '~/lib/twitter-user-client'

export async function GET(event: APIEvent) {
  try {
    const currentUser = await twitterUserClient.client.users.findMyUser(
      { 'user.fields': ['name', 'username', 'id', 'created_at'] },
      { auth: authClient },
    )
    const currentUserId = currentUser.data?.id
    if (!currentUserId) return json({ error: 'No user id for current user' })

    const resp = await twitterUserClient.client.tweets.usersIdTweets(currentUserId, {
      'tweet.fields': ['id', 'created_at', 'text', 'source'],
      start_time: '2012-11-06T07:20:50.52Z',
      exclude: ['replies', 'retweets'],
      max_results: 100,
    })
    console.log(resp)

    return json(resp)
  } catch (error) {
    console.log(error)

    return json({ currentErrorTweetsError: error })
  }
}
