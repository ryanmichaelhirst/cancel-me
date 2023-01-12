import { For } from "solid-js";

export interface Tweet {
    edit_history_tweet_ids: string[]
    id: string
    text: string
}

const Tweet = (props: { tweet: Tweet }) => {
    return (
        <div id={props.tweet.id}>
            <p>{props.tweet.text}</p>
        </div>
    )
}

export const TweetList = (props: { tweets?: Tweet[] }) => {
    return (
        <For each={props.tweets}>
            {(tweet) => <Tweet tweet={tweet} />}
        </For>
    )
}