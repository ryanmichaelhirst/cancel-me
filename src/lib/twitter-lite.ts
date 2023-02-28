// Implementation for oauth can be found here:
// https://github.com/draftbit/twitter-lite/blob/00052e6b920e642a401f37b66972fd7b8553fa00/twitter.js#L152

// Library to support V1 of twitter api
// https://github.com/draftbit/twitter-lite

import Twitter from 'twitter-lite'
import { Profanity, ProfanityMetrics, Tweet } from '~/types'
import badWords from '~/word-lists/profanities'

class TwitterLite {
  public client: Twitter
  private profanities: Profanity[]

  constructor() {
    this.client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
    })
    this.profanities = badWords
  }

  normalizeText(text: string) {
    return (
      text
        .toLowerCase()
        // remove all punctuation from text
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(' ')
    )
  }

  profanity(text: string) {
    const words = this.normalizeText(text)

    return this.profanities.find((p) => {
      return words.find((word) => word === p.word)
    })
  }

  setClient(accessToken: string, accessTokenSecret: string) {
    this.client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
      access_token_key: accessToken,
      access_token_secret: accessTokenSecret,
    })
  }

  profanityMetrics(tweets: Tweet[]) {
    return tweets.reduce<ProfanityMetrics>(
      (acc, cur) => {
        const { profanity } = cur
        if (!profanity) {
          acc.safe++

          return acc
        }

        const { level } = profanity
        if (level === 'mild') {
          acc.mild++
        } else if (level === 'medium') {
          acc.medium++
        } else if (level === 'strong') {
          acc.strong++
        } else if (level === 'strongest') {
          acc.strongest++
        }

        return acc
      },
      { mild: 0, medium: 0, strong: 0, strongest: 0, safe: 0 },
    )
  }
}

export const twitterLite = new TwitterLite()
