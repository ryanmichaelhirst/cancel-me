import type Stripe from 'stripe'

export interface AccountVerifyCredentialsResponse {
  id_str: string
  email: string
  id: number
  screen_name: string
  profile_image_url: string
  profile_image_url_https: string
  profile_use_background_image: string
  profile_background_image_url: string
  profile_background_image_url_https: string
  verified: boolean
  description: string
  name: string
  favourites_count: number
  statuses_count: number
  followers_count: number
  friends_count: number
}

export type User = Pick<AccountVerifyCredentialsResponse, 'id' | 'id_str' | 'email' | 'screen_name'>

export type HistoricalTweet = {
  tweet: {
    id: string
    id_str: string
    full_text: string
    created_at: string
  }
}

export type ProfanityLevel = 'mild' | 'medium' | 'strong' | 'strongest'
export type Profanity = { word: string; level: ProfanityLevel }
// type TwitterTweet = Exclude<TwitterResponse<usersIdTweets>['data'], undefined>[number]
export type Tweet = {
  text: string
  created_at: string
  id: number
  id_str: string
  profanity?: Profanity
}

export interface ProfanityMetrics {
  mild: number
  medium: number
  strong: number
  strongest: number
  safe: number
}

export type Product = Stripe.Product & { dollarAmount: string }

export interface StripeEvent {
  id: string
  object: 'event'
  api_version: string
  created: number
  data: {
    object: {
      id: string
      object: 'checkout.session'
      amount_subtotal: number
      amount_total: number
      customer_email?: string | null
      metadata: {
        productId: string
        productName: string
        userId: string
      }
      payment_status: 'paid'
      status: 'complete'
    }
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
  type: 'checkout.session.completed' | 'payment_intent.succeeded'
}

export interface StripeError {
  message: string
}
