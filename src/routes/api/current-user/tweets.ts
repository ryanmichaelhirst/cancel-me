import querystring from 'querystring'
import { APIEvent, json } from 'solid-start/api'
import url from 'url'
import { twitterUserClient } from '~/lib/twitter-user-client'

export async function GET({ request }: APIEvent) {
  const parsedUrl = url.parse(request.url)
  const query = parsedUrl.query
  const searchParams = querystring.parse(query ?? '')
  const { paginate } = searchParams
  console.log({ paginate })

  try {
    const userId = twitterUserClient.getUserId()
    if (!userId) return json({ error: 'No user id for current user' })

    // enable or disable pagination
    const resp = await twitterUserClient.tweets(paginate === 'true')

    return json(resp.data)
  } catch (error) {
    console.log(error)

    return json({ currentErrorTweetsError: error })
  }
}
