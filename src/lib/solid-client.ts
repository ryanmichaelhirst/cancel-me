import type { DeleteTweetResponse, UserIdTweetsResponse, UserUsernameTweetsResponse } from '~/types'

class SolidClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  async deleteTweets(ids: string[]) {
    const responses = []

    for (const id of ids) {
      const resp: DeleteTweetResponse = await (
        await fetch(`${this.baseUrl}/current-user/tweet/${id}`, {
          method: 'DELETE',
        })
      ).json()

      responses.push(resp)
    }

    return responses
  }

  async getMyTweets() {
    const resp: UserIdTweetsResponse = await (
      await fetch(`${this.baseUrl}/current-user/tweets`)
    ).json()

    return resp
  }

  async searchTweetsByUsername(username: string) {
    const resp: UserUsernameTweetsResponse = await (
      await fetch(`${this.baseUrl}/user/${username}/tweets`)
    ).json()

    return resp
  }
}

export const solidClient = new SolidClient()
