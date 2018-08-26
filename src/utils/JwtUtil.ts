import { User } from '../entity/User'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from './Consts'

export function signUser(user: User) {
  const token = sign({ id: user.id }, JWT_SECRET)
  return token
}
