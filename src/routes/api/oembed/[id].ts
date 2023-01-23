import { APIEvent, json } from 'solid-start/api'

export async function GET(event: APIEvent) {
  const { params, fetch } = event

  try {
    const resp = await (
      await fetch(
        `https://publish.twitter.com/oembed?url=https://twitter.com/twitter/status/${params.id}`,
        {},
      )
    ).json()

    return json(resp)
  } catch (error) {
    console.log(error)

    return json({ deleteTweetError: error })
  }
}
