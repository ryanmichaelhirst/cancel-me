import { Icon } from 'solid-heroicons'
import { arrowDownTray, magnifyingGlassCircle } from 'solid-heroicons/outline'
import { createSignal, JSX, onMount } from 'solid-js'
import { Title } from 'solid-start'
import { Product } from '~/types'

export default function Donate() {
  const [products, setProducts] = createSignal<Product[]>([])

  onMount(async () => {
    const resp = await (await fetch('/api/stripe/products')).json()
    console.log(resp)

    setProducts(resp)
  })

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
          $10. This donation will help us pay for hosting and domain related fees. Thank you for your
          support we greatly appreciate it!
        </p>

        <ul class='mt-10 flex list-none items-center space-x-20'>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={magnifyingGlassCircle} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Search any user's score card</p>
          </li>
          <li class='flex flex-col items-center rounded-lg border p-6 shadow'>
            <Icon path={arrowDownTray} class='mb-2 h-6 w-6 text-inherit text-blue-800' />
            <p class='text-slate-800'>Delete all your tweets</p>
          </li>
        </ul>
      </section>

      <section class='mt-20'>
        <div class='-mx-[40px] bg-blue-500 px-[40px] py-4 lg:-mx-[120px] lg:px-[120px] xl:-mx-[200px] xl:px-[200px]'>
          <p class='text-2xl text-white'>Powered by Stripe</p>
          <p class='mb-4 text-3xl text-slate-900'>Make a one time donation</p>
          {products().map((p) => (
            <div class='mr-2 flex-1 cursor-pointer rounded bg-white'>
              <div class='flex items-center rounded-t border border-b-0 border-solid p-3'>
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
              <div class='rounded-b border border-b border-t-0 border-solid bg-gray-200 p-3'>
                <form action='/api/stripe/checkout' method='post'>
                  <input name='productId' value={p.id} hidden={true} />
                  <input name='userId' value={1} type='number' hidden={true} />
                  <input name='email' value='test@gmail.com' hidden={true} />
                  <button type='submit'>Checkout</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
