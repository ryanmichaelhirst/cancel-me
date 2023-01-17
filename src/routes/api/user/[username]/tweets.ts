import { APIEvent, json } from 'solid-start'
import { twitterClient } from '~/lib/twitter-client'

export async function GET({ params }: APIEvent) {
  try {
    const user = await twitterClient.users.findUserByUsername(params.username)
    const userId = user.data?.id
    if (!userId) return json({ results: [], error: 'unable to find user' })

    const resp = await twitterClient.tweets.usersIdTweets(userId, {
      max_results: 100,
      start_time: '2012-11-06T07:20:50.52Z',
      // end_time: '2012-11-06T07:20:50.52Z'
    })

    return json(resp)
  } catch (error) {
    return json({ errors: [{ type: 'runtime-error', title: 'Tweets not loaded' }] })
  }
}
