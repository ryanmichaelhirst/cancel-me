import { APIEvent, json } from 'solid-start/api'
import { twitterUserClient } from '~/lib/twitter-user-client'

export async function DELETE(event: APIEvent) {
  const { params } = event

  try {
    const resp = await twitterUserClient.client.tweets.deleteTweetById(params.id)

    return json(resp)
  } catch (err) {
    const error = err as {
      error: {
        title: string
        detail: string
        type: string
        status: number
      }
      headers: Record<string, unknown>
      status: number
      statusText: string
    }

    return json({ error })
  }
}
