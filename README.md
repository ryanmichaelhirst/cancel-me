# Cancel Me

View all of your tweets that would get you canceled in today's social climate. You've made plenty of mistakes and this app knows about all of them.

View the website [here](https://cancelme.io)

## Development

Setup your application on twitter's developer portal and create the necessary tokens [here](https://developer.twitter.com/en/portal/dashboard)

Copy .env.sample and fill out the env variables.
`cp .env.sample .env`

Follow the instructions in the [Cloudflare Tunnels section](#Cloudflare-Tunnels), and then copy cloudflare.yaml.sample and fill out the necessary values. 
`cp cloudflare.yaml.sample cloudflare.yaml`

Run the app with `yarn dev`

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

`npx prisma migrate dev`

Apply migrations to production

`npx prisma migrate deploy

Generate the client

`npx prisma generate`

## Donations with Stripe

Donations are powered through Stripe and recorded through a webhook at `/routes/api/stripe/event.ts`

To test and development your webhook you will need to install the stripe cli

https://stripe.com/docs/stripe-cli#install

Login to the cli

`stripe login`

Forward events to your webhook

`stripe listen --forward-to localhost:3000/api/stripe/event`

Trigger a webhook event

`stripe trigger checkout.session.completed

For a full list of supported events

`stripe trigger --help`

Simulate a payment with stripe test cards

https://stripe.com/docs/testing

Test card info (card #, exp date, cvc)
`4242 4242 4242 4242`, `12/34`, `123`

## Cloudflare Tunnels

You can expose your localhost server (`yarn dev`) as a publicaly routable IP address with ssh tunneling

Full instructions [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local/#set-up-a-tunnel-locally-cli-setup)

Install with homebrew

`brew install cloudflare/cloudflare/cloudflared`

Login using cli

`cloudflared tunnel login`

Create a tunnel

`cloudflared tunnel create <NAME>`

Update config file with your creds

`cp cloudflare.yaml.sample cloudflare.yaml`

Route traffic to tunnel

`cloudflared tunnel route dns <UUID or NAME> <hostname>`

Run the tunnel

`cloudflared tunnel run <UUID or NAME>` or `yarn tunnel`

Get the name record mappings on vercel

`https://dash.cloudflare.com/${account_id}/${website}.com/dns`

Add name records to cloudflare

`https://vercel.com/${user}/${repo}/settings/domains`

## Supporting the project
If you'd like to support this project and other web apps, consider becoming a patron!

https://www.patreon.com/ryanmichaelhirst