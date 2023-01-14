import querystring from 'querystring'
import { APIEvent, json, redirect } from 'solid-start/api'
import url from 'url'
import { authClient, setAccessToken, STATE } from '~/lib/twitter-client'

// step 2: request oauth access token
export async function GET({ params, request }: APIEvent) {
  const parsedUrl = url.parse(request.url)
  const query = parsedUrl.query
  if (!query) return json({ error: 'no query to parse' })

  const searchParams = querystring.parse(query)

  try {
    const { state } = searchParams
    if (state !== STATE) return json({ error: 'State does not match' })

    const code = searchParams.code as string | undefined
    if (!code) return json({ error: 'Code does not exist' })

    const result = await authClient.requestAccessToken(code)
    setAccessToken(result.token)

    return redirect('/')
  } catch (error) {
    return json({ callbackError: error })
  }
}
