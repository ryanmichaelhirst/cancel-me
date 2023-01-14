import { authClient, STATE } from "~/lib/twitter-client"
import { APIEvent, json } from "solid-start/api";

// step 1: login with twitter
export async function GET(event: APIEvent) {
    try {
        const authUrl = authClient.generateAuthURL({
            state: STATE,
            code_challenge_method: "plain",
            code_challenge: "test",
          });

        return json({ authUrl })
    } catch (error) {
        return json({ loginError: error })
    }
}