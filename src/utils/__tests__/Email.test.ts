import * as Redis from 'ioredis'
import axios from 'axios'
import { createTypeormConn } from '../CreateTyepeormConn'
import { User } from '../../entity/User'
import { createConfirmEmailLink } from '../SendEmail'

let userId: string = ''
const redis = new Redis()

beforeAll(async () => {
  await createTypeormConn()
  const user = await User.create({
    email: 'parker@gmail.com',
    password: 'remembering_me',
  }).save()
  userId = user.id
})

test('make sure it confirms user and clear key in redis', async () => {
  const url = await createConfirmEmailLink(process.env.TEST_HOST as string, userId, redis)
  const response = await axios.get(url)
  expect(response.data).toEqual('ok')
  const user = await User.findOne({ where: { id: userId } })
  expect((user as User).confirmed).toBeTruthy()
  const chunks = url.split('/')
  const redisKey = chunks[chunks.length - 1]
  const redisValue = await redis.get(redisKey)
  expect(redisValue).toBeNull()
})
