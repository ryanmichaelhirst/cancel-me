import type { JSX } from 'solid-js'
import { Title } from 'solid-start'

export default function Index() {
  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/oauth/login`)).json()

    window.open(resp.authUrl, '_blank')
  }

  return (
    <main class='min-h-full'>
      <Title>Cancel Me</Title>
      <h1 class='mt-10 mb-6 text-5xl'>Cancel Me</h1>
      <section>
        <p class='text-xl'>
          The year is 2023, Amber Heard has just been canceled for shitting on her bed. Kanye West
          comes next after saying he loves everyone, especially Hitler, for some reason. You should
          probably clean up your social media accounts before you're next.
        </p>
        <p class='text-lg'>
          Cancel Me is an app designed to scrub through all of your tweets, flag the ones that are
          NSFW, and allow you to delete them in bulk. We are also 100% free so why not give it a
          try!
        </p>
      </section>

      <section>
        <h2 class='mt-10 mb-6 text-4xl'>What is the point of this?</h2>
        <p class='mb-4 text-lg'>
          In recent years it has become increasingly easier for people to look up your written
          mistakes if they dig deep enough. The goal of this app is to help protect you by searching
          your tweets and flagging ones that contain obscenities. Afterwards you can delete all your
          tweets with a click of a button.
        </p>
        <p class='mb-4 text-lg'>
          If we've convinced you to look back on all your past cringe then read on. The first step
          is authorizing this app through twitter with the button below.
        </p>
        <button
          onClick={onClick}
          class='mb-4 rounded border border-blue-500 py-1 px-2 text-slate-800 hover:bg-blue-500 hover:text-white'
        >
          Login with twitter
        </button>
      </section>
    </main>
  )
}
