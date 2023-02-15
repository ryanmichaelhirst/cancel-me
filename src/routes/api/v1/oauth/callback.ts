import pick from 'lodash.pick'
import querystring from 'querystring'
import { APIEvent, json } from 'solid-start/api'
import url from 'url'
import { createUserSession } from '~/lib/session'
import { twitterLite } from '~/lib/twitter-lite'

// step 2: handle authorization from twitter login
export async function GET({ params, request }: APIEvent) {
  console.log('got oauth callback')
  const parsedUrl = url.parse(request.url)
  const query = parsedUrl.query
  if (!query) return json({ error: 'no query to parse' })

  const searchParams = querystring.parse(query)

  try {
    const { oauth_token, oauth_verifier } = searchParams
    console.log('got oauth params', { oauth_token, oauth_verifier })

    // request access tokens
    const resp = await twitterLite.client.getAccessToken({
      oauth_verifier: oauth_verifier as string,
      oauth_token: oauth_token as string,
    })

    // reset client with access token and access token secret
    twitterLite.setClient(resp.oauth_token, resp.oauth_token_secret)
    console.log('created client', resp)

    // get current user
    const accountResp = await twitterLite.client.get('account/verify_credentials', {
      include_email: true,
    })
    console.log('got account resp', accountResp)

    const user = pick(accountResp, ['id_str', 'email', 'id', 'screen_name'])

    // create session
    return createUserSession(user, '/dashboard')
  } catch (error) {
    return json({ error })
  }
}
