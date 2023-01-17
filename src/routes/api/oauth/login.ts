import { APIEvent, json } from 'solid-start/api'
import { authClient, STATE } from '~/lib/twitter-user-client'

// step 1: login with twitter
export async function GET(event: APIEvent) {
  try {
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
