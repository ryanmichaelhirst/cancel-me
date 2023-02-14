import { getUser } from './session'

export const useUser = async (request: Request) => {
  const user = await getUser(request)

  return user
}
