import { redirect } from 'solid-start/server'
import { createCookieSessionStorage } from 'solid-start/session'
import { User } from '~/types'

const storage = createCookieSessionStorage({
  cookie: {
    name: 'cancel_me_session',
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [process.env.SESSION_SECRET as string],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }

  return userId
}

export async function getUser(request: Request): Promise<User | undefined> {
  const session = await getUserSession(request)
  const user = session.get('user')
  if (!user) return

  return JSON.parse(user)
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function createUserSession(user: User, redirectTo: string) {
  const userId = user.id_str
  const session = await storage.getSession()

  session.set('userId', userId)
  session.set('user', JSON.stringify(user))

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}
