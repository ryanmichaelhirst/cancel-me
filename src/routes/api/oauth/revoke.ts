import { APIEvent, json } from 'solid-start/api'
import { authClient, setAccessToken } from '~/lib/twitter-client'

export async function GET(event: APIEvent) {
  try {
    const response = await authClient.revokeAccessToken()
    setAccessToken()

    return json({ revokeResponse: response })
  } catch (error) {
    return json({ revokeError: error })
  }
}
