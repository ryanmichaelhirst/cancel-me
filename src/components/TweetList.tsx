import { For } from "solid-js";

export interface Tweet {
    edit_history_tweet_ids: string[]
    id: string
    text: string
}

const Tweet = (props: { tweet: Tweet, idx: number }) => {
    return (
        <div id={props.tweet.id} class='border-b-2 border-blue-200 mb-4 pb-2'>
            <div class='flex items-center'>
                <p class='font-bold text-slate-800 mr-4'>{props.idx}</p>
                <p class='text-lg text-slate-800'>{props.tweet.text}</p>
            </div>
        </div>
    )
}

export const TweetList = (props: { tweets?: Tweet[] }) => {
    return (
        <div class='border border-solid border-blue-200 rounded p-4 mt-10'>
            <For each={props.tweets}>
                {(tweet, idx) => <Tweet tweet={tweet} idx={idx()} />}
            </For>
        </div>
    )
}