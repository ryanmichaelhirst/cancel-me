import { Icon } from 'solid-heroicons'
import { archiveBox, chatBubbleLeftRight, magnifyingGlassCircle } from 'solid-heroicons/outline'
import { JSX } from 'solid-js'
import { Title, useRouteData } from 'solid-start'
import { Page } from '~/components/page'
import { useLayoutRouteData } from '~/routes/[...index]'

export default function Index() {
  const data = useRouteData<useLayoutRouteData>()

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <Page>
      <Title>Home - Cancel Me</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>Time to cancel yourself</h1>

      <section class='mt-6'>
        <p class='mb-10 text-lg text-slate-900'>
          The year is 2023 and you fondly look back at 2022. Cristiano Ronaldo retires himself from
          soccer after an interview with Piers Morgan. Olivia Wilde fires Shia LeBoeuf after
          claiming he's an asshole, shortly after a video is leaked showing she begged him not to
          quit. And Adam Levine slides into the DMs of multiple Instagram models while his wife is
          pregnant. Technology has a way of keeping a record of all our actions, good and bad.
        </p>
        <p class='mb-4 text-lg text-slate-900'>
          Cancel Me is an app designed to scrub through all of your tweets, flag the ones that are
          obscene or NSFW, and give you the option to delete them in bulk. This service is 100% free
          and will give you an honest look at any tweets you might want to remove from the platform.
        </p>
        <button
          onClick={onClick}
          class='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600'
        >
          Get started
        </button>
      </section>

      <section class='mt-24'>
        <p class='text-lg text-blue-800'>Why Cancel Me</p>
        <p class='mb-2 text-2xl text-slate-800'>These folks should have used it</p>
        <ul class='grid list-none auto-rows-fr grid-cols-3 gap-6'>
          <li>
            <img
              src='/images/amanda-bynes.jpeg'
              alt='Amanda Bynes tweet'
              class='h-[150px] w-full rounded-xl border shadow'
            />
          </li>
          <li>
            <img
              src='/images/azealia-banks.jpeg'
              alt='Azealia Banks tweet'
              class='h-[150px] w-full rounded-xl border shadow'
            />
          </li>
          <li>
            <img
              src='/images/kevin-hart.jpeg'
              alt='Kevin Hart tweet'
              class='h-[150px] w-full rounded-xl border shadow'
            />
          </li>
        </ul>
      </section>

      <section class='mt-24'>
        <p class='text-lg text-blue-800'>Our offerings</p>
        <p class='mb-2 text-2xl text-slate-800'>The web's friendliest tweet analyzer</p>
        <p class='mb-4 text-lg text-slate-900'>
          In recent years it has become increasingly easier for people to look up your written
          mistakes if they dig deep enough. Protect yourself by deleting your flagged tweets with a
          click of a button.
        </p>
        <ul class='mt-10 flex list-none items-center space-x-10'>
          <li class='flex w-1/3 flex-col items-center'>
            <Icon path={archiveBox} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Delete bad tweets</p>
          </li>
          <li class='flex w-1/3 flex-col items-center'>
            <Icon path={chatBubbleLeftRight} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Share your score card</p>
          </li>
          <li class='flex w-1/3 flex-col items-center'>
            <Icon path={magnifyingGlassCircle} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Search any user's score card</p>
          </li>
        </ul>
      </section>

      <section class='mt-20'>
        <div class='-mx-[40px] bg-blue-500 px-[40px] py-4 lg:-mx-[120px] lg:px-[120px] xl:-mx-[200px] xl:px-[200px]'>
          <p class='text-2xl text-white'>I'm convinced</p>
          <p class='mb-4 text-3xl text-slate-900'>Please show me the cringe</p>
          <button
            onClick={onClick}
            class='rounded border border-white py-1 px-2 text-white hover:border-blue-600 hover:bg-blue-600'
          >
            Login with twitter
          </button>
        </div>
      </section>
    </Page>
  )
}
