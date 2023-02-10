import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'

export async function DELETE(event: APIEvent) {
  const { params } = event

  try {
    const resp = await twitterLite.client.post('statuses/destroy', {
      id: params.id,
    })
    console.log(resp)

    return json(resp)
  } catch (err) {
    console.log('Error deleting tweet', err)

    // { code: 144; message: "No status found with that ID" }
    return json({ error: err })
  }
}
