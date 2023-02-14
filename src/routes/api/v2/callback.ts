import querystring from 'querystring'
import { APIEvent, json, redirect } from 'solid-start/api'
import url from 'url'
import { authClient, setAccessToken, STATE, twitterUserClient } from '~/lib/twitter-user-client'

// step 2: handle authorization from twitter login
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

    // request and set oauth token
    const result = await authClient.requestAccessToken(code)
    setAccessToken(result.token)

    // initialize twitter client for logged in user
    const currentUser = await twitterUserClient.client.users.findMyUser(
      { 'user.fields': ['name', 'username', 'id'] },
      { auth: authClient },
    )
    const userId = currentUser.data?.id
    twitterUserClient.setUserId(userId)

    return redirect('dashboard')
  } catch (error) {
    return json({ callbackError: error })
  }
}
