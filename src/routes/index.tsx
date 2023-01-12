import { Title } from "solid-start";
import { createSignal, createResource } from "solid-js"
import type { JSX } from 'solid-js';
import { TweetList } from "~/components/TweetList";
import type { Tweet } from "~/components/TweetList";

interface TweetsResponse {
  results: Tweet[]; error?: string
}

const fetchTweets = async (username: string) => {
  const resp = await (await fetch(`/api/user/${username}/tweets`)).json() as TweetsResponse

  return resp.results
}

export default function Index() {
  const [tweets, setTweets] = createSignal<Tweet[]>()

  const onSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (e) => {
    e.preventDefault()
    // if (!usernameValue) return

    const form = document.getElementById('username-search-form') as HTMLFormElement | null;
    if (!form) return

    const formData = Object.fromEntries(new FormData(form).entries());
    const username = formData['username'] as string
    if (!username) return

    const result = await fetchTweets(username)
    console.log(result)
    setTweets(result)
  }

  return (
    <main>
      <Title>Cancel Me</Title>
      <h1>Welcome</h1>
      <p>It's time to cancel yourself!</p>
      <form onSubmit={onSubmit} id='username-search-form'>
            <input 
                type="text"
                id='username-field'
                name='username'
            />
            <button type='submit'>
              Search
            </button>
      </form>
      <TweetList tweets={tweets()} />
    </main>
  );
}
