import { authClient, setAccessToken, STATE } from "~/lib/twitter-client"
import { APIEvent, json, redirect } from "solid-start/api";
import url from 'url'
import querystring from 'querystring'

// step 2: request oauth access token
export async function GET({ params, request }: APIEvent) {    
    const parsedUrl = url.parse(request.url)
    const query = parsedUrl.query
    if (!query) return json({ error: 'no query to parse' })

    const searchParams = querystring.parse(query)

    console.log('callback', { params, query, parsedUrl })

    try {
        const { code, state } = searchParams
        if (state !== STATE) return json({ error: 'State does not match' })
        const result = await authClient.requestAccessToken(code as string);
        setAccessToken(result)
        console.log({ result })
        
        return redirect('/')
      } catch (error) {
        console.log(error);
      }
}