import { deleteTweetById, TwitterResponse, usersIdTweets } from 'twitter-api-sdk/dist/types'

export type UserUsernameTweetsResponse = TwitterResponse<usersIdTweets>

type TwitterTweet = Exclude<TwitterResponse<usersIdTweets>['data'], undefined>[number]
export type Tweet = TwitterTweet & { isProfanity?: boolean }

export type DeleteTweetResponse = TwitterResponse<deleteTweetById>

export type UserIdTweetsResponse = TwitterResponse<usersIdTweets>
