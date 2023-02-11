# Cancel Me

View all of your tweets that would get you canceled in today's social climate. You've made plenty of mistakes and this app knows about all of them.

## Development

Setup your application on twitter's developer portal.

Update your .env files and run `yarn dev` to start you local server

## Building

`yarn build`

## Profane Word List

Any tweets that include at least one of the words on this list will be flagged and shown to the user.

https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words

## Authorizing with Twitter

https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens

## Prisma

To make changes to the database update the prisma/schema.prisma file

Next generate and apply the sql migration

npx prisma migrate dev

Apply migrations to production

npx prisma migrate deploy

Generate the client

npx prisma generate

## Donations with Stripe

Donations are powered through Stripe and recorded through a webhook at /routes/api/stripe/event.ts

To test and development your webhook you will need to install the stripe cli

https://stripe.com/docs/stripe-cli#install

Login to the cli

stripe login

Forward events to your webhook

stripe listen --forward-to localhost:3000/api/stripe/event

Trigger a webhook event

stripe trigger checkout.session.completed

For a full list of supported events

stripe trigger --help

Simulate a payment with stripe test cards

https://stripe.com/docs/testing

`4242 4242 4242 4242`, `12/34`, `123`