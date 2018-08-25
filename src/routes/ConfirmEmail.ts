import { redis } from '../RedisInstance'
import { User } from '../entity/User'
import { Context } from 'koa'

export const confirmEmail = async (ctx: Context) => {
  const { id } = ctx.params
  const userId = await redis.get(id)
  if (userId) {
    await User.update({ id: userId }, { confirmed: true })
    await redis.del(id)
    ctx.body = 'ok'
  } else {
    ctx.body = 'invalid'
  }
}
