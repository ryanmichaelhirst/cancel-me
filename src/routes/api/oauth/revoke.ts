import { authClient, setAccessToken } from "~/lib/twitter-client"
import { APIEvent, json } from "solid-start/api";

export async function GET(event: APIEvent) {
    try {
        const response = await authClient.revokeAccessToken();
        setAccessToken()
        
        return json({ revokeResponse: response })
    } catch (error) {
        return json({ revokeError: error })
    }
}