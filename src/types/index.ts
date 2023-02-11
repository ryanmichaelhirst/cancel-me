import type Stripe from 'stripe'

// type TwitterTweet = Exclude<TwitterResponse<usersIdTweets>['data'], undefined>[number]
export type Tweet = {
  text: string
  created_at: string
  id: number
  id_str: string
  isProfanity?: boolean
}

export interface ProfanityMetrics {
  mild: number
  medium: number
  strong: number
  strongest: number
  safe: number
  unrated: number
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
