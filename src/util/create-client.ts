import { APIEvent } from 'solid-start'
import Twitter from 'twitter-lite'
import { getUser } from '~/lib/session'

export const createClient = async (request: APIEvent['request']) => {
  const user = await getUser(request)
  const client = new Twitter({
    consumer_key: process.env.API_KEY as string,
    consumer_secret: process.env.API_SECRET as string,
    access_token_key: user?.oauth_token,
    access_token_secret: user?.oauth_token_secret,
  })

  return client
}
