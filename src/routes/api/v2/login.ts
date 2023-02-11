import { APIEvent, json } from 'solid-start/api'
import { authClient, STATE } from '~/lib/twitter-user-client'

// step 1: login with twitter
export async function GET(event: APIEvent) {
  try {
    // github issue for code_challenge: 's256'
    // https://github.com/twitterdev/twitter-api-typescript-sdk/issues/59
    const authUrl = authClient.generateAuthURL({
      state: STATE,
      code_challenge_method: 'plain',
      code_challenge: 'test',
    })

    return json({ authUrl })
  } catch (error) {
    return json({ loginError: error })
  }
}
