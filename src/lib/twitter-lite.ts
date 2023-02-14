// Implementation for oauth can be found here:
// https://github.com/draftbit/twitter-lite/blob/00052e6b920e642a401f37b66972fd7b8553fa00/twitter.js#L152

// Library to support V1 of twitter api
// https://github.com/draftbit/twitter-lite

import Twitter from 'twitter-lite'
import { ProfanityMetrics, Tweet } from '~/types'
import mediumWords from '~/word-lists/medium'
import mildWords from '~/word-lists/mild'
import badWords from '~/word-lists/profanities'
import strongWords from '~/word-lists/strong'
import strongestWords from '~/word-lists/strongest'

class TwitterLite {
  public client: Twitter
  private profanities: string[]
  private mildWords: string[]
  private mediumWords: string[]
  private strongWords: string[]
  private strongestWords: string[]

  constructor() {
    this.client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
    })
    this.profanities = badWords
    this.mildWords = mildWords
    this.mediumWords = mediumWords
    this.strongWords = strongWords
    this.strongestWords = strongestWords
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

  isContainMild(text: string) {
    const words = this.normalizeText(text)

    return words.some((word) => {
      return this.mildWords.includes(word)
    })
  }

  isContainMedium(text: string) {
    const words = this.normalizeText(text)

    return words.some((word) => {
      return this.mediumWords.includes(word)
    })
  }

  isContainStrong(text: string) {
    const words = this.normalizeText(text)

    return words.some((word) => {
      return this.strongWords.includes(word)
    })
  }

  isContainStrongest(text: string) {
    const words = this.normalizeText(text)

    return words.some((word) => {
      return this.strongestWords.includes(word)
    })
  }

  isContainProfanity(text: string) {
    const words = this.normalizeText(text)

    return words.some((word) => {
      return this.profanities.includes(word)
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
        const { text, isProfanity } = cur
        if (!isProfanity) {
          acc.safe++

          return acc
        }

        if (this.isContainMild(text)) {
          acc.mild++
        } else if (this.isContainMedium(text)) {
          acc.medium++
        } else if (this.isContainStrong(text)) {
          acc.strong++
        } else if (this.isContainStrongest(text)) {
          acc.strongest++
        } else {
          acc.unrated++
        }

        return acc
      },
      { mild: 0, medium: 0, strong: 0, strongest: 0, safe: 0, unrated: 0 },
    )
  }
}

export const twitterLite = new TwitterLite()
