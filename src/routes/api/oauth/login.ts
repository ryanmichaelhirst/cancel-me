import { authClient, STATE } from "~/lib/twitter-client"
import { APIEvent, json } from "solid-start/api";
import { redirect } from "solid-start/server";

// step 1: login with twitter
export async function GET({ params }: APIEvent) {
    try {
        const authUrl = authClient.generateAuthURL({
            state: STATE,
            code_challenge_method: "plain",
            code_challenge: "test",
          });
        console.log({ authUrl })

        return json({ authUrl })
    } catch (error) {
        console.log(error)
        return json({ error })
    }
}