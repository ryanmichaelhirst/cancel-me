import badWords from '~/lib/bad-words'
import { Profanity, ProfanityMetrics, Tweet } from '~/types'

class ProfanityParser {
  private profanities: Profanity[]

  constructor() {
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

export const profanityParser = new ProfanityParser()
