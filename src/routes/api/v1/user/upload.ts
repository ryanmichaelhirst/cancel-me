import { APIEvent, json } from 'solid-start'
import { twitterLite } from '~/lib/twitter-lite'

type HistoricalTweet = {
  tweet: {
    id: string
    id_str: string
    full_text: string
    truncated: boolean
    created_at: string
  }
}

export async function POST({ params, request }: APIEvent) {
  try {
    const formData = await request.formData()
    const fileUpload = formData.get('file-upload') as File

    // method 1: plain text
    const text = await fileUpload.text()
    const safeText = text.replace('window.YTD.tweets.part0 = ', '')
    // method 2: streams
    // const stream = fileUpload.stream().getReader()
    // const contents = await stream.read()
    // const byteArr = contents.value
    // const decoded = new TextDecoder().decode(byteArr)

    const historicalTweets: HistoricalTweet[] = JSON.parse(safeText)
    const tweets = historicalTweets.map((ht, idx) => {
      const { tweet } = ht
      if (idx < 3) {
        console.log(ht)
      }

      return {
        text: tweet.full_text,
        created_at: tweet.created_at,
        id: parseInt(tweet.id),
        id_str: tweet.id_str,
        isProfanity: tweet.full_text ? twitterLite.isContainProfanity(tweet.full_text) : undefined,
      }
    })
    const metrics = twitterLite.profanityMetrics(tweets)

    return json({ tweets, metrics })
  } catch (error) {
    console.log(error)

    return new Response('Unable to upload file', { status: 500 })
  }
}
