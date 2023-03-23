import { APIEvent, json } from 'solid-start'
import { profanityParser } from '~/lib/profanity-parser'
import { HistoricalTweet } from '~/types'

export async function POST({ params, request }: APIEvent) {
  try {
    // file upload deprecated: vercel serverless functions have a 4.5MB limit
    // https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions
    //const formData = await request.formData()
    //const fileUpload = formData.get('file-upload') as File
    // method 1: plain text
    // const text = await fileUpload.text()
    // const safeText = text.replace('window.YTD.tweets.part0 = ', '')
    // const historicalTweets: HistoricalTweet[] = JSON.parse(safeText)
    // method 2: streams
    // const stream = fileUpload.stream().getReader()
    // const contents = await stream.read()
    // const byteArr = contents.value
    // const decoded = new TextDecoder().decode(byteArr)
    // const tweets = decoded.map((ht, idx) => { .... })
    const body: { tweets: HistoricalTweet[]; username: string } = await new Response(
      request.body,
    ).json()

    const historicalTweets = body.tweets
    const tweets = historicalTweets.map(({ tweet }, idx) => {
      return {
        text: tweet.full_text,
        created_at: tweet.created_at,
        id: parseInt(tweet.id),
        id_str: tweet.id_str,
        profanity: tweet.full_text ? profanityParser.profanity(tweet.full_text) : undefined,
      }
    })

    return json({ tweets })
  } catch (error) {
    console.log(error)

    return new Response('Unable to upload file', { status: 500 })
  }
}
