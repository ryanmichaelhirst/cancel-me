import { APIEvent, json } from 'solid-start'
import { auth, Client } from 'twitter-api-sdk'
import { TwitterParams, usersIdTweets } from 'twitter-api-sdk/dist/types'

const token =
  'AAAAAAAAAAAAAAAAAAAAADjvKwEAAAAAvEscVU9JjtPo7RU%2Bt0vfb3%2BDEJU%3DjSXfEiPQjSPdpHYep5mftfWaqt6MQw8iErusKOjnOIc0iUimJX'
const authClient = new auth.OAuth2Bearer(token)
export const twitterClient = new Client(authClient)

// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
const fetchTweetsByUserId = async ({
  userId,
  opts,
}: {
  userId: string
  opts: TwitterParams<usersIdTweets>
}) => {
  return await twitterClient.tweets.usersIdTweets(userId, { ...opts })
}

export async function GET({ params }: APIEvent) {
  try {
    const user = await twitterClient.users.findUserByUsername(params.username)
    const userId = user.data?.id
    if (!userId) return json({ results: [], error: 'unable to find user' })

    const usersTweets = await fetchTweetsByUserId({
      userId,
      opts: {
        max_results: 100,
        start_time: '2012-11-06T07:20:50.52Z',
        // end_time: '2012-11-06T07:20:50.52Z'
      },
    })
    let nextToken = usersTweets.meta?.next_token
    let results = usersTweets.data ?? []

    // paginate through all available tweets
    // while (nextToken) {
    //     let result = await fetchTweetsByUserId({ userId, opts: { pagination_token: nextToken } })
    //     const tweets = result.data ?? []
    //     for (const tweet of tweets) {
    //         results.push(tweet)
    //     }

    //     nextToken = result.meta?.next_token
    // }

    return json({ results })
  } catch (error) {
    console.log(error)

    return json({ results: [], error: 'error loading tweets' })
  }
}
