import { Icon } from 'solid-heroicons'
import { arrowDownTray, magnifyingGlassCircle } from 'solid-heroicons/outline'
import type { JSX } from 'solid-js'
import { Title } from 'solid-start'

export default function Donate() {
  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    console.log('time to donate')
  }

  return (
    <main class='min-h-full'>
      <Title>Donate - Stripe</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>Donate</h1>

      <section class='mt-6'>
        <p class='text-lg text-blue-800'>Additional Benefits</p>
        <p class='mb-2 text-2xl text-slate-800'>Gain access to better features</p>
        <p class='mb-4 text-lg text-slate-900'>
          In order to view other user's profanity score you will need to make a one time donation of
          $5. This donation will help us pay for hosting and domain related fees. Thank you for your
          support we greatly appreciate it!
        </p>

        <ul class='mt-10 flex list-none items-center space-x-20'>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={magnifyingGlassCircle} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Search any user's score card</p>
          </li>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={arrowDownTray} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Download your tweet history</p>
          </li>
        </ul>
      </section>

      <section class='mt-20'>
        <div class='-mx-[40px] bg-blue-500 px-[40px] py-4'>
          <p class='text-2xl text-white'>Powered by Stripe</p>
          <p class='mb-4 text-3xl text-slate-900'>Make a one time donation</p>
          <button
            onClick={onClick}
            class='rounded border border-white py-1 px-2 text-white hover:border-blue-600 hover:bg-blue-600'
          >
            Donate now
          </button>
        </div>
      </section>
    </main>
  )
}
