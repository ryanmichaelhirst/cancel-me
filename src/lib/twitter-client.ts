import { Client, auth } from "twitter-api-sdk";
import dotenv from "dotenv";

dotenv.config();

export const STATE = 'TWITTER_STATE'

// https://github.com/twitterdev/twitter-api-typescript-sdk/blob/main/examples/oauth2-callback.ts
export const authClient = new auth.OAuth2User({
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
    callback: "http://localhost:3000/api/oauth/callback",
    scopes: ["tweet.read", "users.read"],
  });

export const twitterClient = new Client(authClient);

type Token = Awaited<ReturnType<auth.OAuth2User['requestAccessToken']>>
let accessToken: Token | undefined

export const setAccessToken = (token: Token) => accessToken = token