import {
  deleteTweetById,
  TwitterPaginatedResponse,
  TwitterResponse,
  usersIdTweets,
} from 'twitter-api-sdk/dist/types'

export type UserUsernameTweetsResponse = TwitterPaginatedResponse<TwitterResponse<usersIdTweets>>

export type Tweet = Exclude<TwitterResponse<usersIdTweets>['data'], undefined>[number]

export type DeleteTweetResponse = TwitterResponse<deleteTweetById>

export type UserIdTweetsResponse = TwitterResponse<usersIdTweets>
