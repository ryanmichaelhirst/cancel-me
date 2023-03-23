import pick from 'lodash.pick'
import querystring from 'querystring'
import { APIEvent, json } from 'solid-start/api'
import Twitter from 'twitter-lite'
import url from 'url'
import { createUserSession } from '~/lib/session'

// step 2: handle authorization from twitter login
export async function GET({ params, request }: APIEvent) {
  console.log('got oauth callback')
  const parsedUrl = url.parse(request.url)
  const query = parsedUrl.query
  if (!query) return json({ error: 'no query to parse' })

  const searchParams = querystring.parse(query)

  try {
    let client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
    })

    const { oauth_token, oauth_verifier } = searchParams
    console.log('got oauth params', { oauth_token, oauth_verifier })

    // request access tokens
    const resp = await client.getAccessToken({
      oauth_verifier: oauth_verifier as string,
      oauth_token: oauth_token as string,
    })
    console.log('got access tokens', resp)

    client = new Twitter({
      consumer_key: process.env.API_KEY as string,
      consumer_secret: process.env.API_SECRET as string,
      access_token_key: resp.oauth_token,
      access_token_secret: resp.oauth_token_secret,
    })
    // get current user
    const accountResp = await client.get('account/verify_credentials', {
      include_email: true,
    })
    console.log('got account resp', accountResp)

    const user = {
      ...pick(accountResp, ['id_str', 'email', 'id', 'screen_name']),
      oauth_token: resp.oauth_token,
      oauth_token_secret: resp.oauth_token_secret,
    }

    // create session
    return createUserSession(user, '/dashboard')
  } catch (error) {
    return json({ error })
  }
}
