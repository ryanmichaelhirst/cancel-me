import fs from 'fs'

const fileContents = fs.readFileSync('./src/files/profanities.txt', 'utf-8')
const badWords = fileContents.split('\n')

class ProfanitiesClient {
  private profanities: string[]

  constructor() {
    this.profanities = badWords
  }

  isContainProfanity(text: string) {
    const words = text
      .toLowerCase()
      // remove all punctuation from text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(' ')

    return words.some((word) => {
      return this.profanities.includes(word)
    })
  }
}

export const profanitiesClient = new ProfanitiesClient()
