import dotenv from 'dotenv'
import { auth, Client } from 'twitter-api-sdk'
import { Profanity } from '~/types'
import badWords from '~/word-lists/profanities'

dotenv.config()

export const STATE = 'TWITTER_STATE'

// https://github.com/twitterdev/twitter-api-typescript-sdk/blob/main/examples/oauth2-callback.ts
export const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID as string,
  client_secret: process.env.CLIENT_SECRET as string,
  callback: process.env.CALLBACK_URL as string,
  scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
})

type Token = Awaited<ReturnType<auth.OAuth2User['requestAccessToken']>>['token']
export let accessToken: Token | undefined

export const setAccessToken = (token?: Token) => (accessToken = token)

class TwitterUserClient {
  public client: Client
  private userId?: string
  private profanities: Profanity[]

  constructor() {
    this.client = new Client(authClient)
    this.profanities = badWords
  }

  profanity(text: string) {
    const words = text
      .toLowerCase()
      // remove all punctuation from text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(' ')

    return words.find((word) => {
      return this.profanities.find((p) => p.word === word)
    })
  }

  async tweets(paginate?: boolean) {
    if (!this.userId) throw new Error('no user id')

    const resp = await this.client.tweets.usersIdTweets(this.userId, {
      'tweet.fields': ['id', 'created_at', 'text', 'source'],
      max_results: 100,
    })

    let nextToken = resp.meta?.next_token
    let results = resp.data ?? []

    // paginate through all available tweets
    while (paginate && nextToken) {
      // https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
      let result = await this.client.tweets.usersIdTweets(this.userId, {
        pagination_token: nextToken,
        max_results: 100,
        // start_time: '2012-11-06T07:20:50.52Z',
        // end_time: '2012-11-06T07:20:50.52Z',
        // max_results: 100,
      })
      const tweets = result.data ?? []
      for (const tweet of tweets) {
        results.push(tweet)
      }

      nextToken = result.meta?.next_token
    }

    // determine which tweets contains a profanity
    const data = results.map((tweet) => {
      return {
        ...tweet,
        profanity: this.profanity(tweet.text),
      }
    })

    return {
      ...resp,
      data,
    }
  }

  setUserId(userId?: string) {
    this.userId = userId
  }

  getUserId() {
    return this.userId
  }
}

export const twitterUserClient = new TwitterUserClient()
