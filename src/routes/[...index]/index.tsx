import { Icon } from 'solid-heroicons'
import { archiveBox, chatBubbleLeftRight, magnifyingGlassCircle } from 'solid-heroicons/outline'
import { JSX } from 'solid-js'
import { Title, useRouteData } from 'solid-start'
import { Page } from '~/components/page'
import { useLayoutRouteData } from '~/routes/[...index]'

type HeroIcon = typeof archiveBox

const OfferingItem = (props: { icon: HeroIcon; text: string }) => {
  return (
    <li class='mb-4 flex flex-col items-center self-stretch rounded border p-3 shadow md:mb-0 md:w-1/3'>
      <Icon path={props.icon} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
      <p class='text-center text-slate-800'>{props.text}</p>
    </li>
  )
}

export default function Index() {
  const data = useRouteData<useLayoutRouteData>()

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <Page>
      <Title>CancelMe - Home</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>Time to cancel yourself</h1>

      <section class='mt-6'>
        <p class='mb-4 text-lg text-slate-900'>
          Cancel Me is an app designed to scrub through all of your tweets and flag the ones that
          are obscene or NSFW. The service is 100% free and gives you an easy way to delete your
          tweets in bulk. Our platform is perfect for those looking to clean up their profile or
          simply start from scratch.
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
        <ul class='grid list-none auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3'>
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
        <ul class='mt-10 flex list-none flex-col items-center md:flex-row md:space-x-10'>
          <OfferingItem icon={archiveBox} text='Delete bad tweets' />
          <OfferingItem icon={chatBubbleLeftRight} text='Share your score card' />
          <OfferingItem icon={magnifyingGlassCircle} text={`Search a user's score card`} />
        </ul>
      </section>

      <section class='mt-20'>
        <div class='-mx-[40px] bg-blue-500 px-[40px] py-4 lg:-mx-[120px] lg:px-[120px] xl:-mx-[200px] xl:px-[200px]'>
          <p class='text-2xl text-white'>I'm convinced</p>
          <p class='mb-4 text-3xl text-slate-900'>Please show me the platform</p>
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
