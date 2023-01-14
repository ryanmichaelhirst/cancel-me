import { APIEvent, json } from "solid-start/api";
import { authClient, twitterClient } from "~/lib/twitter-client";

export async function GET({ params, request }: APIEvent) {    
    try {
        const header = await authClient.getAuthHeader()
        console.log(header)
        const currentUser = await twitterClient.users.findMyUser(
            { "user.fields": ['name', 'username', 'id'] }, 
            { auth: authClient }
        )  
        const currentUserId = currentUser.data?.id
        if (!currentUserId) return json({ error: 'No user id for current user' })
        const tweets = await twitterClient.tweets.usersIdTweets(currentUserId)

        return json({ result: tweets })
    } catch (error) {
        console.log({ error })
        return json({ error })
    }
}