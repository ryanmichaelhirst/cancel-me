import dotenv from 'dotenv'
import { auth, Client } from 'twitter-api-sdk'

dotenv.config()

export const STATE = 'TWITTER_STATE'

// https://github.com/twitterdev/twitter-api-typescript-sdk/blob/main/examples/oauth2-callback.ts
export const authClient = new auth.OAuth2User({
  client_id: process.env.CLIENT_ID as string,
  client_secret: process.env.CLIENT_SECRET as string,
  callback: process.env.CALLBACK_URL as string,
  scopes: ['tweet.read', 'users.read', 'offline.access'],
})

export const twitterClient = new Client(authClient)

type Token = Awaited<ReturnType<auth.OAuth2User['requestAccessToken']>>['token']
export let accessToken: Token | undefined

export const setAccessToken = (token?: Token) => (accessToken = token)
