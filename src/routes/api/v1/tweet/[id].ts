import { APIEvent, json } from 'solid-start'
import Twitter from 'twitter-lite'
import { getUser } from '~/lib/session'

export async function DELETE(event: APIEvent) {
  const { params, request } = event
  const user = await getUser(request)
  const client = new Twitter({
    consumer_key: process.env.API_KEY as string,
    consumer_secret: process.env.API_SECRET as string,
    access_token_key: user?.oauth_token,
    access_token_secret: user?.oauth_token_secret,
  })

  try {
    const resp = await client.post('statuses/destroy', {
      id: params.id,
    })

    return json(resp)
  } catch (err) {
    console.log('Error deleting tweet', err)

    // { code: 144; message: "No status found with that ID" }
    return json({ error: err })
  }
}
