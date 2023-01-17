import { auth, Client } from 'twitter-api-sdk'

if (!process.env.BEARER_TOKEN) throw new Error('No BEARER_TOKEN set in .env')

// generic client using api token
const authClient = new auth.OAuth2Bearer(process.env.BEARER_TOKEN)
export const twitterClient = new Client(authClient)
