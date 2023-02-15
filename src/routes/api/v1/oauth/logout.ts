import { APIEvent, redirect } from 'solid-start/api'
import { logout } from '~/lib/session'

// logout and destroy session
export async function GET({ params, request }: APIEvent) {
  try {
    console.log('logout request received')

    return await logout(request)
  } catch (err) {
    return redirect('/')
  }
}
