import { APIEvent, json } from 'solid-start/api'
import { twitterUserClient } from '~/lib/twitter-user-client'

export async function DELETE(event: APIEvent) {
  const { params } = event
  console.log(params)

  try {
    const resp = await twitterUserClient.client.tweets.deleteTweetById(params.id)
    console.log(resp)

    return json(resp)
  } catch (error) {
    console.log(error)

    return json({ deleteTweetError: error })
  }
}
