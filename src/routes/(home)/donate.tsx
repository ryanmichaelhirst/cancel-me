import classNames from 'classnames'
import { Icon } from 'solid-heroicons'
import { arrowDownTray, arrowUpTray, magnifyingGlassCircle } from 'solid-heroicons/outline'
import { JSX } from 'solid-js'
import { Title, useRouteData } from 'solid-start'
import { useLayoutRouteData } from '~/routes/(home)'

export default function Donate() {
  const data = useRouteData<useLayoutRouteData>()

  const onLogin: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async () => {
    const resp = await (await fetch(`/api/v1/oauth/login`)).json()

    window.open(resp.authUrl, '_self')
  }

  return (
    <main class='flex min-h-[90vh] flex-col'>
      <Title>Donate - Stripe</Title>
      <h1 class='mt-10 text-5xl text-blue-800'>Donate</h1>

      <section class='mt-6'>
        <p class='text-lg text-blue-800'>Additional Benefits</p>
        <p class='mb-2 text-2xl text-slate-800'>Gain access to better features</p>
        <p class='mb-4 text-lg text-slate-900'>
          In order to view other user's profanity score you will need to make a one time donation of
          $10. This donation will help us pay for hosting and domain related fees. Thank you for
          your support we greatly appreciate it!
        </p>

        <ul class='mt-10 flex list-none items-center justify-between'>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={magnifyingGlassCircle} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Search any user's score card</p>
          </li>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={arrowUpTray} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Upload your twitter data archive</p>
          </li>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={arrowDownTray} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Delete all your tweets</p>
          </li>
        </ul>
      </section>

      <section class='-mx-[40px] mt-20 flex-auto bg-blue-500 px-[40px] py-4 lg:-mx-[120px] lg:px-[120px] xl:-mx-[200px] xl:px-[200px]'>
        <p class='text-2xl text-white'>Powered by Stripe</p>
        <p class='mb-4 text-3xl text-slate-900'>Make a one time donation</p>
        {!data()?.credentials && (
          <button
            class='mb-4 inline-block rounded bg-white px-4 py-1 text-lg text-red-500 shadow hover:bg-gray-300'
            onClick={onLogin}
          >
            Please <span class='font-bold text-blue-500'>login</span> to make a donation!
          </button>
        )}
        {data()?.products.map((p) => (
          <div
            class={classNames(
              'flex-1 rounded bg-white',
              !data()?.credentials && 'cursor-not-allowed opacity-50',
            )}
          >
            <div class='flex items-center rounded-t border border-b-0 border-solid p-3 shadow'>
              <img
                src={p.images[0]}
                alt={`Image for ${p.name}`}
                width='60'
                height='80'
                class='mr-10'
              />
              <div>
                <h3>{p.name}</h3>
                <h5>{p.dollarAmount}</h5>
              </div>
            </div>
            <div class='rounded-b border border-b border-t-0 border-solid bg-gray-200 p-3 hover:bg-gray-300'>
              <form action='/api/stripe/checkout' method='post'>
                <input name='productId' value={p.id} hidden={true} />
                <input name='userId' value={data()?.credentials?.id_str} hidden={true} />
                <input name='email' value='test@gmail.com' hidden={true} />
                <button
                  type='submit'
                  class='w-full text-left disabled:cursor-not-allowed'
                  disabled={!data()?.credentials}
                >
                  Checkout
                </button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
